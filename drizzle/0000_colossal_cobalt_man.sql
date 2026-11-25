CREATE TABLE `civic_votes` (
	`topic_id` text NOT NULL,
	`voter_id` text NOT NULL,
	`created_at` integer NOT NULL,
	PRIMARY KEY(`topic_id`, `voter_id`)
);
