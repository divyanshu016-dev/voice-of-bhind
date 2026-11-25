'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { civicTopics } from '../lib/civic-topics';
import { ArtGallery } from './IndianArt';

const FILTERS = ['All priorities', 'Infrastructure', 'Essential services', 'Community life', 'Accountability'];
const accentColors = { coral: '#c95540', blue: '#3e7190', green: '#4a7963', yellow: '#d89a35', purple: '#886593' };
const LOAD_ERROR = 'Shared votes are temporarily unavailable. Please retry in a moment.';

async function fetchStats() {
  const response = await fetch('/api/priorities', { credentials: 'same-origin', cache: 'no-store' });
  if (!response.ok) throw new Error('Community totals could not be loaded.');
  return response.json();
}

function Brand() {
  return <a className="brand" href="#top" aria-label="Voice of Bhind home">
    <span className="brand-icon" aria-hidden="true"><svg viewBox="0 0 48 48" width="33" height="33" fill="none"><path d="M24 7v34M7 24h34M12 12l24 24M36 12 12 36" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"/><circle cx="24" cy="24" r="12" fill="#f8dfaa" stroke="currentColor" strokeWidth="1.7"/><path d="M18 21q6-9 12 0v7H23l-5 5v-5h0z" fill="#bd513b" stroke="#6a2926" strokeWidth="1.3"/><circle cx="24" cy="24" r="2" fill="#f8dfaa"/></svg></span>
    <span className="brand-type"><strong>VOICE <i>OF</i> BHIND</strong><small lang="hi">भिंड की आवाज़</small></span>
  </a>;
}

function ShareIcon() {
  return <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><path d="m8.6 10.6 6.7-4.1m-6.7 8 6.7 3.8"/></svg>;
}

function PulseCard({ stats, loading }) {
  const ranked = [...civicTopics].sort((a,b) => (stats?.topics?.find(row => row.id === b.id)?.votes ?? 0)-(stats?.topics?.find(row => row.id === a.id)?.votes ?? 0)).slice(0,3);
  const top = Math.max(1, ...ranked.map(topic => stats?.topics?.find(row => row.id === topic.id)?.votes ?? 0));
  return <div className="pulse-card">
    <div className="pulse-heading"><span><span className="pulse-live-dot"/> COMMUNITY PULSE</span><span className="pulse-badge">LIVE TOTALS</span></div>
    <div className="pulse-main"><div className="pulse-main-top"><span>What Bhind is talking about</span><span className="pulse-signal" aria-hidden="true"><i/><i/><i/><i/><i/><i/></span></div><h3>Our shared priorities</h3><p>Every support vote contributes to the public ranking.</p></div>
    <div className="pulse-ranked" aria-live="polite">{ranked.map((topic,index) => {
      const votes = stats?.topics?.find(row => row.id === topic.id)?.votes ?? 0;
      const width = stats ? Math.max(votes ? 9 : 0,(votes/top)*100) : 0;
      return <div className="pulse-ranked-item" key={topic.id}><div className="pulse-row-title"><span className="pulse-number">0{index+1}</span><span>{topic.title}</span><strong>{loading ? '—' : votes}</strong></div><div className="pulse-track"><div className="pulse-fill" style={{width:`${width}%`,background:accentColors[topic.accent]}}/></div></div>;
    })}</div>
    <div className="pulse-bottom"><span>✳</span>{stats?.totalVotes ? `${stats.totalVotes.toLocaleString('en-IN')} support votes and counting` : 'Your city’s first votes begin here'}</div>
  </div>;
}

