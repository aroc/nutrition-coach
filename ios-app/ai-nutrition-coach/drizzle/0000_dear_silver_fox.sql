CREATE TABLE `audio_files` (
	`id` text PRIMARY KEY NOT NULL,
	`user_prompt` text,
	`file_name` text,
	`file_url` text,
	`file_type` text,
	`created_at` integer DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` integer DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE `mixes` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`audio_files` text DEFAULT '[]' NOT NULL,
	`created_at` integer DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` integer DEFAULT CURRENT_TIMESTAMP NOT NULL
);
