
import { mysqlTable, text, int, boolean, timestamp, decimal, index } from "drizzle-orm/mysql-core";
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

// Running Hours Audit Table
export const runningHoursAudit = mysqlTable("running_hours_audit", {
  id: int("id").primaryKey().autoincrement(),
  vesselId: text("vessel_id").notNull(),
  componentId: text("component_id").notNull(),
  previousRH: decimal("previous_rh", { precision: 10, scale: 2 }).notNull(),
  newRH: decimal("new_rh", { precision: 10, scale: 2 }).notNull(),
  cumulativeRH: decimal("cumulative_rh", { precision: 10, scale: 2 }).notNull(),
  dateUpdatedLocal: text("date_updated_local").notNull(), // DD-MMM-YYYY HH:mm
  dateUpdatedTZ: text("date_updated_tz").notNull(), // e.g., Asia/Kolkata
  enteredAtUTC: timestamp("entered_at_utc").notNull(),
  userId: text("user_id").notNull(),
  source: text("source").notNull(), // 'single' | 'bulk'
  notes: text("notes"),
  meterReplaced: boolean("meter_replaced").notNull().default(false),
  oldMeterFinal: decimal("old_meter_final", { precision: 10, scale: 2 }),
  newMeterStart: decimal("new_meter_start", { precision: 10, scale: 2 }),
  version: int("version").notNull().default(1),
}, (table) => ({
  componentIdIdx: index("idx_component_entered").on(table.componentId, table.enteredAtUTC),
  componentDateIdx: index("idx_component_date").on(table.componentId, table.dateUpdatedLocal),
}));

export const insertRunningHoursAuditSchema = createInsertSchema(runningHoursAudit).omit({
  id: true,
});

export type InsertRunningHoursAudit = z.infer<typeof insertRunningHoursAuditSchema>;
export type RunningHoursAudit = typeof runningHoursAudit.$inferSelect;

// Components Table (for storing current cumulative RH)
export const components = mysqlTable("components", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  componentCode: text("component_code"),
  category: text("category").notNull(),
  currentCumulativeRH: decimal("current_cumulative_rh", { precision: 10, scale: 2 }).notNull().default("0"),
  lastUpdated: text("last_updated"),
  vesselId: text("vessel_id").notNull().default("V001"),
});

export const insertComponentSchema = createInsertSchema(components).omit({});

export type InsertComponent = z.infer<typeof insertComponentSchema>;
export type Component = typeof components.$inferSelect;
