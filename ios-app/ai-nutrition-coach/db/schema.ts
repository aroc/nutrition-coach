import { sqliteTable, text, integer, real } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";

const id = text("id").primaryKey();

const timestamps = {
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
};

const nutritionFields = {
  calories: integer("calories").notNull(),
  protein_grams: integer("protein_grams").notNull(),
  fat_grams: integer("fat_grams").notNull(),
  fat_saturated_grams: integer("fat_saturated_grams"),
  fat_monounsaturated_grams: integer("fat_monounsaturated_grams"),
  fat_polyunsaturated_grams: integer("fat_polyunsaturated_grams"),
  carbs_grams: integer("carbs_grams").notNull(),
  carbs_fiber_grams: integer("carbs_fiber_grams"),
  carbs_sugar_grams: integer("carbs_sugar_grams"),
};

export const loggedFoodItems = sqliteTable("logged_food_items", {
  id,
  userId: text("user_id").notNull(),
  description: text("description"),
  ...nutritionFields,
  meal_type: text("meal_type"),
  ...timestamps,
});

export const userGoals = sqliteTable("user_goals", {
  id,
  userId: text("user_id").notNull(),
  description: text("description"),
  ...nutritionFields,
  ...timestamps,
});

export const userChatMessages = sqliteTable("user_chat_messages", {
  id,
  userId: text("user_id"),
  message: text("message").notNull(),
  isAssistant: integer("is_assistant", { mode: "boolean" }).default(false),
  ...timestamps,
});
