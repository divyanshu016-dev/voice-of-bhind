import { and, eq, sql } from 'drizzle-orm';
import { getDb } from '../../../db';
import { civicVotes } from '../../../db/schema';
import { civicTopicIds, civicTopics } from '../../../lib/civic-topics';

const COOKIE = 'vob_voter';
const COOKIE_AGE = 60 * 60 * 24 * 365;

function voterFor(request: Request) {
  const match = request.headers.get('cookie')?.match(/(?:^|;\s*)vob_voter=([a-f0-9-]{36})(?:;|$)/);
  const known = match?.[1] && /^[a-f0-9-]{36}$/.test(match[1]);
  return { id: known ? match![1] : crypto.randomUUID(), newCookie: !known };
}

function responseHeaders(request: Request, voter: {id:string;newCookie:boolean}) {
  const headers = new Headers({ 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff' });
  if (voter.newCookie) {
    const secure = new URL(request.url).protocol === 'https:' ? '; Secure' : '';
    headers.set('Set-Cookie', `${COOKIE}=${voter.id}; Path=/; Max-Age=${COOKIE_AGE}; SameSite=Lax; HttpOnly${secure}`);
  }
  return headers;
}

async function summary(voterId: string) {
  const db = getDb();
  const [counts, mine, [unique]] = await Promise.all([
    db.select({ topicId: civicVotes.topicId, count: sql<number>`count(*)` }).from(civicVotes).groupBy(civicVotes.topicId),
    db.select({ topicId: civicVotes.topicId }).from(civicVotes).where(eq(civicVotes.voterId, voterId)),
    db.select({ count: sql<number>`count(distinct ${civicVotes.voterId})` }).from(civicVotes)
  ]);
  const votesById = Object.fromEntries(counts.map(row => [row.topicId, Number(row.count)]));
  const selected = mine.map(row => row.topicId).filter(id => civicTopicIds.has(id));
  const topics = civicTopics.map(topic => ({ id: topic.id, votes: votesById[topic.id] ?? 0 }));
  return { topics, selected, participants: Number(unique?.count ?? 0), totalVotes: topics.reduce((total, topic) => total + topic.votes, 0) };
}

function failed(error: unknown) {
  console.error('Community voting unavailable', error);
  return Response.json({ error: 'The community vote is temporarily unavailable. Please try again later.' }, { status: 503, headers: { 'Cache-Control': 'no-store' } });
}

export async function GET(request: Request) {
  const voter = voterFor(request);
  try { return Response.json(await summary(voter.id), { headers: responseHeaders(request, voter) }); }
  catch (error) { return failed(error); }
}

export async function POST(request: Request) {
  const origin = request.headers.get('origin');
  if (origin && origin !== new URL(request.url).origin) return Response.json({ error: 'Invalid origin.' }, { status: 403 });
  if (!request.headers.get('content-type')?.toLowerCase().startsWith('application/json')) return Response.json({ error: 'Expected JSON.' }, { status: 415 });
  if (Number(request.headers.get('content-length') || '0') > 512) return Response.json({ error: 'Request too large.' }, { status: 413 });
  const voter = voterFor(request);
  let data: { topicId?: unknown; support?: unknown };
  try {
    const body = await request.text();
    if (new TextEncoder().encode(body).byteLength > 512) {
      return Response.json({ error: 'Request too large.' }, { status: 413, headers: responseHeaders(request, voter) });
    }
    data = JSON.parse(body);
  } catch {
    return Response.json({ error: 'Invalid JSON.' }, { status: 400, headers: responseHeaders(request, voter) });
  }
  try {
    if (!data || typeof data !== 'object' || Array.isArray(data) || typeof data.topicId !== 'string' || !civicTopicIds.has(data.topicId) || typeof data.support !== 'boolean') {
      return Response.json({ error: 'Invalid voting choice.' }, { status: 400, headers: responseHeaders(request, voter) });
    }
    const db = getDb();
    if (data.support) await db.insert(civicVotes).values({ topicId: data.topicId, voterId: voter.id, createdAt: Date.now() }).onConflictDoNothing();
    else await db.delete(civicVotes).where(and(eq(civicVotes.topicId, data.topicId), eq(civicVotes.voterId, voter.id)));
    return Response.json(await summary(voter.id), { headers: responseHeaders(request, voter) });
  } catch (error) { return failed(error); }
}
