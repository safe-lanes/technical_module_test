
import { mysqlTable, text, int, boolean, timestamp } from "drizzle-orm/mysql-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = mysqlTable("users", {
  id: int("id").primaryKey().autoincrement(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});



export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});



export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Spares Management Tables
export const spareParts = mysqlTable("spare_parts", {
  id: int("id").primaryKey().autoincrement(),
  partCode: text("part_code").notNull(),
  partName: text("part_name").notNull(),
  component: text("component").notNull(),
  componentId: text("component_id").notNull(),
  critical: text("critical").notNull().default("No"), // "Yes", "No", "Critical"
  rob: int("rob").notNull().default(0), // Remaining on Board
  minStock: int("min_stock").notNull().default(0),
  location: text("location").notNull(),
  vessel: text("vessel"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});

export const spareComponents = mysqlTable("spare_components", {
  id: text("id").primaryKey(), // e.g., "6.01.001"
  name: text("name").notNull(),
  parentId: text("parent_id"), // Reference to parent component
  level: int("level").notNull().default(0), // Tree depth level
  expanded: boolean("expanded").default(false),
  createdAt: timestamp("created_at").defaultNow()
});

export const spareHistory = mysqlTable("spare_history", {
  id: int("id").primaryKey().autoincrement(),
  sparePartId: int("spare_part_id").notNull(),
  action: text("action").notNull(), // "added", "used", "updated", "transferred"
  quantity: int("quantity").notNull(),
  previousStock: int("previous_stock"),
  newStock: int("new_stock"),
  location: text("location"),
  notes: text("notes"),
  performedBy: text("performed_by"),
  performedAt: timestamp("performed_at").defaultNow()
});

// Insert schemas for spares
export const insertSparePartSchema = createInsertSchema(spareParts).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});

export const insertSpareComponentSchema = createInsertSchema(spareComponents).omit({
  createdAt: true
});

export const insertSpareHistorySchema = createInsertSchema(spareHistory).omit({
  id: true,
  performedAt: true
});

// Types for spares
export type InsertSparePart = z.infer<typeof insertSparePartSchema>;
export type SparePart = typeof spareParts.$inferSelect;

export type InsertSpareComponent = z.infer<typeof insertSpareComponentSchema>;
export type SpareComponent = typeof spareComponents.$inferSelect;

export type InsertSpareHistory = z.infer<typeof insertSpareHistorySchema>;
export type SpareHistory = typeof spareHistory.$inferSelect;
