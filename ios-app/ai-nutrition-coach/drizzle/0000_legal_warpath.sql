CREATE TABLE `logged_food_items` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`description` text,
	`calories` integer NOT NULL,
	`protein_grams` integer NOT NULL,
	`fat_grams` integer NOT NULL,
	`fat_saturated_grams` integer,
	`fat_monounsaturated_grams` integer,
	`fat_polyunsaturated_grams` integer,
	`carbs_grams` integer NOT NULL,
	`carbs_fiber_grams` integer,
	`carbs_sugar_grams` integer,
	`meal_type` text,
	`created_at` integer DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` integer DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE `user_goals` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`description` text,
	`calories` integer NOT NULL,
	`protein_grams` integer NOT NULL,
	`fat_grams` integer NOT NULL,
	`fat_saturated_grams` integer,
	`fat_monounsaturated_grams` integer,
	`fat_polyunsaturated_grams` integer,
	`carbs_grams` integer NOT NULL,
	`carbs_fiber_grams` integer,
	`carbs_sugar_grams` integer,
	`created_at` integer DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` integer DEFAULT CURRENT_TIMESTAMP NOT NULL
);
