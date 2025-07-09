
import { mysqlTable, text, int, boolean } from "drizzle-orm/mysql-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = mysqlTable("users", {
  id: int("id").primaryKey().autoincrement(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const forms = mysqlTable("forms", {
  id: int("id").primaryKey().autoincrement(),
  name: text("name").notNull(),
  rankGroup: text("rank_group").notNull(),
  versionNo: text("version_no").notNull(),
  versionDate: text("version_date").notNull(),
});

export const rankGroups = mysqlTable("rank_groups", {
  id: int("id").primaryKey().autoincrement(),
  formId: int("form_id").notNull().references(() => forms.id),
  name: text("name").notNull(),
  ranks: text("ranks").notNull(), // JSON string for MySQL compatibility
});

export const availableRanks = mysqlTable("available_ranks", {
  id: int("id").primaryKey().autoincrement(),
  name: text("name").notNull(),
  category: text("category").notNull(), // Senior Officers, Junior Officers, Ratings, etc.
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertFormSchema = createInsertSchema(forms).pick({
  name: true,
  rankGroup: true,
  versionNo: true,
  versionDate: true,
});

export const insertRankGroupSchema = createInsertSchema(rankGroups).pick({
  formId: true,
  name: true,
  ranks: true,
});

export const insertAvailableRankSchema = createInsertSchema(availableRanks).pick({
  name: true,
  category: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertForm = z.infer<typeof insertFormSchema>;
export type Form = typeof forms.$inferSelect;
export type InsertRankGroup = z.infer<typeof insertRankGroupSchema>;
export type RankGroup = typeof rankGroups.$inferSelect;
export type InsertAvailableRank = z.infer<typeof insertAvailableRankSchema>;
export type AvailableRank = typeof availableRanks.$inferSelect;
