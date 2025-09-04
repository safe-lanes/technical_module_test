import {
  mysqlTable,
  text,
  int,
  boolean,
  timestamp,
  decimal,
  index,
  json,
  varchar,
} from 'drizzle-orm/mysql-core';
import { sql } from 'drizzle-orm';
import { createInsertSchema } from 'drizzle-zod';
import { z } from 'zod';

export const users = mysqlTable('users', {
  id: int('id').primaryKey().autoincrement(),
  username: varchar('username', { length: 255 }).notNull().unique(),
  password: varchar('password', { length: 255 }).notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Running Hours Audit Table
export const runningHoursAudit = mysqlTable(
  'running_hours_audit',
  {
    id: int('id').primaryKey().autoincrement(),
    vesselId: varchar('vessel_id', { length: 50 }).notNull(),
    componentId: varchar('component_id', { length: 100 }).notNull(),
    previousRH: decimal('previous_rh', { precision: 10, scale: 2 }).notNull(),
    newRH: decimal('new_rh', { precision: 10, scale: 2 }).notNull(),
    cumulativeRH: decimal('cumulative_rh', {
      precision: 10,
      scale: 2,
    }).notNull(),
    dateUpdatedLocal: varchar('date_updated_local', { length: 50 }).notNull(),
    dateUpdatedTZ: varchar('date_updated_tz', { length: 50 }).notNull(),
    enteredAtUTC: timestamp('entered_at_utc').notNull(),
    userId: varchar('user_id', { length: 100 }).notNull(),
    source: varchar('source', { length: 20 }).notNull(),
    notes: text('notes'),
    meterReplaced: boolean('meter_replaced').notNull().default(false),
    oldMeterFinal: decimal('old_meter_final', { precision: 10, scale: 2 }),
    newMeterStart: decimal('new_meter_start', { precision: 10, scale: 2 }),
    version: int('version').notNull().default(1),
  },
  table => ({
    componentIdIdx: index('idx_component_entered').on(
      table.componentId,
      table.enteredAtUTC
    ),
    componentDateIdx: index('idx_component_date').on(
      table.componentId,
      table.dateUpdatedLocal
    ),
  })
);

export const insertRunningHoursAuditSchema = createInsertSchema(
  runningHoursAudit
).omit({
  id: true,
});

export type InsertRunningHoursAudit = z.infer<
  typeof insertRunningHoursAuditSchema
>;
export type RunningHoursAudit = typeof runningHoursAudit.$inferSelect;

// Components Table
export const components = mysqlTable('components', {
  id: varchar('id', { length: 100 }).primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  componentCode: varchar('component_code', { length: 100 }),
  parentId: varchar('parent_id', { length: 100 }),
  category: varchar('category', { length: 100 }).notNull(),
  currentCumulativeRH: decimal('current_cumulative_rh', {
    precision: 10,
    scale: 2,
  })
    .notNull()
    .default('0'),
  lastUpdated: varchar('last_updated', { length: 50 }),
  vesselId: varchar('vessel_id', { length: 50 }).notNull().default('V001'),
  maker: varchar('maker', { length: 255 }),
  model: varchar('model', { length: 255 }),
  serialNo: varchar('serial_no', { length: 255 }),
  deptCategory: varchar('dept_category', { length: 100 }),
  componentCategory: varchar('component_category', { length: 100 }),
  location: varchar('location', { length: 255 }),
  commissionedDate: varchar('commissioned_date', { length: 50 }),
  critical: boolean('critical').default(false),
  classItem: boolean('class_item').default(false),
});

export const insertComponentSchema = createInsertSchema(components).omit({});

export type InsertComponent = z.infer<typeof insertComponentSchema>;
export type Component = typeof components.$inferSelect;

// Form Definitions Table
export const formDefinitions = mysqlTable('form_definitions', {
  id: int('id').primaryKey().autoincrement(),
  name: varchar('name', { length: 100 }).notNull().unique(),
  subgroup: varchar('subgroup', { length: 100 }),
});

export const insertFormDefinitionSchema = createInsertSchema(
  formDefinitions
).omit({
  id: true,
});

export type InsertFormDefinition = z.infer<typeof insertFormDefinitionSchema>;
export type FormDefinition = typeof formDefinitions.$inferSelect;

// Form Versions Table
export const formVersions = mysqlTable(
  'form_versions',
  {
    id: int('id').primaryKey().autoincrement(),
    formId: int('form_id').notNull(),
    versionNo: int('version_no').notNull(),
    versionDate: timestamp('version_date').notNull(),
    status: varchar('status', { length: 20 }).notNull(),
    authorUserId: varchar('author_user_id', { length: 100 }).notNull(),
    changelog: text('changelog'),
    schemaJson: text('schema_json').notNull(),
  },
  table => ({
    formIdIdx: index('idx_form_id').on(table.formId),
    statusIdx: index('idx_status').on(table.status),
  })
);

export const insertFormVersionSchema = createInsertSchema(formVersions).omit({
  id: true,
});

export type InsertFormVersion = z.infer<typeof insertFormVersionSchema>;
export type FormVersion = typeof formVersions.$inferSelect;

// Form Version Usage Table
export const formVersionUsage = mysqlTable('form_version_usage', {
  id: int('id').primaryKey().autoincrement(),
  formVersionId: int('form_version_id').notNull(),
  usedInModule: varchar('used_in_module', { length: 100 }).notNull(),
  usedAt: timestamp('used_at').notNull(),
});

export const insertFormVersionUsageSchema = createInsertSchema(
  formVersionUsage
).omit({
  id: true,
});

export type InsertFormVersionUsage = z.infer<
  typeof insertFormVersionUsageSchema
>;
export type FormVersionUsage = typeof formVersionUsage.$inferSelect;

// Spares Table
export const spares = mysqlTable(
  'spares',
  {
    id: int('id').primaryKey().autoincrement(),
    partCode: varchar('part_code', { length: 100 }).notNull(),
    partName: varchar('part_name', { length: 255 }).notNull(),
    componentId: varchar('component_id', { length: 100 }).notNull(),
    componentCode: varchar('component_code', { length: 100 }),
    componentName: varchar('component_name', { length: 255 }).notNull(),
    componentSpareCode: varchar('component_spare_code', { length: 100 }),
    critical: varchar('critical', { length: 20 }).notNull(),
    rob: int('rob').notNull().default(0),
    min: int('min').notNull().default(0),
    location: varchar('location', { length: 255 }),
    vesselId: varchar('vessel_id', { length: 50 }).notNull().default('V001'),
    deleted: boolean('deleted').notNull().default(false),
  },
  table => ({
    componentIdIdx: index('idx_spare_component').on(table.componentId),
    vesselIdIdx: index('idx_spare_vessel').on(table.vesselId),
    componentSpareCodeIdx: index('idx_spare_code').on(
      table.vesselId,
      table.componentSpareCode
    ),
  })
);

export const insertSpareSchema = createInsertSchema(spares).omit({
  id: true,
  deleted: true,
});

export type InsertSpare = z.infer<typeof insertSpareSchema>;
export type Spare = typeof spares.$inferSelect;

// Spares History Table
export const sparesHistory = mysqlTable(
  'spares_history',
  {
    id: int('id').primaryKey().autoincrement(),
    timestampUTC: timestamp('timestamp_utc').notNull(),
    vesselId: varchar('vessel_id', { length: 50 }).notNull(),
    spareId: int('spare_id').notNull(),
    partCode: varchar('part_code', { length: 100 }).notNull(),
    partName: varchar('part_name', { length: 255 }).notNull(),
    componentId: varchar('component_id', { length: 100 }).notNull(),
    componentCode: varchar('component_code', { length: 100 }),
    componentName: varchar('component_name', { length: 255 }).notNull(),
    componentSpareCode: varchar('component_spare_code', { length: 100 }),
    eventType: varchar('event_type', { length: 30 }).notNull(),
    qtyChange: int('qty_change').notNull(),
    robAfter: int('rob_after').notNull(),
    userId: varchar('user_id', { length: 100 }).notNull(),
    remarks: text('remarks'),
    reference: varchar('reference', { length: 100 }),
    dateLocal: varchar('date_local', { length: 50 }),
    tz: varchar('tz', { length: 50 }),
    place: varchar('place', { length: 255 }),
  },
  table => ({
    timestampIdx: index('idx_history_timestamp').on(table.timestampUTC),
    spareIdIdx: index('idx_history_spare').on(table.spareId),
    eventTypeIdx: index('idx_history_event').on(table.eventType),
  })
);

export const insertSpareHistorySchema = createInsertSchema(sparesHistory).omit({
  id: true,
});

export type InsertSpareHistory = z.infer<typeof insertSpareHistorySchema>;
export type SpareHistory = typeof sparesHistory.$inferSelect;

// Stores Ledger Table
export const storesLedger = mysqlTable(
  'stores_ledger',
  {
    id: int('id').primaryKey().autoincrement(),
    vesselId: varchar('vessel_id', { length: 50 }).notNull(),
    itemCode: varchar('item_code', { length: 100 }).notNull(),
    itemName: varchar('item_name', { length: 255 }).notNull(),
    unit: varchar('unit', { length: 50 }).notNull(),
    eventType: varchar('event_type', { length: 30 }).notNull(),
    quantity: decimal('quantity', { precision: 10, scale: 3 }).notNull(),
    robAfter: decimal('rob_after', { precision: 10, scale: 3 }).notNull(),
    cost: decimal('cost', { precision: 10, scale: 2 }),
    totalCost: decimal('total_cost', { precision: 10, scale: 2 }),
    supplier: varchar('supplier', { length: 255 }),
    reference: varchar('reference', { length: 100 }),
    place: varchar('place', { length: 255 }),
    dateLocal: varchar('date_local', { length: 50 }).notNull(),
    tz: varchar('tz', { length: 50 }).notNull(),
    timestampUTC: timestamp('timestamp_utc').notNull(),
    userId: varchar('user_id', { length: 100 }).notNull(),
    remarks: text('remarks'),
  },
  table => ({
    vesselItemIdx: index('idx_vessel_item').on(table.vesselId, table.itemCode),
    timestampIdx: index('idx_timestamp').on(table.timestampUTC),
    eventTypeIdx: index('idx_event_type').on(table.eventType),
  })
);

export const insertStoresLedgerSchema = createInsertSchema(storesLedger).omit({
  id: true,
});

export type InsertStoresLedger = z.infer<typeof insertStoresLedgerSchema>;
export type StoresLedger = typeof storesLedger.$inferSelect;

// Work Orders Table
export const workOrders = mysqlTable(
  'work_orders',
  {
    id: varchar('id', { length: 100 }).primaryKey(),
    vesselId: varchar('vessel_id', { length: 50 }).notNull().default('V001'),
    component: varchar('component', { length: 255 }).notNull(),
    componentCode: varchar('component_code', { length: 100 }),
    workOrderNo: varchar('work_order_no', { length: 50 }).notNull(),
    templateCode: varchar('template_code', { length: 100 }),
    executionId: varchar('execution_id', { length: 100 }),
    jobTitle: varchar('job_title', { length: 500 }).notNull(),
    assignedTo: varchar('assigned_to', { length: 255 }).notNull(),
    dueDate: varchar('due_date', { length: 50 }).notNull(),
    status: varchar('status', { length: 50 }).notNull(),
    dateCompleted: varchar('date_completed', { length: 50 }),
    submittedDate: varchar('submitted_date', { length: 50 }),
    formData: json('form_data'),
    taskType: varchar('task_type', { length: 100 }),
    maintenanceBasis: varchar('maintenance_basis', { length: 50 }),
    frequencyValue: varchar('frequency_value', { length: 50 }),
    frequencyUnit: varchar('frequency_unit', { length: 50 }),
    approverRemarks: text('approver_remarks'),
    isExecution: boolean('is_execution').default(false),
    templateId: varchar('template_id', { length: 100 }),
    approver: varchar('approver', { length: 255 }),
    approvalDate: varchar('approval_date', { length: 50 }),
    rejectionDate: varchar('rejection_date', { length: 50 }),
    nextDueDate: varchar('next_due_date', { length: 50 }),
    nextDueReading: varchar('next_due_reading', { length: 50 }),
    currentReading: varchar('current_reading', { length: 50 }),
    createdAt: timestamp('created_at')
      .notNull()
      .default(sql`CURRENT_TIMESTAMP`),
    updatedAt: timestamp('updated_at')
      .notNull()
      .default(sql`CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP`),
  },
  table => ({
    vesselIdIdx: index('idx_wo_vessel').on(table.vesselId),
    statusIdx: index('idx_wo_status').on(table.status),
    componentIdx: index('idx_wo_component').on(table.componentCode),
    dueDateIdx: index('idx_wo_due_date').on(table.dueDate),
  })
);

export const insertWorkOrderSchema = createInsertSchema(workOrders).omit({
  createdAt: true,
  updatedAt: true,
});

export type InsertWorkOrder = z.infer<typeof insertWorkOrderSchema>;
export type WorkOrder = typeof workOrders.$inferSelect;

// Change Request Table
export const changeRequest = mysqlTable(
  'change_request',
  {
    id: int('id').primaryKey().autoincrement(),
    crNumber: varchar('cr_number', { length: 50 }).notNull().unique(),
    vesselId: varchar('vessel_id', { length: 50 }).notNull(),
    title: varchar('title', { length: 255 }).notNull(),
    description: text('description').notNull(),
    justification: text('justification').notNull(),
    submittedBy: varchar('submitted_by', { length: 100 }).notNull(),
    submittedAt: timestamp('submitted_at').notNull(),
    status: varchar('status', { length: 20 }).notNull().default('DRAFT'),
    priority: varchar('priority', { length: 20 }).notNull().default('MEDIUM'),
    assignedTo: varchar('assigned_to', { length: 100 }),
    reviewedBy: varchar('reviewed_by', { length: 100 }),
    reviewedAt: timestamp('reviewed_at'),
    reviewComments: text('review_comments'),
    targetModules: json('target_modules'),
    proposedChanges: json('proposed_changes'),
    approvedChanges: json('approved_changes'),
    rejectionReason: text('rejection_reason'),
    implementedAt: timestamp('implemented_at'),
    implementedBy: varchar('implemented_by', { length: 100 }),
    closedAt: timestamp('closed_at'),
    closedBy: varchar('closed_by', { length: 100 }),
  },
  table => ({
    statusIdx: index('idx_cr_status').on(table.status),
    vesselIdx: index('idx_cr_vessel').on(table.vesselId),
    submittedByIdx: index('idx_cr_submitted').on(table.submittedBy),
  })
);

export const insertChangeRequestSchema = createInsertSchema(changeRequest).omit(
  {
    id: true,
  }
);

export type InsertChangeRequest = z.infer<typeof insertChangeRequestSchema>;
export type ChangeRequest = typeof changeRequest.$inferSelect;

// Change Request Attachment Table
export const changeRequestAttachment = mysqlTable(
  'change_request_attachment',
  {
    id: int('id').primaryKey().autoincrement(),
    changeRequestId: int('change_request_id').notNull(),
    fileName: varchar('file_name', { length: 255 }).notNull(),
    fileType: varchar('file_type', { length: 100 }).notNull(),
    fileSize: int('file_size').notNull(),
    filePath: varchar('file_path', { length: 500 }).notNull(),
    uploadedBy: varchar('uploaded_by', { length: 100 }).notNull(),
    uploadedAt: timestamp('uploaded_at').notNull(),
    description: varchar('description', { length: 500 }),
  },
  table => ({
    changeRequestIdx: index('idx_attachment_cr').on(table.changeRequestId),
  })
);

export const insertChangeRequestAttachmentSchema = createInsertSchema(
  changeRequestAttachment
).omit({
  id: true,
});

export type InsertChangeRequestAttachment = z.infer<
  typeof insertChangeRequestAttachmentSchema
>;
export type ChangeRequestAttachment =
  typeof changeRequestAttachment.$inferSelect;

// Change Request Comment Table
export const changeRequestComment = mysqlTable(
  'change_request_comment',
  {
    id: int('id').primaryKey().autoincrement(),
    changeRequestId: int('change_request_id').notNull(),
    commentText: text('comment_text').notNull(),
    commentType: varchar('comment_type', { length: 20 })
      .notNull()
      .default('GENERAL'),
    commentedBy: varchar('commented_by', { length: 100 }).notNull(),
    commentedAt: timestamp('commented_at').notNull(),
    parentCommentId: int('parent_comment_id'),
    isInternal: boolean('is_internal').notNull().default(false),
    editedAt: timestamp('edited_at'),
    editedBy: varchar('edited_by', { length: 100 }),
  },
  table => ({
    changeRequestIdx: index('idx_comment_cr').on(table.changeRequestId),
    commentedAtIdx: index('idx_comment_date').on(table.commentedAt),
  })
);

export const insertChangeRequestCommentSchema = createInsertSchema(
  changeRequestComment
).omit({
  id: true,
});

export type InsertChangeRequestComment = z.infer<
  typeof insertChangeRequestCommentSchema
>;
export type ChangeRequestComment = typeof changeRequestComment.$inferSelect;

// Alert Policies Table
export const alertPolicies = mysqlTable('alert_policies', {
  id: int('id').primaryKey().autoincrement(),
  name: varchar('name', { length: 255 }).notNull(),
  description: text('description'),
  module: varchar('module', { length: 100 }).notNull(),
  triggerCondition: json('trigger_condition').notNull(),
  enabled: boolean('enabled').notNull().default(true),
  severity: varchar('severity', { length: 20 }).notNull().default('MEDIUM'),
  cooldownMinutes: int('cooldown_minutes').notNull().default(60),
  createdAt: timestamp('created_at').notNull(),
  updatedAt: timestamp('updated_at').notNull(),
});

export const insertAlertPolicySchema = createInsertSchema(alertPolicies).omit({
  id: true,
});

export type InsertAlertPolicy = z.infer<typeof insertAlertPolicySchema>;
export type AlertPolicy = typeof alertPolicies.$inferSelect;

// Alert Events Table
export const alertEvents = mysqlTable(
  'alert_events',
  {
    id: int('id').primaryKey().autoincrement(),
    policyId: int('policy_id').notNull(),
    vesselId: varchar('vessel_id', { length: 50 }).notNull(),
    title: varchar('title', { length: 255 }).notNull(),
    message: text('message').notNull(),
    severity: varchar('severity', { length: 20 }).notNull(),
    status: varchar('status', { length: 20 }).notNull().default('ACTIVE'),
    triggerData: json('trigger_data'),
    triggeredAt: timestamp('triggered_at').notNull(),
    acknowledgedAt: timestamp('acknowledged_at'),
    acknowledgedBy: varchar('acknowledged_by', { length: 100 }),
    resolvedAt: timestamp('resolved_at'),
    resolvedBy: varchar('resolved_by', { length: 100 }),
    resolutionNotes: text('resolution_notes'),
  },
  table => ({
    policyIdx: index('idx_alert_policy').on(table.policyId),
    vesselIdx: index('idx_alert_vessel').on(table.vesselId),
    statusIdx: index('idx_alert_status').on(table.status),
    triggeredAtIdx: index('idx_alert_triggered').on(table.triggeredAt),
  })
);

export const insertAlertEventSchema = createInsertSchema(alertEvents).omit({
  id: true,
});

export type InsertAlertEvent = z.infer<typeof insertAlertEventSchema>;
export type AlertEvent = typeof alertEvents.$inferSelect;

// Alert Deliveries Table
export const alertDeliveries = mysqlTable(
  'alert_deliveries',
  {
    id: int('id').primaryKey().autoincrement(),
    alertEventId: int('alert_event_id').notNull(),
    deliveryMethod: varchar('delivery_method', { length: 50 }).notNull(),
    recipient: varchar('recipient', { length: 255 }).notNull(),
    status: varchar('status', { length: 20 }).notNull(),
    attemptedAt: timestamp('attempted_at').notNull(),
    deliveredAt: timestamp('delivered_at'),
    failureReason: text('failure_reason'),
    retryCount: int('retry_count').notNull().default(0),
    nextRetryAt: timestamp('next_retry_at'),
  },
  table => ({
    alertEventIdx: index('idx_delivery_event').on(table.alertEventId),
    statusIdx: index('idx_delivery_status').on(table.status),
    nextRetryIdx: index('idx_delivery_retry').on(table.nextRetryAt),
  })
);

export const insertAlertDeliverySchema = createInsertSchema(
  alertDeliveries
).omit({
  id: true,
});

export type InsertAlertDelivery = z.infer<typeof insertAlertDeliverySchema>;
export type AlertDelivery = typeof alertDeliveries.$inferSelect;

// Alert Config Table
export const alertConfig = mysqlTable('alert_config', {
  id: int('id').primaryKey().autoincrement(),
  vesselId: varchar('vessel_id', { length: 50 }).notNull(),
  configKey: varchar('config_key', { length: 100 }).notNull(),
  configValue: json('config_value').notNull(),
  updatedBy: varchar('updated_by', { length: 100 }).notNull(),
  updatedAt: timestamp('updated_at').notNull(),
});

export const insertAlertConfigSchema = createInsertSchema(alertConfig).omit({
  id: true,
});

export type InsertAlertConfig = z.infer<typeof insertAlertConfigSchema>;
export type AlertConfig = typeof alertConfig.$inferSelect;
