import { integer, primaryKey, sqliteTable, text } from "drizzle-orm/sqlite-core";

// Each pseudonymous browser token can support a specific topic only once.
export const civicVotes = sqliteTable("civic_votes", {
  topicId: text("topic_id").notNull(),
  voterId: text("voter_id").notNull(),
  createdAt: integer("created_at").notNull(),
}, (table) => [primaryKey({ columns: [table.topicId, table.voterId] })]);
