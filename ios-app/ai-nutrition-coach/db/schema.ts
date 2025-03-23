import { sqliteTable, text, integer, real } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";
import { AudioFileMixEntry } from "@/types/index";

const id = text("id").primaryKey();

const timestamps = {
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
};

export const mixes = sqliteTable("mixes", {
  id,
  name: text("name").notNull(),
  isTemporary: integer("is_temporary", { mode: "boolean" })
    .notNull()
    .default(false),
  // Store serialized array of AudioFileEntry objects
  audioFiles: text("audio_files", { mode: "json" })
    .$type<AudioFileMixEntry[]>()
    .notNull()
    .default(sql`'[]'`),
  ...timestamps,
});

export const audioFiles = sqliteTable("audio_files", {
  id,
  userPrompt: text("user_prompt"),
  fileName: text("file_name"),
  fileUrl: text("file_url"),
  fileType: text("file_type"),
  ...timestamps,
});
