import {
  pgTable,
  text,
  integer,
  boolean,
  timestamp,
  decimal,
  index,
  json,
} from 'drizzle-orm/pg-core';
import { createInsertSchema } from 'drizzle-zod';
export var users = pgTable('users', {
  id: integer('id').primaryKey().generatedByDefaultAsIdentity(),
  username: text('username').notNull().unique(),
  password: text('password').notNull(),
});
export var insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});
// Running Hours Audit Table
export var runningHoursAudit = pgTable(
  'running_hours_audit',
  {
    id: integer('id').primaryKey().generatedByDefaultAsIdentity(),
    vesselId: text('vessel_id').notNull(),
    componentId: text('component_id').notNull(),
    previousRH: decimal('previous_rh', { precision: 10, scale: 2 }).notNull(),
    newRH: decimal('new_rh', { precision: 10, scale: 2 }).notNull(),
    cumulativeRH: decimal('cumulative_rh', {
      precision: 10,
      scale: 2,
    }).notNull(),
    dateUpdatedLocal: text('date_updated_local').notNull(), // DD-MMM-YYYY HH:mm
    dateUpdatedTZ: text('date_updated_tz').notNull(), // e.g., Asia/Kolkata
    enteredAtUTC: timestamp('entered_at_utc').notNull(),
    userId: text('user_id').notNull(),
    source: text('source').notNull(), // 'single' | 'bulk'
    notes: text('notes'),
    meterReplaced: boolean('meter_replaced').notNull().default(false),
    oldMeterFinal: decimal('old_meter_final', { precision: 10, scale: 2 }),
    newMeterStart: decimal('new_meter_start', { precision: 10, scale: 2 }),
    version: integer('version').notNull().default(1),
  },
  function (table) {
    return {
      componentIdIdx: index('idx_component_entered').on(
        table.componentId,
        table.enteredAtUTC
      ),
      componentDateIdx: index('idx_component_date').on(
        table.componentId,
        table.dateUpdatedLocal
      ),
    };
  }
);
export var insertRunningHoursAuditSchema = createInsertSchema(
  runningHoursAudit
).omit({
  id: true,
});
// Components Table (for storing current cumulative RH)
export var components = pgTable('components', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  componentCode: text('component_code'),
  parentId: text('parent_id'),
  category: text('category').notNull(),
  currentCumulativeRH: decimal('current_cumulative_rh', {
    precision: 10,
    scale: 2,
  })
    .notNull()
    .default('0'),
  lastUpdated: text('last_updated'),
  vesselId: text('vessel_id').notNull().default('V001'),
  // Additional fields for Component Information (Section A)
  maker: text('maker'),
  model: text('model'),
  serialNo: text('serial_no'),
  deptCategory: text('dept_category'),
  componentCategory: text('component_category'),
  location: text('location'),
  commissionedDate: text('commissioned_date'),
  critical: boolean('critical').default(false),
  classItem: boolean('class_item').default(false),
});
export var insertComponentSchema = createInsertSchema(components).omit({});
// Form Definitions Table
export var formDefinitions = pgTable('form_definitions', {
  id: integer('id').primaryKey().generatedByDefaultAsIdentity(),
  name: text('name').notNull().unique(), // ADD_COMPONENT, WO_PLANNED, WO_UNPLANNED
  subgroup: text('subgroup'),
});
export var insertFormDefinitionSchema = createInsertSchema(
  formDefinitions
).omit({
  id: true,
});
// Form Versions Table
export var formVersions = pgTable(
  'form_versions',
  {
    id: integer('id').primaryKey().generatedByDefaultAsIdentity(),
    formId: integer('form_id').notNull(),
    versionNo: integer('version_no').notNull(),
    versionDate: timestamp('version_date').notNull(),
    status: text('status').notNull(), // DRAFT, PUBLISHED, ARCHIVED
    authorUserId: text('author_user_id').notNull(),
    changelog: text('changelog'),
    schemaJson: text('schema_json').notNull(), // JSON string
  },
  function (table) {
    return {
      formIdIdx: index('idx_form_id').on(table.formId),
      statusIdx: index('idx_status').on(table.status),
    };
  }
);
export var insertFormVersionSchema = createInsertSchema(formVersions).omit({
  id: true,
});
// Form Version Usage Table (Audit)
export var formVersionUsage = pgTable('form_version_usage', {
  id: integer('id').primaryKey().generatedByDefaultAsIdentity(),
  formVersionId: integer('form_version_id').notNull(),
  usedInModule: text('used_in_module').notNull(),
  usedAt: timestamp('used_at').notNull(),
});
export var insertFormVersionUsageSchema = createInsertSchema(
  formVersionUsage
).omit({
  id: true,
});
// Spares Table
export var spares = pgTable(
  'spares',
  {
    id: integer('id').primaryKey().generatedByDefaultAsIdentity(),
    partCode: text('part_code').notNull(),
    partName: text('part_name').notNull(),
    componentId: text('component_id').notNull(),
    componentCode: text('component_code'),
    componentName: text('component_name').notNull(),
    componentSpareCode: text('component_spare_code'), // Format: SP-<ComponentCode>-<NNN>
    critical: text('critical').notNull(), // 'Critical' | 'Non-Critical' | 'Yes' | 'No'
    rob: integer('rob').notNull().default(0), // Remaining on Board
    min: integer('min').notNull().default(0), // Minimum stock
    location: text('location'),
    vesselId: text('vessel_id').notNull().default('V001'),
    deleted: boolean('deleted').notNull().default(false),
  },
  function (table) {
    return {
      componentIdIdx: index('idx_spare_component').on(table.componentId),
      vesselIdIdx: index('idx_spare_vessel').on(table.vesselId),
      componentSpareCodeIdx: index('idx_spare_code').on(
        table.vesselId,
        table.componentSpareCode
      ),
    };
  }
);
export var insertSpareSchema = createInsertSchema(spares).omit({
  id: true,
  deleted: true,
});
// Spares History Table
export var sparesHistory = pgTable(
  'spares_history',
  {
    id: integer('id').primaryKey().generatedByDefaultAsIdentity(),
    timestampUTC: timestamp('timestamp_utc').notNull(),
    vesselId: text('vessel_id').notNull(),
    spareId: integer('spare_id').notNull(),
    partCode: text('part_code').notNull(),
    partName: text('part_name').notNull(),
    componentId: text('component_id').notNull(),
    componentCode: text('component_code'),
    componentName: text('component_name').notNull(),
    componentSpareCode: text('component_spare_code'), // Component Spare Code at time of event
    eventType: text('event_type').notNull(), // 'CONSUME' | 'RECEIVE' | 'ADJUST' | 'CREATE' | 'EDIT' | 'LINK_CREATED' | 'CODE_RENUMBERED'
    qtyChange: integer('qty_change').notNull(), // positive for receive, negative for consume
    robAfter: integer('rob_after').notNull(),
    userId: text('user_id').notNull(),
    remarks: text('remarks'),
    reference: text('reference'), // Work Order or PO reference
    dateLocal: text('date_local'), // Local date of transaction
    tz: text('tz'), // Timezone
    place: text('place'), // Port/Location for receive/consume
  },
  function (table) {
    return {
      timestampIdx: index('idx_history_timestamp').on(table.timestampUTC),
      spareIdIdx: index('idx_history_spare').on(table.spareId),
      eventTypeIdx: index('idx_history_event').on(table.eventType),
    };
  }
);
export var insertSpareHistorySchema = createInsertSchema(sparesHistory).omit({
  id: true,
});
// Stores Ledger Table (for Stores module history)
export var storesLedger = pgTable(
  'stores_ledger',
  {
    id: integer('id').primaryKey().generatedByDefaultAsIdentity(),
    vesselId: text('vessel_id').notNull(),
    section: text('section').notNull(), // 'stores' | 'lubes' | 'chemicals' | 'others'
    itemId: integer('item_id').notNull(),
    partCode: text('part_code').notNull(),
    itemName: text('item_name').notNull(),
    uom: text('uom'), // Base unit of measure
    eventType: text('event_type').notNull(), // 'RECEIVE' | 'CONSUME' | 'ADJUST' | 'TRANSFER_IN' | 'TRANSFER_OUT' | 'ARCHIVE'
    qtyChangeBase: decimal('qty_change_base', {
      precision: 10,
      scale: 2,
    }).notNull(), // Change in base UOM
    qtyDisplay: decimal('qty_display', { precision: 10, scale: 2 }).notNull(), // Change in display UOM
    uomDisplay: text('uom_display'), // Display UOM (could be different from base)
    robAfterBase: decimal('rob_after_base', {
      precision: 10,
      scale: 2,
    }).notNull(), // ROB after in base UOM
    dateLocal: text('date_local').notNull(), // DD-MMM-YYYY HH:mm
    tz: text('tz').notNull(), // Timezone
    timestampUTC: timestamp('timestamp_utc').notNull(),
    place: text('place'), // For receive events
    ref: text('ref'), // PO/WO reference
    userId: text('user_id').notNull(),
    remarks: text('remarks'),
  },
  function (table) {
    return {
      vesselSectionDateIdx: index('idx_vessel_section_date').on(
        table.vesselId,
        table.section,
        table.dateLocal
      ),
      itemDateIdx: index('idx_item_date').on(table.itemId, table.dateLocal),
    };
  }
);
export var insertStoresLedgerSchema = createInsertSchema(storesLedger).omit({
  id: true,
});
// Change Request Tables for Modify PMS module
export var changeRequest = pgTable(
  'change_request',
  {
    id: integer('id').primaryKey().generatedByDefaultAsIdentity(),
    vesselId: text('vessel_id').notNull(),
    category: text('category').notNull(), // 'components' | 'work_orders' | 'spares' | 'stores'
    title: text('title').notNull(), // max 120 chars enforced in application
    reason: text('reason').notNull(),
    targetType: text('target_type'), // 'component' | 'work_order' | 'spare' | 'store'
    targetId: text('target_id'),
    snapshotBeforeJson: json('snapshot_before_json'),
    proposedChangesJson: json('proposed_changes_json'), // Array of change objects
    movePreviewJson: json('move_preview_json'), // Component move preview (nullable)
    status: text('status').notNull().default('draft'), // 'draft' | 'submitted' | 'returned' | 'approved' | 'rejected'
    requestedByUserId: text('requested_by_user_id').notNull(),
    submittedAt: timestamp('submitted_at'),
    reviewedByUserId: text('reviewed_by_user_id'),
    reviewedAt: timestamp('reviewed_at'),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at')
      .notNull()
      .defaultNow()
      .$onUpdateFn(function () {
        return new Date();
      }),
  },
  function (table) {
    return {
      vesselCategoryIdx: index('idx_vessel_category').on(
        table.vesselId,
        table.category
      ),
      statusIdx: index('idx_status').on(table.status),
    };
  }
);
export var insertChangeRequestSchema = createInsertSchema(changeRequest).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});
// Change Request Attachments
export var changeRequestAttachment = pgTable(
  'change_request_attachment',
  {
    id: integer('id').primaryKey().generatedByDefaultAsIdentity(),
    changeRequestId: integer('change_request_id').notNull(),
    filename: text('filename').notNull(),
    url: text('url').notNull(),
    uploadedByUserId: text('uploaded_by_user_id').notNull(),
    uploadedAt: timestamp('uploaded_at').notNull().defaultNow(),
  },
  function (table) {
    return {
      changeRequestIdx: index('idx_change_request').on(table.changeRequestId),
    };
  }
);
export var insertChangeRequestAttachmentSchema = createInsertSchema(
  changeRequestAttachment
).omit({
  id: true,
  uploadedAt: true,
});
// Change Request Comments
export var changeRequestComment = pgTable(
  'change_request_comment',
  {
    id: integer('id').primaryKey().generatedByDefaultAsIdentity(),
    changeRequestId: integer('change_request_id').notNull(),
    userId: text('user_id').notNull(),
    message: text('message').notNull(),
    createdAt: timestamp('created_at').notNull().defaultNow(),
  },
  function (table) {
    return {
      changeRequestIdx: index('idx_change_request_comment').on(
        table.changeRequestId
      ),
    };
  }
);
export var insertChangeRequestCommentSchema = createInsertSchema(
  changeRequestComment
).omit({
  id: true,
  createdAt: true,
});
// Alert Policy Table
export var alertPolicies = pgTable('alert_policies', {
  id: integer('id').primaryKey().generatedByDefaultAsIdentity(),
  alertType: text('alert_type').notNull(), // 'maintenance_due' | 'running_hours' | 'critical_inventory' | 'certificate_expiration' | 'system_backup'
  enabled: boolean('enabled').notNull().default(true),
  priority: text('priority').notNull().default('medium'), // 'low' | 'medium' | 'high'
  emailEnabled: boolean('email_enabled').notNull().default(false),
  inAppEnabled: boolean('in_app_enabled').notNull().default(true),
  thresholds: text('thresholds').notNull().default('{}'), // JSON string for type-specific thresholds
  scopeFilters: text('scope_filters').notNull().default('{}'), // JSON string for filters
  recipients: text('recipients').notNull().default('{}'), // JSON string for recipient configuration
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
  createdBy: text('created_by').notNull(),
  updatedBy: text('updated_by').notNull(),
});
export var insertAlertPolicySchema = createInsertSchema(alertPolicies).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});
// Alert Events Table
export var alertEvents = pgTable(
  'alert_events',
  {
    id: integer('id').primaryKey().generatedByDefaultAsIdentity(),
    policyId: integer('policy_id').notNull(),
    alertType: text('alert_type').notNull(),
    priority: text('priority').notNull(),
    objectType: text('object_type'), // 'work_order' | 'component' | 'spare' | 'certificate' | 'system'
    objectId: text('object_id'),
    vesselId: text('vessel_id'),
    dedupeKey: text('dedupe_key').notNull(),
    state: text('state'), // 'due' | 'overdue' | 'low' | 'critical' | 'expired' | 'failed' etc
    payload: text('payload').notNull(), // JSON string with all event details
    ackBy: text('ack_by'),
    ackAt: timestamp('ack_at'),
    createdAt: timestamp('created_at').notNull().defaultNow(),
  },
  function (table) {
    return {
      dedupeKeyIdx: index('idx_dedupe_key').on(
        table.dedupeKey,
        table.createdAt
      ),
      policyIdx: index('idx_policy_events').on(table.policyId, table.createdAt),
    };
  }
);
export var insertAlertEventSchema = createInsertSchema(alertEvents).omit({
  id: true,
  createdAt: true,
});
// Alert Deliveries Table
export var alertDeliveries = pgTable(
  'alert_deliveries',
  {
    id: integer('id').primaryKey().generatedByDefaultAsIdentity(),
    eventId: integer('event_id').notNull(),
    channel: text('channel').notNull(), // 'email' | 'in_app' | 'sms' | 'slack'
    recipient: text('recipient').notNull(), // email address, user ID, phone number, etc
    status: text('status').notNull().default('pending'), // 'pending' | 'sent' | 'failed' | 'acknowledged'
    errorMessage: text('error_message'),
    sentAt: timestamp('sent_at'),
    acknowledgedAt: timestamp('acknowledged_at'),
    createdAt: timestamp('created_at').notNull().defaultNow(),
  },
  function (table) {
    return {
      eventIdx: index('idx_event_deliveries').on(table.eventId, table.channel),
      recipientIdx: index('idx_recipient_deliveries').on(
        table.recipient,
        table.status
      ),
    };
  }
);
export var insertAlertDeliverySchema = createInsertSchema(alertDeliveries).omit(
  {
    id: true,
    createdAt: true,
  }
);
// Alert Configuration Table (for quiet hours and escalation)
export var alertConfig = pgTable('alert_config', {
  id: integer('id').primaryKey().generatedByDefaultAsIdentity(),
  vesselId: text('vessel_id').notNull(),
  quietHoursEnabled: boolean('quiet_hours_enabled').notNull().default(false),
  quietHoursStart: text('quiet_hours_start'), // HH:mm format
  quietHoursEnd: text('quiet_hours_end'), // HH:mm format
  escalationEnabled: boolean('escalation_enabled').notNull().default(false),
  escalationHours: integer('escalation_hours').notNull().default(4),
  escalationRecipients: text('escalation_recipients').notNull().default('[]'), // JSON array of recipients
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
  updatedBy: text('updated_by').notNull(),
});
export var insertAlertConfigSchema = createInsertSchema(alertConfig).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});
//# sourceMappingURL=schema.js.map
