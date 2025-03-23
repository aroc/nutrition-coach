CREATE TABLE `user_chat_messages` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text,
	`message` text NOT NULL,
	`is_assistant` integer DEFAULT false,
	`created_at` integer DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` integer DEFAULT CURRENT_TIMESTAMP NOT NULL
);