function TopicCard({ topic, votes, selected, busy, onVote, onShare, maxVotes, loading }) {
  const progress = maxVotes > 0 ? Math.round((votes/maxVotes)*100) : 0;
  return <article className="topic-card" id={`topic-${topic.id}`}>
    <div className="topic-top"><span className={`topic-symbol accent-${topic.accent}`}>{topic.icon}</span><span className="topic-category">{topic.category}</span><span className="topic-card-stamp">COMMUNITY PRIORITY</span></div>
    <h3>{topic.title}</h3><div className="topic-hindi" lang="hi">{topic.titleHi}</div><p className="topic-summary">{topic.summary}</p>
    <div className="topic-impact"><span className="impact-sparkle">✳</span><span>{topic.impact}</span></div>
    <div className="vote-section"><div className="vote-count"><span><strong>{loading ? '—' : votes.toLocaleString('en-IN')}</strong> {votes === 1 ? 'support vote' : 'support votes'}</span><span className="vote-progress-label">{maxVotes > 0 ? `${progress}% of top topic` : 'Your vote matters'}</span></div><div className="vote-progress-track"><div className="vote-progress-fill" style={{width:`${progress}%`}}/></div></div>
    <div className="topic-actions"><button type="button" className={`vote-button ${selected?'selected':''}`} onClick={() => onVote(topic.id)} disabled={loading || busy} aria-pressed={selected}>{busy ? 'Updating...' : selected ? '✓ You support this' : 'Support this priority'}</button><button type="button" className="share-topic" onClick={() => onShare(topic.id,topic.title)} aria-label={`Share ${topic.title}`} title="Share this priority"><ShareIcon/></button></div>
  </article>;
}

