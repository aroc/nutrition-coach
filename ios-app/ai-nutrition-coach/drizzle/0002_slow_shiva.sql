PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_user_chat_messages` (
	`id` text PRIMARY KEY NOT NULL,
	`author_id` text,
	`recipient_id` text,
	`message` text NOT NULL,
	`message_action` text,
	`created_at` integer DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` integer DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
INSERT INTO `__new_user_chat_messages`("id", "author_id", "recipient_id", "message", "message_action", "created_at", "updated_at") SELECT "id", "author_id", "recipient_id", "message", "message_action", "created_at", "updated_at" FROM `user_chat_messages`;--> statement-breakpoint
DROP TABLE `user_chat_messages`;--> statement-breakpoint
ALTER TABLE `__new_user_chat_messages` RENAME TO `user_chat_messages`;--> statement-breakpoint
PRAGMA foreign_keys=ON;