export default function App() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(null);
  const [filter, setFilter] = useState(FILTERS[0]);
  const [sort, setSort] = useState('most');
  const [menuOpen, setMenuOpen] = useState(false);
  const [toast, setToast] = useState('');
  const toastTimer = useRef(null);

  async function loadStats() {
    setLoading(true);
    setError('');
    try {
      setStats(await fetchStats());
    } catch { setError(LOAD_ERROR); }
    finally { setLoading(false); }
  }
  useEffect(() => {
    let active = true;
    fetchStats()
      .then(data => { if (active) setStats(data); })
      .catch(() => { if (active) setError(LOAD_ERROR); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; clearTimeout(toastTimer.current); };
  }, []);

  const voteCounts = useMemo(() => new Map(stats?.topics?.map(topic => [topic.id, topic.votes]) ?? []), [stats]);
  const countFor = id => voteCounts.get(id) ?? 0;
  const selected = stats?.selected ?? [];
  const maxVotes = Math.max(0,...civicTopics.map(topic => countFor(topic.id)));
  const visibleTopics = useMemo(() => {
    const result = civicTopics.filter(topic => filter === FILTERS[0] || topic.category === filter);
    if (sort === 'most') result.sort((a,b) => (voteCounts.get(b.id) ?? 0)-(voteCounts.get(a.id) ?? 0));
    else if (sort === 'az') result.sort((a,b) => a.title.localeCompare(b.title));
    return result;
  }, [filter,sort,voteCounts]);

  function showToast(message) {
    clearTimeout(toastTimer.current); setToast(message);
    toastTimer.current = setTimeout(() => setToast(''),4200);
  }
  async function vote(topicId) {
    if (busy || !stats) return;
    const support = !selected.includes(topicId);
    setBusy(topicId);
    try {
      const response = await fetch('/api/priorities', {method:'POST',credentials:'same-origin',headers:{'Content-Type':'application/json'},body:JSON.stringify({topicId,support})});
      if (!response.ok) throw new Error('Vote failed');
      setStats(await response.json());
      showToast(support?'Your vote is now part of Bhind’s shared results.':'Your support has been removed.');
    } catch { showToast('Could not update your vote. Please try again.'); }
    finally { setBusy(null); }
  }
  async function share(url, message = 'See and support the priorities Bhind cares about.') {
    try {
      if(navigator.share) await navigator.share({title:'Voice of Bhind',text:message,url});
      else if(navigator.clipboard?.writeText){ await navigator.clipboard.writeText(url);showToast('Link copied. Share Bhind’s voice!'); }
      else showToast('Share this page using your browser’s address bar.');
    } catch(error){if(error?.name!=='AbortError')showToast('Could not share this link.');}
  }
  function shareTopic(id,title){share(`${window.location.origin}/#topic-${id}`, `Support this priority for Bhind: ${title}`);}

  return <>
    <div className="announcement"><div className="shell announcement-inner"><span className="announce-pulse"/> <span>A PEOPLE-POWERED SPACE FOR BHIND</span><span className="announcement-right">BHIND, MADHYA PRADESH <span className="announce-divider">✳</span> हम सबकी आवाज़</span></div></div>
    <header className="site-header" id="top"><div className="shell header-inner"><Brand/><button type="button" className="mobile-menu" aria-label="Toggle navigation" aria-expanded={menuOpen} onClick={()=>setMenuOpen(!menuOpen)}><span/><span/><span/></button><nav className={`nav ${menuOpen?'open':''}`} aria-label="Main navigation"><a href="#priorities" onClick={()=>setMenuOpen(false)}>Community vote</a><a href="#why-it-matters" onClick={()=>setMenuOpen(false)}>Our purpose</a><a href="#how-it-works" onClick={()=>setMenuOpen(false)}>How it works</a><button type="button" className="nav-share" onClick={()=>{setMenuOpen(false);share(window.location.href);}}>Share this website</button></nav></div></header>

    <main>
      <section className="hero"><div className="hero-dots" aria-hidden="true"/><div className="shell hero-layout"><div className="hero-copy"><div className="eyebrow hero-eyebrow"><span className="hero-eyebrow-star">✳</span> THE CITY IS OURS TO SHAPE</div><h1>Many voices.<br/><span>One Bhind.</span><br/>A brighter <em>tomorrow.</em></h1><p className="hero-hindi" lang="hi">हमारा भिंड। हमारी बात। हमारी आवाज़।</p><p className="hero-lead">What should Bhind move forward? Choose the ideas that matter to you, see what others support, and make our shared priorities visible far beyond the city.</p><div className="hero-buttons"><a href="#priorities" className="button button-coral">Explore & vote</a><a href="#how-it-works" className="button button-outline">How it works</a></div><div className="hero-smallnote"><span>✺</span> Independent voices · Shared purpose · Open to everyone</div></div><div className="hero-visual"><div className="art-intro"><span>AN IDEA ROOTED IN INDIA</span><span>Art brings stories together. So can we.</span></div><ArtGallery/><div className="hero-pulse"><PulseCard stats={stats} loading={loading}/></div><p className="art-attribution">Original illustrations inspired by Indian folk art traditions.</p></div></div><div className="hero-stripe"/></section>

      <section className="numbers-strip"><div className="shell numbers-row"><div className="number-item"><span className="number-icon">◈</span><div><strong>{loading?'—':(stats?.totalVotes??0).toLocaleString('en-IN')}</strong><small>Public support votes</small></div></div><div className="number-item"><span className="number-icon">◎</span><div><strong>{civicTopics.length}</strong><small>Community priorities</small></div></div><div className="number-item"><span className="number-icon">✳</span><div><strong>{loading?'—':(stats?.participants??0).toLocaleString('en-IN')}</strong><small>Participating browsers*</small></div></div><div className="numbers-note">Every vote adds to a shared view of what matters. <strong>Visible to all visitors.</strong></div></div></section>

      <section className="priorities-section section" id="priorities"><div className="shell"><div className="section-topline"><span className="eyebrow dark">THE COMMUNITY BALLOT</span><span className="section-mini">NOT COMPLAINTS. COLLECTIVE PRIORITIES.</span></div><div className="section-title-row"><div><h2>The ideas we<br/><em>stand behind.</em></h2><p>Support any number of priorities. The community ranking updates from everyone’s votes — and anyone visiting can see it.</p></div><div className="ballot-stamp">YOUR CITY<br/>YOUR SAY<span>✳</span></div></div>
        <div className="vote-notice"><span className="notice-icon">i</span><p>These are <strong>proposed civic priorities</strong>, not claims that a specific incident happened or that anyone is at fault. Vote totals are real shared counts when available. This is an informal community pulse, not an official survey.</p></div>
        {error && <div className="error-banner" role="alert"><span>{error}</span><button type="button" onClick={loadStats}>Retry</button></div>}
        <div className="priority-toolbar"><div className="filter-list" role="group" aria-label="Priority category">{FILTERS.map(item=><button type="button" key={item} className={`filter-chip ${filter===item?'active':''}`} aria-pressed={filter===item} onClick={()=>setFilter(item)}>{item}</button>)}</div><label className="sort-label">Sort by <select value={sort} onChange={event=>setSort(event.target.value)} aria-label="Sort priorities"><option value="most">Most supported</option><option value="original">All topics</option><option value="az">A to Z</option></select></label></div>
        <div className="topic-grid">{visibleTopics.map(topic=><TopicCard key={topic.id} topic={topic} votes={countFor(topic.id)} selected={selected.includes(topic.id)} busy={busy===topic.id} onVote={vote} onShare={shareTopic} maxVotes={maxVotes} loading={loading||!!error}/>)}</div>
        <div className="ballot-footnote"><span>ⓘ</span> Voting is anonymous and limited to one support vote per browser for each topic. You can change your choice. Counts may not represent unique residents.</div>
      </div></section>

      <section className="voice-banner"><div className="shell voice-banner-inner"><div className="banner-icon" aria-hidden="true">“</div><div><span className="eyebrow light">A VOICE THAT TRAVELS</span><h2>Not just to the administration.<br/><em>To everyone who&apos;s listening.</em></h2><p>A shared, publicly visible list of priorities gives neighbors, journalists, community groups, students and decision-makers something concrete to talk about.</p></div><button type="button" className="button button-coral" onClick={()=>share(window.location.href)}>Share our collective voice</button></div></section>

      <section className="why-section section" id="why-it-matters"><div className="shell"><div className="section-topline"><span className="eyebrow dark">WHY THIS EXISTS</span><span className="section-mini">A DIFFERENT KIND OF LOCAL PLATFORM</span></div><div className="why-header"><h2>From scattered thoughts<br/>to a <em>shared conversation.</em></h2><p>We don&apos;t need to agree on every issue. We do need a place where local concerns are visible, priorities can emerge, and ideas can travel beyond one conversation.</p></div><div className="why-grid"><div className="why-card"><div className="why-icon">◎</div><h3>Public by design</h3><p>Everyone who visits can read the priorities and see how much support each idea receives.</p></div><div className="why-card"><div className="why-icon">◈</div><h3>People set the agenda</h3><p>Multiple ideas can be supported. Collective attention helps show what matters most to participating visitors.</p></div><div className="why-card"><div className="why-icon">✳</div><h3>Facts before blame</h3><p>Discuss improvements openly, without treating speculation or personal allegations as established facts.</p></div></div></div></section>

      <section className="how-section section" id="how-it-works"><div className="shell how-layout"><div className="how-title"><span className="eyebrow light">HOW TO TAKE PART</span><h2>Small action.<br/><em>Stronger voice.</em></h2><p>It takes only a moment to make a priority more visible. No complaint form and no long process.</p><a className="button button-coral" href="#priorities">Cast your support vote</a></div><div className="how-steps"><div className="how-step"><span>01</span><div><h3>Explore the priorities</h3><p>Read the ideas and decide what would improve life in Bhind.</p></div><strong>⌕</strong></div><div className="how-step"><span>02</span><div><h3>Support what matters</h3><p>Vote on more than one topic. Your choices join the shared totals.</p></div><strong>✓</strong></div><div className="how-step"><span>03</span><div><h3>Help the voice travel</h3><p>Share the link so more residents and interested people can see the same conversation.</p></div><strong>⌁</strong></div></div></div></section>

      <section className="fairness-section"><div className="shell fairness-layout"><div className="fairness-emblem">✳</div><div><h3>Open conversation. Honest limitations.</h3><p>This site is independent and not affiliated with any government office. Votes are informal expressions of support, not verified residency or a representative poll. A browser cookie helps limit repeat votes, but can be cleared; stronger anti-manipulation safeguards would be needed for formal decisions.</p></div></div></section>

      <section className="closing"><div className="shell closing-inner"><span className="eyebrow dark">भिंड के लिए, भिंड की आवाज़</span><h2>Make our city&apos;s<br/><em>priorities impossible to ignore.</em></h2><p>One voice can begin a conversation. Many voices can keep it going.</p><div className="closing-actions"><a href="#priorities" className="button button-dark">Explore the community vote</a><button type="button" className="button button-white" onClick={()=>share(window.location.href)}>Invite someone to take part</button></div></div></section>
    </main>

    <footer className="footer"><div className="shell footer-main"><Brand/><p>A citizen-led concept for Bhind, Madhya Pradesh. Open civic discussion and collective priorities. Independent of official authorities.</p><a href="#top">Back to top</a></div><div className="shell footer-bottom"><span>© {new Date().getFullYear()} Voice of Bhind · भिंड की आवाज़</span><span>Share ideas. Support priorities. Stay fair.</span></div></footer>
    <div className={`toast ${toast?'visible':''}`} role="status" aria-live="polite">{toast}</div>
  </>;
}
