import {
  users,
  type User,
  type InsertUser,
  components,
  type Component,
  type InsertComponent,
  runningHoursAudit,
  type RunningHoursAudit,
  type InsertRunningHoursAudit,
  spares,
  type Spare,
  type InsertSpare,
  sparesHistory,
  type SpareHistory,
  type InsertSpareHistory,
  changeRequest,
  type ChangeRequest,
  type InsertChangeRequest,
  changeRequestAttachment,
  type ChangeRequestAttachment,
  type InsertChangeRequestAttachment,
  changeRequestComment,
  type ChangeRequestComment,
  type InsertChangeRequestComment,
  alertPolicies,
  type AlertPolicy,
  type InsertAlertPolicy,
  alertEvents,
  type AlertEvent,
  type InsertAlertEvent,
  alertDeliveries,
  type AlertDelivery,
  type InsertAlertDelivery,
  alertConfig,
  type AlertConfig,
  type InsertAlertConfig,
  formDefinitions,
  type FormDefinition,
  type InsertFormDefinition,
  formVersions,
  type FormVersion,
  type InsertFormVersion,
  formVersionUsage,
  type FormVersionUsage,
  type InsertFormVersionUsage,
} from '@shared/schema';

// modify the interface with any CRUD methods
// you might need

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Running Hours methods
  getComponents(vesselId: string): Promise<Component[]>;
  getComponent(id: string): Promise<Component | undefined>;
  updateComponent(id: string, data: Partial<Component>): Promise<Component>;
  createRunningHoursAudit(
    audit: InsertRunningHoursAudit
  ): Promise<RunningHoursAudit>;
  getRunningHoursAudits(
    componentId: string,
    limit?: number
  ): Promise<RunningHoursAudit[]>;
  getRunningHoursAuditsInDateRange(
    componentId: string,
    startDate: Date,
    endDate: Date
  ): Promise<RunningHoursAudit[]>;

  // Spares methods
  getSpares(vesselId: string): Promise<Spare[]>;
  getSpare(id: number): Promise<Spare | undefined>;
  createSpare(spare: InsertSpare): Promise<Spare>;
  updateSpare(id: number, data: Partial<Spare>): Promise<Spare>;
  deleteSpare(id: number): Promise<void>;
  consumeSpare(
    id: number,
    quantity: number,
    userId: string,
    remarks?: string,
    place?: string,
    dateLocal?: string,
    tz?: string
  ): Promise<Spare>;
  receiveSpare(
    id: number,
    quantity: number,
    userId: string,
    remarks?: string,
    supplierPO?: string,
    place?: string,
    dateLocal?: string,
    tz?: string
  ): Promise<Spare>;
  bulkUpdateSpares(
    updates: Array<{
      id: number;
      consumed?: number;
      received?: number;
      receivedDate?: string;
      receivedPlace?: string;
    }>,
    userId: string,
    remarks?: string
  ): Promise<Spare[]>;

  // Spares History methods
  getSpareHistory(vesselId: string): Promise<SpareHistory[]>;
  getSpareHistoryBySpareId(spareId: number): Promise<SpareHistory[]>;
  createSpareHistory(history: InsertSpareHistory): Promise<SpareHistory>;

  // Change Request methods
  getChangeRequests(filters?: {
    category?: string;
    status?: string;
    q?: string;
    vesselId?: string;
  }): Promise<ChangeRequest[]>;
  getChangeRequest(id: number): Promise<ChangeRequest | undefined>;
  createChangeRequest(request: InsertChangeRequest): Promise<ChangeRequest>;
  updateChangeRequest(
    id: number,
    data: Partial<ChangeRequest>
  ): Promise<ChangeRequest>;
  updateChangeRequestTarget(
    id: number,
    targetType: string | null,
    targetId: string | null,
    snapshotBeforeJson: any
  ): Promise<ChangeRequest>;
  updateChangeRequestProposed(
    id: number,
    proposedChangesJson: any,
    movePreviewJson?: any
  ): Promise<ChangeRequest>;
  deleteChangeRequest(id: number): Promise<void>;
  submitChangeRequest(id: number, userId: string): Promise<ChangeRequest>;
  approveChangeRequest(
    id: number,
    reviewerId: string,
    comment: string
  ): Promise<ChangeRequest>;
  rejectChangeRequest(
    id: number,
    reviewerId: string,
    comment: string
  ): Promise<ChangeRequest>;
  returnChangeRequest(
    id: number,
    reviewerId: string,
    comment: string
  ): Promise<ChangeRequest>;

  // Change Request Attachments
  getChangeRequestAttachments(
    changeRequestId: number
  ): Promise<ChangeRequestAttachment[]>;
  createChangeRequestAttachment(
    attachment: InsertChangeRequestAttachment
  ): Promise<ChangeRequestAttachment>;

  // Change Request Comments
  getChangeRequestComments(
    changeRequestId: number
  ): Promise<ChangeRequestComment[]>;
  createChangeRequestComment(
    comment: InsertChangeRequestComment
  ): Promise<ChangeRequestComment>;

  // Bulk Import methods
  bulkCreateComponents(components: InsertComponent[]): Promise<Component[]>;
  bulkUpdateComponents(
    components: Array<{ id: string; data: Partial<Component> }>
  ): Promise<Component[]>;
  bulkUpsertComponents(
    components: InsertComponent[]
  ): Promise<{ created: number; updated: number }>;
  bulkCreateSpares(spares: InsertSpare[]): Promise<Spare[]>;
  bulkUpdateSparesByROB(
    spares: Array<{ robId: string; data: Partial<Spare> }>
  ): Promise<Spare[]>;
  bulkUpsertSpares(
    spares: InsertSpare[]
  ): Promise<{ created: number; updated: number }>;
  archiveComponentsByIds(ids: string[]): Promise<number>;
  archiveSparesByIds(ids: number[]): Promise<number>;

  // Alert methods
  getAlertPolicies(): Promise<AlertPolicy[]>;
  getAlertPolicy(id: number): Promise<AlertPolicy | undefined>;
  createAlertPolicy(policy: InsertAlertPolicy): Promise<AlertPolicy>;
  updateAlertPolicy(
    id: number,
    data: Partial<AlertPolicy>
  ): Promise<AlertPolicy>;
  deleteAlertPolicy(id: number): Promise<void>;

  getAlertEvents(filters?: {
    startDate?: Date;
    endDate?: Date;
    alertType?: string;
    priority?: string;
    status?: string;
    vesselId?: string;
  }): Promise<AlertEvent[]>;
  getAlertEvent(id: number): Promise<AlertEvent | undefined>;
  createAlertEvent(event: InsertAlertEvent): Promise<AlertEvent>;
  acknowledgeAlertEvent(id: number, userId: string): Promise<AlertEvent>;

  getAlertDeliveries(eventId: number): Promise<AlertDelivery[]>;
  createAlertDelivery(delivery: InsertAlertDelivery): Promise<AlertDelivery>;
  updateAlertDeliveryStatus(
    id: number,
    status: string,
    errorMessage?: string
  ): Promise<AlertDelivery>;

  getAlertConfig(vesselId: string): Promise<AlertConfig | undefined>;
  createOrUpdateAlertConfig(config: InsertAlertConfig): Promise<AlertConfig>;

  // Store methods
  getStoreItems(vesselId: string): Promise<any[]>;
  createStoreTransaction(transaction: any): Promise<any>;
  getStoreHistory(vesselId: string): Promise<any[]>;

  // Form Definition methods
  getFormDefinitions(): Promise<FormDefinition[]>;
  getFormDefinition(id: number): Promise<FormDefinition | undefined>;
  getFormDefinitionByName(name: string): Promise<FormDefinition | undefined>;
  createFormDefinition(form: InsertFormDefinition): Promise<FormDefinition>;

  // Form Version methods
  getFormVersions(formId: number): Promise<FormVersion[]>;
  getFormVersion(id: number): Promise<FormVersion | undefined>;
  getLatestPublishedVersion(formId: number): Promise<FormVersion | undefined>;
  getLatestPublishedVersionByName(
    name: string
  ): Promise<FormVersion | undefined>;
  createFormVersion(version: InsertFormVersion): Promise<FormVersion>;
  updateFormVersion(
    id: number,
    data: Partial<FormVersion>
  ): Promise<FormVersion>;
  publishFormVersion(
    id: number,
    userId: string,
    changelog: string
  ): Promise<FormVersion>;
  discardFormVersion(id: number): Promise<void>;

  // Form Version Usage methods
  createFormVersionUsage(
    usage: InsertFormVersionUsage
  ): Promise<FormVersionUsage>;
  getFormVersionUsage(formVersionId: number): Promise<FormVersionUsage[]>;

  // Seed forms method
  seedForms(): Promise<void>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private currentUserId: number;
  private components: Map<string, Component>;
  private runningHoursAudits: RunningHoursAudit[];
  private currentAuditId: number;
  private spares: Map<number, Spare>;
  private currentSpareId: number;
  private sparesHistory: SpareHistory[];
  private currentHistoryId: number;
  private changeRequests: Map<number, ChangeRequest>;
  private currentChangeRequestId: number;
  private changeRequestAttachments: ChangeRequestAttachment[];
  private currentAttachmentId: number;
  private changeRequestComments: ChangeRequestComment[];
  private currentCommentId: number;
  private alertPolicies: Map<number, AlertPolicy>;
  private currentAlertPolicyId: number;
  private alertEvents: Map<number, AlertEvent>;
  private currentAlertEventId: number;
  private alertDeliveries: Map<number, AlertDelivery>;
  private currentAlertDeliveryId: number;
  private alertConfigs: Map<string, AlertConfig>;
  private currentAlertConfigId: number;
  private formDefinitions: Map<number, FormDefinition>;
  private currentFormDefinitionId: number;
  private formVersions: Map<number, FormVersion>;
  private currentFormVersionId: number;
  private formVersionUsages: FormVersionUsage[];
  private currentFormUsageId: number;

  constructor() {
    this.users = new Map();
    this.currentUserId = 1;
    this.components = new Map();
    this.runningHoursAudits = [];
    this.currentAuditId = 1;
    this.spares = new Map();
    this.currentSpareId = 1;
    this.sparesHistory = [];
    this.currentHistoryId = 1;
    this.changeRequests = new Map();
    this.currentChangeRequestId = 1;
    this.changeRequestAttachments = [];
    this.currentAttachmentId = 1;
    this.changeRequestComments = [];
    this.currentCommentId = 1;
    this.alertPolicies = new Map();
    this.currentAlertPolicyId = 1;
    this.alertEvents = new Map();
    this.currentAlertEventId = 1;
    this.alertDeliveries = new Map();
    this.currentAlertDeliveryId = 1;
    this.alertConfigs = new Map();
    this.currentAlertConfigId = 1;
    this.formDefinitions = new Map();
    this.currentFormDefinitionId = 1;
    this.formVersions = new Map();
    this.currentFormVersionId = 1;
    this.formVersionUsages = [];
    this.currentFormUsageId = 1;

    // Initialize sample components and spares
    this.initializeComponents();
    this.initializeSpares();
    this.initializeAlertPolicies();
    this.initializeFormDefinitions();
  }

  private async initializeFormDefinitions() {
    // Bootstrap form definitions with exact live schemas
    const forms = [
      { name: 'ADD_COMPONENT', subgroup: 'Component Register' },
      { name: 'WO_PLANNED', subgroup: 'New Work Order (Planned)' },
      { name: 'WO_UNPLANNED', subgroup: 'Unplanned Work Order' },
    ];

    for (const form of forms) {
      const formDef = await this.createFormDefinition(form);

      // Create initial published version with exact live schema
      const schemaJson = this.getInitialFormSchema(form.name);
      await this.createFormVersion({
        formId: formDef.id,
        versionNo: 1,
        versionDate: new Date(),
        status: 'PUBLISHED',
        authorUserId: 'system',
        changelog: 'Initial version from live form',
        schemaJson: JSON.stringify(schemaJson),
      });
    }
  }

  private getInitialFormSchema(formName: string) {
    // Return exact schema from current live forms
    if (formName === 'ADD_COMPONENT') {
      return {
        title: 'Add Component Form',
        sections: [
          {
            key: 'A',
            title: 'A. Component Information',
            layout: 'grid-4',
            fields: [
              { key: 'origin', label: 'Origin', type: 'text', required: false },
              {
                key: 'supplier',
                label: 'Supplier',
                type: 'text',
                required: false,
              },
              {
                key: 'partNo',
                label: 'Part No',
                type: 'text',
                required: false,
              },
              {
                key: 'createdOn',
                label: 'Created On',
                type: 'date',
                required: false,
              },
              {
                key: 'component',
                label: 'Component',
                type: 'text',
                required: true,
              },
              {
                key: 'maker',
                label: 'Maker / Maker Designator',
                type: 'text',
                required: false,
              },
              {
                key: 'serialNo',
                label: 'Serial No',
                type: 'text',
                required: false,
              },
              {
                key: 'installedDate',
                label: 'Installed Date',
                type: 'date',
                required: false,
              },
              {
                key: 'componentCode',
                label: 'Component Code',
                type: 'text',
                required: false,
              },
              { key: 'type', label: 'Type', type: 'text', required: false },
              {
                key: 'blackoutComponent',
                label: 'Blackout Component',
                type: 'text',
                required: false,
              },
              {
                key: 'modelSpecification',
                label: 'Model Specification',
                type: 'text',
                required: false,
              },
              {
                key: 'warrantyInfo',
                label: 'Warranty Info',
                type: 'text',
                required: false,
              },
              {
                key: 'warrantyDays',
                label: 'Warranty Days',
                type: 'text',
                required: false,
              },
              {
                key: 'warrantyDate',
                label: 'Warranty Date',
                type: 'date',
                required: false,
              },
              {
                key: 'lastUsed',
                label: 'Last Used',
                type: 'text',
                required: false,
              },
            ],
          },
          {
            key: 'B',
            title: 'B. Running Hours & Condition Monitoring Metrics',
            layout: 'grid-3',
            fields: [
              {
                key: 'runningHours',
                label: 'Running Hours',
                type: 'number',
                required: false,
              },
              {
                key: 'conditionMetrics',
                label: 'Condition Monitoring Metrics',
                type: 'repeater',
                required: false,
              },
            ],
          },
          {
            key: 'C',
            title: 'C. Work Orders',
            layout: 'grid-5',
            fields: [
              {
                key: 'workBy',
                label: 'Work By',
                type: 'text',
                required: false,
              },
              {
                key: 'jobTitle',
                label: 'Job Title',
                type: 'text',
                required: false,
              },
              {
                key: 'assignedTo',
                label: 'Assigned To',
                type: 'text',
                required: false,
              },
              {
                key: 'dueDate',
                label: 'Due Date',
                type: 'date',
                required: false,
              },
              { key: 'status', label: 'Status', type: 'text', required: false },
            ],
          },
          {
            key: 'D',
            title: 'D. Maintenance History',
            layout: 'grid-4',
            fields: [
              {
                key: 'workOrderNo',
                label: 'Work Order No',
                type: 'text',
                required: false,
              },
              {
                key: 'performedBy',
                label: 'Performed By',
                type: 'text',
                required: false,
              },
              {
                key: 'nextDueDate',
                label: 'Next Due Date',
                type: 'date',
                required: false,
              },
              {
                key: 'completionDate',
                label: 'Completion Date',
                type: 'date',
                required: false,
              },
            ],
          },
          {
            key: 'E',
            title: 'E. Spares',
            layout: 'grid-5',
            fields: [
              {
                key: 'sparePart',
                label: 'Spare Part',
                type: 'text',
                required: false,
              },
              {
                key: 'partName',
                label: 'Part Name',
                type: 'text',
                required: false,
              },
              { key: 'qty', label: 'Qty', type: 'number', required: false },
              {
                key: 'critical',
                label: 'Critical',
                type: 'text',
                required: false,
              },
              {
                key: 'location',
                label: 'Location',
                type: 'text',
                required: false,
              },
            ],
          },
          {
            key: 'F',
            title: 'F. Drawings & Manuals',
            layout: 'file-upload',
            fields: [],
          },
          {
            key: 'G',
            title: 'G. Classification & Regulatory Data',
            layout: 'grid-4',
            fields: [
              {
                key: 'classificationSociety',
                label: 'Classification Society',
                type: 'text',
                required: false,
              },
              {
                key: 'certificateNo',
                label: 'Certificate No',
                type: 'text',
                required: false,
              },
              {
                key: 'lastClassDate',
                label: 'Last Class Date',
                type: 'date',
                required: false,
              },
              {
                key: 'nextClassDate',
                label: 'Next Class Date',
                type: 'date',
                required: false,
              },
              {
                key: 'classCode',
                label: 'Class Code',
                type: 'text',
                required: false,
              },
              {
                key: 'classRemarks',
                label: 'Class Remarks',
                type: 'text',
                required: false,
              },
            ],
          },
          {
            key: 'H',
            title: 'H. New Service Notes',
            layout: 'grid-4',
            fields: [
              {
                key: 'serviceNote',
                label: 'Service Note',
                type: 'text',
                required: false,
              },
              {
                key: 'noteDate',
                label: 'Note Date',
                type: 'date',
                required: false,
              },
              {
                key: 'nextNote',
                label: 'Next Note',
                type: 'date',
                required: false,
              },
              {
                key: 'noteLevel',
                label: 'Note Level',
                type: 'text',
                required: false,
              },
            ],
          },
        ],
      };
    } else if (formName === 'WO_PLANNED') {
      return {
        title: 'Work Order Form (Planned)',
        sections: [
          {
            key: 'partA',
            title: 'Part A - Work Order Details',
            layout: 'grid-3',
            fields: [
              {
                key: 'woNumber',
                label: 'WO Number',
                type: 'text',
                required: true,
              },
              {
                key: 'component',
                label: 'Component',
                type: 'select',
                required: true,
              },
              {
                key: 'jobTitle',
                label: 'Job Title',
                type: 'text',
                required: true,
              },
              {
                key: 'workBy',
                label: 'Work By',
                type: 'select',
                required: true,
              },
              {
                key: 'assignedTo',
                label: 'Assigned To',
                type: 'select',
                required: false,
              },
              {
                key: 'priority',
                label: 'Priority',
                type: 'select',
                required: true,
              },
              {
                key: 'plannedDate',
                label: 'Planned Date',
                type: 'date',
                required: true,
              },
              {
                key: 'estimatedHours',
                label: 'Estimated Hours',
                type: 'number',
                required: false,
              },
            ],
          },
          {
            key: 'partB',
            title: 'Part B - Job Description & Instructions',
            layout: 'grid-1',
            fields: [
              {
                key: 'description',
                label: 'Description',
                type: 'textarea',
                required: true,
              },
              {
                key: 'instructions',
                label: 'Instructions',
                type: 'textarea',
                required: false,
              },
              {
                key: 'safetyPrecautions',
                label: 'Safety Precautions',
                type: 'textarea',
                required: false,
              },
              {
                key: 'requiredSpares',
                label: 'Required Spares',
                type: 'repeater',
                required: false,
              },
            ],
          },
        ],
      };
    } else if (formName === 'WO_UNPLANNED') {
      return {
        title: 'Work Order Form (Unplanned)',
        sections: [
          {
            key: 'partA',
            title: 'Part A - Breakdown Details',
            layout: 'grid-3',
            fields: [
              {
                key: 'woNumber',
                label: 'WO Number',
                type: 'text',
                required: true,
              },
              {
                key: 'component',
                label: 'Component',
                type: 'select',
                required: true,
              },
              {
                key: 'breakdownDate',
                label: 'Breakdown Date',
                type: 'datetime',
                required: true,
              },
              {
                key: 'reportedBy',
                label: 'Reported By',
                type: 'text',
                required: true,
              },
              {
                key: 'severity',
                label: 'Severity',
                type: 'select',
                required: true,
              },
              {
                key: 'impactOnOperation',
                label: 'Impact on Operation',
                type: 'select',
                required: true,
              },
            ],
          },
          {
            key: 'partB',
            title: 'Part B - Corrective Action',
            layout: 'grid-1',
            fields: [
              {
                key: 'failureDescription',
                label: 'Failure Description',
                type: 'textarea',
                required: true,
              },
              {
                key: 'rootCause',
                label: 'Root Cause',
                type: 'textarea',
                required: false,
              },
              {
                key: 'correctiveAction',
                label: 'Corrective Action',
                type: 'textarea',
                required: true,
              },
              {
                key: 'preventiveAction',
                label: 'Preventive Action',
                type: 'textarea',
                required: false,
              },
              {
                key: 'actualSpares',
                label: 'Actual Spares Used',
                type: 'repeater',
                required: false,
              },
            ],
          },
        ],
      };
    }
    return {};
  }

  private initializeComponents() {
    // Create hierarchical component structure for MV Test Vessel
    const sampleComponents: Component[] = [
      // Top level - Ship groups
      {
        id: '1',
        name: 'Ship General',
        componentCode: '1',
        parentId: null,
        vesselId: 'MV Test Vessel',
        category: 'Ship General',
        currentCumulativeRH: '0',
        lastUpdated: '02-Jun-2025',
        maker: null,
        model: null,
        serialNo: null,
        deptCategory: null,
        componentCategory: null,
        location: null,
        commissionedDate: null,
        critical: false,
        classItem: false,
      },
      {
        id: '2',
        name: 'Hull',
        componentCode: '2',
        parentId: null,
        vesselId: 'MV Test Vessel',
        category: 'Hull',
        currentCumulativeRH: '0',
        lastUpdated: '02-Jun-2025',
        maker: null,
        model: null,
        serialNo: null,
        deptCategory: null,
        componentCategory: null,
        location: null,
        commissionedDate: null,
        critical: false,
        classItem: false,
      },
      {
        id: '3',
        name: 'Equipment for Cargo',
        componentCode: '3',
        parentId: null,
        vesselId: 'MV Test Vessel',
        category: 'Equipment for Cargo',
        currentCumulativeRH: '0',
        lastUpdated: '02-Jun-2025',
        maker: null,
        model: null,
        serialNo: null,
        deptCategory: null,
        componentCategory: null,
        location: null,
        commissionedDate: null,
        critical: false,
        classItem: false,
      },
      {
        id: '4',
        name: "Ship's Equipment",
        componentCode: '4',
        parentId: null,
        vesselId: 'MV Test Vessel',
        category: "Ship's Equipment",
        currentCumulativeRH: '0',
        lastUpdated: '02-Jun-2025',
        maker: null,
        model: null,
        serialNo: null,
        deptCategory: null,
        componentCategory: null,
        location: null,
        commissionedDate: null,
        critical: false,
        classItem: false,
      },
      {
        id: '5',
        name: 'Equipment for Crew & Passengers',
        componentCode: '5',
        parentId: null,
        vesselId: 'MV Test Vessel',
        category: 'Equipment for Crew & Passengers',
        currentCumulativeRH: '0',
        lastUpdated: '02-Jun-2025',
        maker: null,
        model: null,
        serialNo: null,
        deptCategory: null,
        componentCategory: null,
        location: null,
        commissionedDate: null,
        critical: false,
        classItem: false,
      },
      {
        id: '6',
        name: 'Machinery Main Components',
        componentCode: '6',
        parentId: null,
        vesselId: 'MV Test Vessel',
        category: 'Machinery Main Components',
        currentCumulativeRH: '0',
        lastUpdated: '02-Jun-2025',
        maker: null,
        model: null,
        serialNo: null,
        deptCategory: null,
        componentCategory: null,
        location: null,
        commissionedDate: null,
        critical: false,
        classItem: false,
      },
      {
        id: '7',
        name: 'Systems for Machinery Main Components',
        componentCode: '7',
        parentId: null,
        vesselId: 'MV Test Vessel',
        category: 'Systems for Machinery Main Components',
        currentCumulativeRH: '0',
        lastUpdated: '02-Jun-2025',
        maker: null,
        model: null,
        serialNo: null,
        deptCategory: null,
        componentCategory: null,
        location: null,
        commissionedDate: null,
        critical: false,
        classItem: false,
      },
      {
        id: '8',
        name: 'Ship Common Systems',
        componentCode: '8',
        parentId: null,
        vesselId: 'MV Test Vessel',
        category: 'Ship Common Systems',
        currentCumulativeRH: '0',
        lastUpdated: '02-Jun-2025',
        maker: null,
        model: null,
        serialNo: null,
        deptCategory: null,
        componentCategory: null,
        location: null,
        commissionedDate: null,
        critical: false,
        classItem: false,
      },

      // Level 2 - Under Ship General
      {
        id: '1.1',
        name: 'Fresh Water System',
        componentCode: '1.1',
        parentId: '1',
        vesselId: 'MV Test Vessel',
        category: 'Ship General',
        currentCumulativeRH: '0',
        lastUpdated: '02-Jun-2025',
        maker: null,
        model: null,
        serialNo: null,
        deptCategory: null,
        componentCategory: null,
        location: null,
        commissionedDate: null,
        critical: false,
        classItem: false,
      },
      {
        id: '1.2',
        name: 'Sewage Treatment System',
        componentCode: '1.2',
        parentId: '1',
        vesselId: 'MV Test Vessel',
        category: 'Ship General',
        currentCumulativeRH: '0',
        lastUpdated: '02-Jun-2025',
        maker: null,
        model: null,
        serialNo: null,
        deptCategory: null,
        componentCategory: null,
        location: null,
        commissionedDate: null,
        critical: false,
        classItem: false,
      },
      {
        id: '1.3',
        name: 'HVAC – Accommodation',
        componentCode: '1.3',
        parentId: '1',
        vesselId: 'MV Test Vessel',
        category: 'Ship General',
        currentCumulativeRH: '0',
        lastUpdated: '02-Jun-2025',
        maker: null,
        model: null,
        serialNo: null,
        deptCategory: null,
        componentCategory: null,
        location: null,
        commissionedDate: null,
        critical: false,
        classItem: false,
      },

      // Level 3 - Under Fresh Water System
      {
        id: '1.1.1',
        name: 'Hydrophore Unit',
        componentCode: '1.1.1',
        parentId: '1.1',
        vesselId: 'MV Test Vessel',
        category: 'Ship General',
        currentCumulativeRH: '0',
        lastUpdated: '02-Jun-2025',
        maker: null,
        model: null,
        serialNo: null,
        deptCategory: null,
        componentCategory: null,
        location: null,
        commissionedDate: null,
        critical: false,
        classItem: false,
      },
      {
        id: '1.1.2',
        name: 'Potable Water Maker',
        componentCode: '1.1.2',
        parentId: '1.1',
        vesselId: 'MV Test Vessel',
        category: 'Ship General',
        currentCumulativeRH: '0',
        lastUpdated: '02-Jun-2025',
        maker: null,
        model: null,
        serialNo: null,
        deptCategory: null,
        componentCategory: null,
        location: null,
        commissionedDate: null,
        critical: false,
        classItem: false,
      },
      {
        id: '1.1.3',
        name: 'UV Sterilizer',
        componentCode: '1.1.3',
        parentId: '1.1',
        vesselId: 'MV Test Vessel',
        category: 'Ship General',
        currentCumulativeRH: '0',
        lastUpdated: '02-Jun-2025',
        maker: null,
        model: null,
        serialNo: null,
        deptCategory: null,
        componentCategory: null,
        location: null,
        commissionedDate: null,
        critical: false,
        classItem: false,
      },

      // Level 4 - Under Hydrophore Unit
      {
        id: '1.1.1.1',
        name: 'Pressure Vessel',
        componentCode: '1.1.1.1',
        parentId: '1.1.1',
        vesselId: 'MV Test Vessel',
        category: 'Ship General',
        currentCumulativeRH: '0',
        lastUpdated: '02-Jun-2025',
        maker: 'ACME Marine',
        model: 'PV-2000',
        serialNo: 'PV2024001',
        deptCategory: 'Engineering',
        componentCategory: 'Ship General',
        location: 'Engine Room',
        commissionedDate: '01-Jan-2020',
        critical: true,
        classItem: false,
      },
      {
        id: '1.1.1.2',
        name: 'Feed Pump',
        componentCode: '1.1.1.2',
        parentId: '1.1.1',
        vesselId: 'MV Test Vessel',
        category: 'Ship General',
        currentCumulativeRH: '12450',
        lastUpdated: '02-Jun-2025',
        maker: 'Grundfos',
        model: 'CR32-4',
        serialNo: 'GF2024002',
        deptCategory: 'Engineering',
        componentCategory: 'Ship General',
        location: 'Engine Room',
        commissionedDate: '01-Jan-2020',
        critical: true,
        classItem: true,
      },
      {
        id: '1.1.1.3',
        name: 'Pressure Switch',
        componentCode: '1.1.1.3',
        parentId: '1.1.1',
        vesselId: 'MV Test Vessel',
        category: 'Ship General',
        currentCumulativeRH: '0',
        lastUpdated: '02-Jun-2025',
        maker: 'Danfoss',
        model: 'KP35',
        serialNo: 'DF2024003',
        deptCategory: 'Engineering',
        componentCategory: 'Ship General',
        location: 'Engine Room',
        commissionedDate: '01-Jan-2020',
        critical: false,
        classItem: false,
      },

      // Level 2 - Under Machinery Main Components
      {
        id: '6.1',
        name: 'Diesel Engines',
        componentCode: '6.1',
        parentId: '6',
        vesselId: 'MV Test Vessel',
        category: 'Machinery Main Components',
        currentCumulativeRH: '0',
        lastUpdated: '02-Jun-2025',
        maker: null,
        model: null,
        serialNo: null,
        deptCategory: null,
        componentCategory: null,
        location: null,
        commissionedDate: null,
        critical: false,
        classItem: false,
      },
      {
        id: '6.2',
        name: 'Turbines',
        componentCode: '6.2',
        parentId: '6',
        vesselId: 'MV Test Vessel',
        category: 'Machinery Main Components',
        currentCumulativeRH: '0',
        lastUpdated: '02-Jun-2025',
        maker: null,
        model: null,
        serialNo: null,
        deptCategory: null,
        componentCategory: null,
        location: null,
        commissionedDate: null,
        critical: false,
        classItem: false,
      },

      // Level 3 - Under Diesel Engines
      {
        id: '6.1.1',
        name: 'Main Engine',
        componentCode: '6.1.1',
        parentId: '6.1',
        vesselId: 'MV Test Vessel',
        category: 'Machinery Main Components',
        currentCumulativeRH: '12580',
        lastUpdated: '30-Jun-2025',
        maker: null,
        model: null,
        serialNo: null,
        deptCategory: null,
        componentCategory: null,
        location: null,
        commissionedDate: null,
        critical: false,
        classItem: false,
      },
      {
        id: '6.1.2',
        name: 'Auxiliary Engine #1',
        componentCode: '6.1.2',
        parentId: '6.1',
        vesselId: 'MV Test Vessel',
        category: 'Machinery Main Components',
        currentCumulativeRH: '15670',
        lastUpdated: '09-Jun-2025',
        maker: null,
        model: null,
        serialNo: null,
        deptCategory: null,
        componentCategory: null,
        location: null,
        commissionedDate: null,
        critical: false,
        classItem: false,
      },
      {
        id: '6.1.3',
        name: 'Auxiliary Engine #2',
        componentCode: '6.1.3',
        parentId: '6.1',
        vesselId: 'MV Test Vessel',
        category: 'Machinery Main Components',
        currentCumulativeRH: '14980',
        lastUpdated: '16-Jun-2025',
        maker: null,
        model: null,
        serialNo: null,
        deptCategory: null,
        componentCategory: null,
        location: null,
        commissionedDate: null,
        critical: false,
        classItem: false,
      },

      // Level 4 - Under Main Engine
      {
        id: '6.1.1.1',
        name: 'Crankshaft',
        componentCode: '6.1.1.1',
        parentId: '6.1.1',
        vesselId: 'MV Test Vessel',
        category: 'Machinery Main Components',
        currentCumulativeRH: '12580',
        lastUpdated: '30-Jun-2025',
        maker: 'MAN B&W',
        model: '6S60MC-C',
        serialNo: 'MB2020001',
        deptCategory: 'Engineering',
        componentCategory: 'Machinery Main Components',
        location: 'Engine Room',
        commissionedDate: '01-Jan-2020',
        critical: true,
        classItem: true,
      },
      {
        id: '6.1.1.2',
        name: 'Cylinder Liners',
        componentCode: '6.1.1.2',
        parentId: '6.1.1',
        vesselId: 'MV Test Vessel',
        category: 'Machinery Main Components',
        currentCumulativeRH: '12580',
        lastUpdated: '30-Jun-2025',
        maker: 'MAN B&W',
        model: 'CL-600',
        serialNo: 'MB2020002',
        deptCategory: 'Engineering',
        componentCategory: 'Machinery Main Components',
        location: 'Engine Room',
        commissionedDate: '01-Jan-2020',
        critical: true,
        classItem: true,
      },
      {
        id: '6.1.1.3',
        name: 'Piston & Piston Rod',
        componentCode: '6.1.1.3',
        parentId: '6.1.1',
        vesselId: 'MV Test Vessel',
        category: 'Machinery Main Components',
        currentCumulativeRH: '12580',
        lastUpdated: '30-Jun-2025',
        maker: 'MAN B&W',
        model: 'PR-600',
        serialNo: 'MB2020003',
        deptCategory: 'Engineering',
        componentCategory: 'Machinery Main Components',
        location: 'Engine Room',
        commissionedDate: '01-Jan-2020',
        critical: true,
        classItem: true,
      },
      {
        id: '6.1.1.4',
        name: 'Connecting Rod',
        componentCode: '6.1.1.4',
        parentId: '6.1.1',
        vesselId: 'MV Test Vessel',
        category: 'Machinery Main Components',
        currentCumulativeRH: '12580',
        lastUpdated: '30-Jun-2025',
        maker: 'MAN B&W',
        model: 'CR-600',
        serialNo: 'MB2020004',
        deptCategory: 'Engineering',
        componentCategory: 'Machinery Main Components',
        location: 'Engine Room',
        commissionedDate: '01-Jan-2020',
        critical: true,
        classItem: false,
      },
      {
        id: '6.1.1.5',
        name: 'Camshaft',
        componentCode: '6.1.1.5',
        parentId: '6.1.1',
        vesselId: 'MV Test Vessel',
        category: 'Machinery Main Components',
        currentCumulativeRH: '12580',
        lastUpdated: '30-Jun-2025',
        maker: 'MAN B&W',
        model: 'CS-600',
        serialNo: 'MB2020005',
        deptCategory: 'Engineering',
        componentCategory: 'Machinery Main Components',
        location: 'Engine Room',
        commissionedDate: '01-Jan-2020',
        critical: true,
        classItem: false,
      },
    ];

    sampleComponents.forEach(comp => this.components.set(comp.id, comp));
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      user => user.username === username
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  // Running Hours methods
  async getComponents(vesselId: string): Promise<Component[]> {
    return Array.from(this.components.values()).filter(
      c => c.vesselId === vesselId
    );
  }

  async getComponent(id: string): Promise<Component | undefined> {
    return this.components.get(id);
  }

  async updateComponent(
    id: string,
    data: Partial<Component>
  ): Promise<Component> {
    const component = this.components.get(id);
    if (!component) {
      throw new Error(`Component ${id} not found`);
    }
    const updated = { ...component, ...data };
    this.components.set(id, updated);
    return updated;
  }

  async createRunningHoursAudit(
    audit: InsertRunningHoursAudit
  ): Promise<RunningHoursAudit> {
    const id = this.currentAuditId++;
    const fullAudit: RunningHoursAudit = {
      ...audit,
      id,
      previousRH: audit.previousRH.toString(),
      newRH: audit.newRH.toString(),
      cumulativeRH: audit.cumulativeRH.toString(),
      oldMeterFinal: audit.oldMeterFinal?.toString() || null,
      newMeterStart: audit.newMeterStart?.toString() || null,
      enteredAtUTC: audit.enteredAtUTC || new Date(),
      notes: audit.notes || null,
      version: audit.version || 1,
    };
    this.runningHoursAudits.push(fullAudit);
    return fullAudit;
  }

  async getRunningHoursAudits(
    componentId: string,
    limit?: number
  ): Promise<RunningHoursAudit[]> {
    const audits = this.runningHoursAudits
      .filter(a => a.componentId === componentId)
      .sort((a, b) => b.enteredAtUTC.getTime() - a.enteredAtUTC.getTime());

    return limit ? audits.slice(0, limit) : audits;
  }

  async getRunningHoursAuditsInDateRange(
    componentId: string,
    startDate: Date,
    endDate: Date
  ): Promise<RunningHoursAudit[]> {
    return this.runningHoursAudits.filter(a => {
      if (a.componentId !== componentId) return false;
      const auditDate = new Date(a.dateUpdatedLocal);
      return auditDate >= startDate && auditDate <= endDate;
    });
  }

  // Generate Component Spare Code
  private generateComponentSpareCode(
    vesselId: string,
    componentCode: string
  ): string {
    // Get all existing spares for this component in this vessel
    const existingSpares = Array.from(this.spares.values())
      .filter(
        s =>
          s.vesselId === vesselId &&
          s.componentCode === componentCode &&
          s.componentSpareCode
      )
      .map(s => s.componentSpareCode);

    // Extract existing sequence numbers for this component
    const prefix = `SP-${componentCode}-`;
    const existingNumbers = existingSpares
      .filter(code => code?.startsWith(prefix))
      .map(code => {
        const parts = code!.split('-');
        const nnn = parts[parts.length - 1];
        return parseInt(nnn, 10);
      })
      .filter(n => !isNaN(n));

    // Find the next available number
    const nextNumber =
      existingNumbers.length > 0 ? Math.max(...existingNumbers) + 1 : 1;

    // Format with zero padding
    const nnn = String(nextNumber).padStart(3, '0');
    return `${prefix}${nnn}`;
  }

  private initializeSpares() {
    const sampleSpares: Spare[] = [
      {
        id: 1,
        partCode: 'SP-ME-001',
        partName: 'Fuel Injector',
        componentId: '6.1',
        componentCode: '6.1',
        componentName: 'Main Engine',
        componentSpareCode: 'SP-6.1-001',
        critical: 'Critical',
        rob: 2,
        min: 1,
        location: 'Store Room A',
        vesselId: 'V001',
        deleted: false,
      },
      {
        id: 2,
        partCode: 'SP-ME-002',
        partName: 'Cylinder Head Gasket',
        componentId: '6.1.1',
        componentCode: '6.1.1',
        componentName: 'Cylinder Head',
        componentSpareCode: 'SP-6.1.1-001',
        critical: 'No',
        rob: 2,
        min: 1,
        location: 'Store Room B',
        vesselId: 'V001',
        deleted: false,
      },
      {
        id: 3,
        partCode: 'SP-ME-003',
        partName: 'Piston Ring Set',
        componentId: '6.1',
        componentCode: '6.1',
        componentName: 'Main Engine',
        componentSpareCode: 'SP-6.1-002',
        critical: 'No',
        rob: 3,
        min: 1,
        location: 'Store Room B',
        vesselId: 'V001',
        deleted: false,
      },
      {
        id: 4,
        partCode: 'SP-ME-004',
        partName: 'Main Bearing',
        componentId: '6.1.2',
        componentCode: '6.1.2',
        componentName: 'Main Bearings',
        componentSpareCode: 'SP-6.1.2-001',
        critical: 'Critical',
        rob: 4,
        min: 2,
        location: 'Store Room C',
        vesselId: 'V001',
        deleted: false,
      },
      {
        id: 5,
        partCode: 'SP-COOL-001',
        partName: 'Cooling Pump Seal',
        componentId: '7.3',
        componentCode: '7.3',
        componentName: 'Cooling Water System',
        componentSpareCode: 'SP-7.3-001',
        critical: 'Critical',
        rob: 4,
        min: 2,
        location: 'Store Room D',
        vesselId: 'V001',
        deleted: false,
      },
      {
        id: 6,
        partCode: 'SP-CC-001',
        partName: 'Cylinder Cover Assembly',
        componentId: '6.1.1.1',
        componentCode: '6.1.1.1',
        componentName: 'Valve Seats',
        componentSpareCode: 'SP-6.1.1.1-001',
        critical: 'Critical',
        rob: 2,
        min: 1,
        location: 'Store Room A',
        vesselId: 'V001',
        deleted: false,
      },
      {
        id: 7,
        partCode: 'SP-CC-002',
        partName: 'Inlet Valve',
        componentId: '6.1.1.1',
        componentCode: '6.1.1.1',
        componentName: 'Valve Seats',
        componentSpareCode: 'SP-6.1.1.1-002',
        critical: 'Critical',
        rob: 4,
        min: 2,
        location: 'Store Room A',
        vesselId: 'V001',
        deleted: false,
      },
      {
        id: 8,
        partCode: 'SP-CC-003',
        partName: 'Exhaust Valve',
        componentId: '6.1.1.1',
        componentCode: '6.1.1.1',
        componentName: 'Valve Seats',
        componentSpareCode: 'SP-6.1.1.1-003',
        critical: 'Critical',
        rob: 4,
        min: 2,
        location: 'Store Room A',
        vesselId: 'V001',
        deleted: false,
      },
      {
        id: 9,
        partCode: 'SP-CC-004',
        partName: 'Valve Spring',
        componentId: '6.1.1.2',
        componentCode: '6.1.1.2',
        componentName: 'Injector Sleeve',
        componentSpareCode: 'SP-6.1.1.2-001',
        critical: 'No',
        rob: 8,
        min: 4,
        location: 'Store Room B',
        vesselId: 'V001',
        deleted: false,
      },
      {
        id: 10,
        partCode: 'SP-CC-005',
        partName: 'Valve Guide',
        componentId: '6.1.1.3',
        componentCode: '6.1.1.3',
        componentName: 'Rocker Arm',
        componentSpareCode: 'SP-6.1.1.3-001',
        critical: 'No',
        rob: 1,
        min: 2,
        location: 'Store Room B',
        vesselId: 'V001',
        deleted: false,
      },
    ];

    sampleSpares.forEach(spare => this.spares.set(spare.id, spare));
    this.currentSpareId = 11;
  }

  // Spares methods
  async getSpares(vesselId: string): Promise<Spare[]> {
    return Array.from(this.spares.values()).filter(
      s => s.vesselId === vesselId && !s.deleted
    );
  }

  async getSpare(id: number): Promise<Spare | undefined> {
    const spare = this.spares.get(id);
    return spare && !spare.deleted ? spare : undefined;
  }

  async createSpare(spare: InsertSpare): Promise<Spare> {
    const id = this.currentSpareId++;

    // Generate component spare code if not provided
    const componentSpareCode =
      spare.componentSpareCode ||
      (spare.componentCode
        ? this.generateComponentSpareCode(
            spare.vesselId || 'V001',
            spare.componentCode
          )
        : null);

    const newSpare: Spare = {
      ...spare,
      id,
      vesselId: spare.vesselId || 'V001',
      componentCode: spare.componentCode || null,
      location: spare.location || null,
      componentSpareCode,
      rob: spare.rob || 0,
      min: spare.min || 0,
      deleted: false,
    };
    this.spares.set(id, newSpare);

    // Create history entry
    await this.createSpareHistory({
      timestampUTC: new Date(),
      vesselId: spare.vesselId || 'V001',
      spareId: id,
      partCode: spare.partCode,
      partName: spare.partName,
      componentId: spare.componentId,
      componentCode: spare.componentCode || null,
      componentName: spare.componentName,
      componentSpareCode: componentSpareCode,
      eventType: 'LINK_CREATED',
      qtyChange: spare.rob || 0,
      robAfter: spare.rob || 0,
      userId: 'system',
      remarks: 'Initial creation',
      reference: null,
    });

    return newSpare;
  }

  async updateSpare(id: number, data: Partial<Spare>): Promise<Spare> {
    const spare = this.spares.get(id);
    if (!spare || spare.deleted) {
      throw new Error(`Spare ${id} not found`);
    }
    const updated = { ...spare, ...data };
    this.spares.set(id, updated);

    // Create history entry if ROB changed
    if (data.rob !== undefined && data.rob !== spare.rob) {
      await this.createSpareHistory({
        timestampUTC: new Date(),
        vesselId: spare.vesselId,
        spareId: id,
        partCode: spare.partCode,
        partName: spare.partName,
        componentId: spare.componentId,
        componentCode: spare.componentCode || null,
        componentName: spare.componentName,
        componentSpareCode: spare.componentSpareCode || null,
        eventType: 'EDIT',
        qtyChange: data.rob - spare.rob,
        robAfter: data.rob,
        userId: 'system',
        remarks: 'Updated via edit',
        reference: null,
      });
    }

    return updated;
  }

  async deleteSpare(id: number): Promise<void> {
    const spare = this.spares.get(id);
    if (spare) {
      spare.deleted = true;
      this.spares.set(id, spare);
    }
  }

  async consumeSpare(
    id: number,
    quantity: number,
    userId: string,
    remarks?: string,
    place?: string,
    dateLocal?: string,
    tz?: string
  ): Promise<Spare> {
    const spare = await this.getSpare(id);
    if (!spare) {
      throw new Error(`Spare ${id} not found`);
    }

    if (spare.rob < quantity) {
      throw new Error('Insufficient stock');
    }

    spare.rob -= quantity;
    this.spares.set(id, spare);

    // Create history entry
    await this.createSpareHistory({
      timestampUTC: new Date(),
      vesselId: spare.vesselId,
      spareId: id,
      partCode: spare.partCode,
      partName: spare.partName,
      componentId: spare.componentId,
      componentCode: spare.componentCode || null,
      componentName: spare.componentName,
      componentSpareCode: spare.componentSpareCode || null,
      eventType: 'CONSUME',
      qtyChange: -quantity,
      robAfter: spare.rob,
      userId,
      remarks: remarks || null,
      reference: place || null,
      dateLocal: dateLocal || null,
      tz: tz || null,
    });

    return spare;
  }

  async receiveSpare(
    id: number,
    quantity: number,
    userId: string,
    remarks?: string,
    supplierPO?: string,
    place?: string,
    dateLocal?: string,
    tz?: string
  ): Promise<Spare> {
    const spare = await this.getSpare(id);
    if (!spare) {
      throw new Error(`Spare ${id} not found`);
    }

    spare.rob += quantity;
    this.spares.set(id, spare);

    // Create history entry
    await this.createSpareHistory({
      timestampUTC: new Date(),
      vesselId: spare.vesselId,
      spareId: id,
      partCode: spare.partCode,
      partName: spare.partName,
      componentId: spare.componentId,
      componentCode: spare.componentCode || null,
      componentName: spare.componentName,
      componentSpareCode: spare.componentSpareCode || null,
      eventType: 'RECEIVE',
      qtyChange: quantity,
      robAfter: spare.rob,
      userId,
      remarks: remarks || null,
      reference: supplierPO || null,
      place: place || null,
      dateLocal: dateLocal || null,
      tz: tz || null,
    });

    return spare;
  }

  async bulkUpdateSpares(
    updates: Array<{
      id: number;
      consumed?: number;
      received?: number;
      receivedDate?: string;
      receivedPlace?: string;
    }>,
    userId: string,
    remarks?: string
  ): Promise<Spare[]> {
    const updatedSpares: Spare[] = [];

    for (const update of updates) {
      const spare = await this.getSpare(update.id);
      if (!spare) continue;

      let netChange = 0;
      if (update.consumed) {
        if (spare.rob < update.consumed) {
          throw new Error(`Insufficient stock for ${spare.partCode}`);
        }
        netChange -= update.consumed;
      }
      if (update.received) {
        netChange += update.received;
      }

      if (netChange !== 0) {
        spare.rob += netChange;
        this.spares.set(update.id, spare);

        // Create history entry
        await this.createSpareHistory({
          timestampUTC: new Date(),
          vesselId: spare.vesselId,
          spareId: update.id,
          partCode: spare.partCode,
          partName: spare.partName,
          componentId: spare.componentId,
          componentCode: spare.componentCode || null,
          componentName: spare.componentName,
          componentSpareCode: spare.componentSpareCode || null,
          eventType: 'ADJUST',
          qtyChange: netChange,
          robAfter: spare.rob,
          userId,
          remarks: remarks || 'Bulk update',
          reference: null,
          dateLocal: update.receivedDate || null,
          place: update.receivedPlace || null,
          tz: update.receivedDate
            ? Intl.DateTimeFormat().resolvedOptions().timeZone
            : null,
        });

        updatedSpares.push(spare);
      }
    }

    return updatedSpares;
  }

  // Spares History methods
  async getSpareHistory(vesselId: string): Promise<SpareHistory[]> {
    return this.sparesHistory
      .filter(h => h.vesselId === vesselId)
      .sort((a, b) => b.timestampUTC.getTime() - a.timestampUTC.getTime());
  }

  async getSpareHistoryBySpareId(spareId: number): Promise<SpareHistory[]> {
    return this.sparesHistory
      .filter(h => h.spareId === spareId)
      .sort((a, b) => b.timestampUTC.getTime() - a.timestampUTC.getTime());
  }

  async createSpareHistory(history: InsertSpareHistory): Promise<SpareHistory> {
    const id = this.currentHistoryId++;
    const fullHistory: SpareHistory = { ...history, id };
    this.sparesHistory.push(fullHistory);
    return fullHistory;
  }

  // Change Request methods
  async getChangeRequests(filters?: {
    category?: string;
    status?: string;
    q?: string;
    vesselId?: string;
  }): Promise<ChangeRequest[]> {
    let requests = Array.from(this.changeRequests.values());

    if (filters) {
      if (filters.category) {
        requests = requests.filter(r => r.category === filters.category);
      }
      if (filters.status) {
        requests = requests.filter(r => r.status === filters.status);
      }
      if (filters.vesselId) {
        requests = requests.filter(r => r.vesselId === filters.vesselId);
      }
      if (filters.q) {
        const search = filters.q.toLowerCase();
        requests = requests.filter(
          r =>
            r.title.toLowerCase().includes(search) ||
            r.status.toLowerCase().includes(search)
        );
      }
    }

    return requests.sort(
      (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
    );
  }

  async getChangeRequest(id: number): Promise<ChangeRequest | undefined> {
    return this.changeRequests.get(id);
  }

  async createChangeRequest(
    request: InsertChangeRequest
  ): Promise<ChangeRequest> {
    const id = this.currentChangeRequestId++;
    const now = new Date();
    const fullRequest: ChangeRequest = {
      ...request,
      id,
      status: request.status || 'draft',
      targetType: request.targetType || null,
      targetId: request.targetId || null,
      snapshotBeforeJson: request.snapshotBeforeJson || null,
      proposedChangesJson: request.proposedChangesJson || null,
      movePreviewJson: request.movePreviewJson || null,
      submittedAt: request.submittedAt || null,
      reviewedByUserId: request.reviewedByUserId || null,
      reviewedAt: request.reviewedAt || null,
      createdAt: now,
      updatedAt: now,
    };
    this.changeRequests.set(id, fullRequest);
    return fullRequest;
  }

  async updateChangeRequest(
    id: number,
    data: Partial<ChangeRequest>
  ): Promise<ChangeRequest> {
    const request = this.changeRequests.get(id);
    if (!request) throw new Error('Change request not found');

    const updated = {
      ...request,
      ...data,
      updatedAt: new Date(),
    };
    this.changeRequests.set(id, updated);
    return updated;
  }

  async updateChangeRequestTarget(
    id: number,
    targetType: string | null,
    targetId: string | null,
    snapshotBeforeJson: any
  ): Promise<ChangeRequest> {
    const request = this.changeRequests.get(id);
    if (!request) throw new Error('Change request not found');

    if (request.status !== 'draft' && request.status !== 'returned') {
      throw new Error('Can only update target for draft or returned requests');
    }

    const updated = {
      ...request,
      targetType,
      targetId,
      snapshotBeforeJson,
      updatedAt: new Date(),
    };
    this.changeRequests.set(id, updated);
    return updated;
  }

  async updateChangeRequestProposed(
    id: number,
    proposedChangesJson: any,
    movePreviewJson?: any
  ): Promise<ChangeRequest> {
    const request = this.changeRequests.get(id);
    if (!request) throw new Error('Change request not found');

    if (request.status !== 'draft' && request.status !== 'returned') {
      throw new Error(
        'Can only update proposed changes for draft or returned requests'
      );
    }

    const updated = {
      ...request,
      proposedChangesJson,
      movePreviewJson: movePreviewJson || null,
      updatedAt: new Date(),
    };
    this.changeRequests.set(id, updated);
    return updated;
  }

  async deleteChangeRequest(id: number): Promise<void> {
    const request = this.changeRequests.get(id);
    if (!request) throw new Error('Change request not found');
    if (request.status !== 'draft') {
      throw new Error('Only draft requests can be deleted');
    }
    this.changeRequests.delete(id);
  }

  async submitChangeRequest(
    id: number,
    userId: string
  ): Promise<ChangeRequest> {
    const request = this.changeRequests.get(id);
    if (!request) throw new Error('Change request not found');

    const now = new Date();
    const updated = {
      ...request,
      status: 'submitted' as const,
      submittedAt: now,
      requestedByUserId: userId,
      updatedAt: now,
    };
    this.changeRequests.set(id, updated);
    return updated;
  }

  async approveChangeRequest(
    id: number,
    reviewerId: string,
    comment: string
  ): Promise<ChangeRequest> {
    const request = this.changeRequests.get(id);
    if (!request) throw new Error('Change request not found');
    if (request.status !== 'submitted') {
      throw new Error('Only submitted requests can be approved');
    }

    // Add comment
    await this.createChangeRequestComment({
      changeRequestId: id,
      userId: reviewerId,
      message: `APPROVED: ${comment}`,
    });

    const now = new Date();
    const updated = {
      ...request,
      status: 'approved' as const,
      reviewedByUserId: reviewerId,
      reviewedAt: now,
      updatedAt: now,
    };
    this.changeRequests.set(id, updated);
    return updated;
  }

  async rejectChangeRequest(
    id: number,
    reviewerId: string,
    comment: string
  ): Promise<ChangeRequest> {
    const request = this.changeRequests.get(id);
    if (!request) throw new Error('Change request not found');
    if (request.status !== 'submitted') {
      throw new Error('Only submitted requests can be rejected');
    }

    // Add comment
    await this.createChangeRequestComment({
      changeRequestId: id,
      userId: reviewerId,
      message: `REJECTED: ${comment}`,
    });

    const now = new Date();
    const updated = {
      ...request,
      status: 'rejected' as const,
      reviewedByUserId: reviewerId,
      reviewedAt: now,
      updatedAt: now,
    };
    this.changeRequests.set(id, updated);
    return updated;
  }

  async returnChangeRequest(
    id: number,
    reviewerId: string,
    comment: string
  ): Promise<ChangeRequest> {
    const request = this.changeRequests.get(id);
    if (!request) throw new Error('Change request not found');
    if (request.status !== 'submitted') {
      throw new Error('Only submitted requests can be returned');
    }

    // Add comment
    await this.createChangeRequestComment({
      changeRequestId: id,
      userId: reviewerId,
      message: `RETURNED FOR CLARIFICATION: ${comment}`,
    });

    const now = new Date();
    const updated = {
      ...request,
      status: 'returned' as const,
      reviewedByUserId: reviewerId,
      reviewedAt: now,
      updatedAt: now,
    };
    this.changeRequests.set(id, updated);
    return updated;
  }

  // Change Request Attachments
  async getChangeRequestAttachments(
    changeRequestId: number
  ): Promise<ChangeRequestAttachment[]> {
    return this.changeRequestAttachments.filter(
      a => a.changeRequestId === changeRequestId
    );
  }

  async createChangeRequestAttachment(
    attachment: InsertChangeRequestAttachment
  ): Promise<ChangeRequestAttachment> {
    const id = this.currentAttachmentId++;
    const fullAttachment: ChangeRequestAttachment = {
      ...attachment,
      id,
      uploadedAt: new Date(),
    };
    this.changeRequestAttachments.push(fullAttachment);
    return fullAttachment;
  }

  // Change Request Comments
  async getChangeRequestComments(
    changeRequestId: number
  ): Promise<ChangeRequestComment[]> {
    return this.changeRequestComments
      .filter(c => c.changeRequestId === changeRequestId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async createChangeRequestComment(
    comment: InsertChangeRequestComment
  ): Promise<ChangeRequestComment> {
    const id = this.currentCommentId++;
    const fullComment: ChangeRequestComment = {
      ...comment,
      id,
      createdAt: new Date(),
    };
    this.changeRequestComments.push(fullComment);
    return fullComment;
  }

  // Bulk Import methods
  async bulkCreateComponents(
    components: InsertComponent[]
  ): Promise<Component[]> {
    const created: Component[] = [];
    for (const comp of components) {
      const newComp: Component = {
        ...comp,
        id: comp.id || String(Date.now() + Math.random()),
        vesselId: comp.vesselId || 'V001',
        currentCumulativeRH: comp.currentCumulativeRH || '0',
        lastUpdated: comp.lastUpdated || new Date().toISOString().split('T')[0],
      };
      this.components.set(newComp.id, newComp);
      created.push(newComp);
    }
    return created;
  }

  async bulkUpdateComponents(
    updates: Array<{ id: string; data: Partial<Component> }>
  ): Promise<Component[]> {
    const updated: Component[] = [];
    for (const { id, data } of updates) {
      const existing = this.components.get(id);
      if (existing) {
        const updatedComp = { ...existing, ...data };
        this.components.set(id, updatedComp);
        updated.push(updatedComp);
      }
    }
    return updated;
  }

  async bulkUpsertComponents(
    components: InsertComponent[]
  ): Promise<{ created: number; updated: number }> {
    let created = 0;
    let updated = 0;

    for (const comp of components) {
      const id = comp.id || comp.componentCode;
      if (!id) continue;

      if (this.components.has(id)) {
        const existing = this.components.get(id)!;
        this.components.set(id, { ...existing, ...comp });
        updated++;
      } else {
        const newComp: Component = {
          ...comp,
          id,
          currentCumulativeRH: comp.currentCumulativeRH || '0',
          lastUpdated:
            comp.lastUpdated || new Date().toISOString().split('T')[0],
        };
        this.components.set(id, newComp);
        created++;
      }
    }

    return { created, updated };
  }

  async bulkCreateSpares(spares: InsertSpare[]): Promise<Spare[]> {
    const created: Spare[] = [];
    for (const spare of spares) {
      const id = this.currentSpareId++;
      const newSpare: Spare = {
        ...spare,
        id,
        robStock: spare.robStock || 0,
        consumed: spare.consumed || 0,
        received: spare.received || 0,
        status: spare.status || 'active',
        minStock: spare.minStock || 0,
        stockStatus: this.calculateStockStatus(
          spare.robStock || 0,
          spare.minStock || 0
        ),
        issuedWithUnit: spare.issuedWithUnit || 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      this.spares.set(id, newSpare);
      created.push(newSpare);
    }
    return created;
  }

  async bulkUpdateSparesByROB(
    updates: Array<{ robId: string; data: Partial<Spare> }>
  ): Promise<Spare[]> {
    const updated: Spare[] = [];
    for (const { robId, data } of updates) {
      // Find spare by robId
      const existingEntry = Array.from(this.spares.entries()).find(
        ([_, spare]) => spare.robId === robId
      );
      if (existingEntry) {
        const [id, existing] = existingEntry;
        const updatedSpare = { ...existing, ...data, updatedAt: new Date() };
        this.spares.set(id, updatedSpare);
        updated.push(updatedSpare);
      }
    }
    return updated;
  }

  async bulkUpsertSpares(
    spares: InsertSpare[]
  ): Promise<{ created: number; updated: number }> {
    let created = 0;
    let updated = 0;

    for (const spare of spares) {
      // Try to find existing spare by robId
      const existingEntry = Array.from(this.spares.entries()).find(
        ([_, s]) => s.robId === spare.robId
      );

      if (existingEntry) {
        const [id, existing] = existingEntry;
        const updatedSpare = {
          ...existing,
          ...spare,
          stockStatus: this.calculateStockStatus(
            spare.robStock || existing.robStock,
            spare.minStock || existing.minStock
          ),
          updatedAt: new Date(),
        };
        this.spares.set(id, updatedSpare);
        updated++;
      } else {
        const id = this.currentSpareId++;
        const newSpare: Spare = {
          ...spare,
          id,
          robStock: spare.robStock || 0,
          consumed: spare.consumed || 0,
          received: spare.received || 0,
          status: spare.status || 'active',
          minStock: spare.minStock || 0,
          stockStatus: this.calculateStockStatus(
            spare.robStock || 0,
            spare.minStock || 0
          ),
          issuedWithUnit: spare.issuedWithUnit || 0,
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        this.spares.set(id, newSpare);
        created++;
      }
    }

    return { created, updated };
  }

  async archiveComponentsByIds(ids: string[]): Promise<number> {
    let archived = 0;
    for (const id of ids) {
      if (this.components.has(id)) {
        const comp = this.components.get(id)!;
        this.components.set(id, { ...comp, status: 'archived' });
        archived++;
      }
    }
    return archived;
  }

  async archiveSparesByIds(ids: number[]): Promise<number> {
    let archived = 0;
    for (const id of ids) {
      if (this.spares.has(id)) {
        const spare = this.spares.get(id)!;
        this.spares.set(id, { ...spare, status: 'archived' });
        archived++;
      }
    }
    return archived;
  }

  private calculateStockStatus(robStock: number, minStock: number): string {
    if (robStock === 0) return 'Out of Stock';
    if (robStock < minStock) return 'Minimum';
    if (robStock < minStock * 1.5) return 'Low';
    return 'OK';
  }

  private initializeAlertPolicies() {
    // Initialize default alert policies
    const defaultPolicies = [
      {
        alertType: 'maintenance_due',
        enabled: true,
        priority: 'medium',
        emailEnabled: false,
        inAppEnabled: true,
        thresholds: JSON.stringify({
          daysBeforeDue: 7,
          includePendingApproval: false,
          onlyCritical: false,
        }),
        scopeFilters: JSON.stringify({}),
        recipients: JSON.stringify({
          roles: ['Chief Engineer', '2nd Engineer'],
          users: [],
        }),
        createdBy: 'system',
        updatedBy: 'system',
      },
      {
        alertType: 'critical_inventory',
        enabled: true,
        priority: 'high',
        emailEnabled: true,
        inAppEnabled: true,
        thresholds: JSON.stringify({
          bufferQty: 0,
          includeNonCritical: false,
        }),
        scopeFilters: JSON.stringify({}),
        recipients: JSON.stringify({
          roles: ['Chief Engineer', 'Tech Superintendent'],
          users: [],
        }),
        createdBy: 'system',
        updatedBy: 'system',
      },
      {
        alertType: 'running_hours',
        enabled: true,
        priority: 'medium',
        emailEnabled: false,
        inAppEnabled: true,
        thresholds: JSON.stringify({
          hoursBeforeService: 100,
          utilizationSpikePercent: null,
        }),
        scopeFilters: JSON.stringify({}),
        recipients: JSON.stringify({
          roles: ['Chief Engineer'],
          users: [],
        }),
        createdBy: 'system',
        updatedBy: 'system',
      },
      {
        alertType: 'certificate_expiration',
        enabled: true,
        priority: 'high',
        emailEnabled: true,
        inAppEnabled: true,
        thresholds: JSON.stringify({
          daysBeforeExpiry: 30,
          types: ['Class Certificates', 'Flag', 'Insurance'],
        }),
        scopeFilters: JSON.stringify({}),
        recipients: JSON.stringify({
          roles: ['Tech Superintendent', 'Office'],
          users: [],
        }),
        createdBy: 'system',
        updatedBy: 'system',
      },
      {
        alertType: 'system_backup',
        enabled: true,
        priority: 'low',
        emailEnabled: false,
        inAppEnabled: true,
        thresholds: JSON.stringify({
          requireDailySuccess: true,
          maxAgeHours: 26,
        }),
        scopeFilters: JSON.stringify({}),
        recipients: JSON.stringify({
          roles: ['Tech Superintendent'],
          users: [],
        }),
        createdBy: 'system',
        updatedBy: 'system',
      },
    ];

    defaultPolicies.forEach((policy, index) => {
      const newPolicy: AlertPolicy = {
        id: index + 1,
        ...policy,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      this.alertPolicies.set(newPolicy.id, newPolicy);
      this.currentAlertPolicyId = index + 2;
    });
  }

  // Alert Policy methods
  async getAlertPolicies(): Promise<AlertPolicy[]> {
    return Array.from(this.alertPolicies.values());
  }

  async getAlertPolicy(id: number): Promise<AlertPolicy | undefined> {
    return this.alertPolicies.get(id);
  }

  async createAlertPolicy(policy: InsertAlertPolicy): Promise<AlertPolicy> {
    const newPolicy: AlertPolicy = {
      id: this.currentAlertPolicyId++,
      ...policy,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.alertPolicies.set(newPolicy.id, newPolicy);
    return newPolicy;
  }

  async updateAlertPolicy(
    id: number,
    data: Partial<AlertPolicy>
  ): Promise<AlertPolicy> {
    const policy = this.alertPolicies.get(id);
    if (!policy) {
      throw new Error(`Alert policy ${id} not found`);
    }
    const updated = {
      ...policy,
      ...data,
      updatedAt: new Date(),
    };
    this.alertPolicies.set(id, updated);
    return updated;
  }

  async deleteAlertPolicy(id: number): Promise<void> {
    this.alertPolicies.delete(id);
  }

  // Alert Event methods
  async getAlertEvents(filters?: {
    startDate?: Date;
    endDate?: Date;
    alertType?: string;
    priority?: string;
    status?: string;
    vesselId?: string;
  }): Promise<AlertEvent[]> {
    let events = Array.from(this.alertEvents.values());

    if (filters) {
      if (filters.startDate) {
        events = events.filter(e => e.createdAt >= filters.startDate!);
      }
      if (filters.endDate) {
        events = events.filter(e => e.createdAt <= filters.endDate!);
      }
      if (filters.alertType) {
        events = events.filter(e => e.alertType === filters.alertType);
      }
      if (filters.priority) {
        events = events.filter(e => e.priority === filters.priority);
      }
      if (filters.vesselId) {
        events = events.filter(e => e.vesselId === filters.vesselId);
      }
    }

    return events.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async getAlertEvent(id: number): Promise<AlertEvent | undefined> {
    return this.alertEvents.get(id);
  }

  async createAlertEvent(event: InsertAlertEvent): Promise<AlertEvent> {
    const newEvent: AlertEvent = {
      id: this.currentAlertEventId++,
      ...event,
      createdAt: new Date(),
    };
    this.alertEvents.set(newEvent.id, newEvent);
    return newEvent;
  }

  async acknowledgeAlertEvent(id: number, userId: string): Promise<AlertEvent> {
    const event = this.alertEvents.get(id);
    if (!event) {
      throw new Error(`Alert event ${id} not found`);
    }
    const updated = {
      ...event,
      ackBy: userId,
      ackAt: new Date(),
    };
    this.alertEvents.set(id, updated);
    return updated;
  }

  // Alert Delivery methods
  async getAlertDeliveries(eventId: number): Promise<AlertDelivery[]> {
    return Array.from(this.alertDeliveries.values()).filter(
      d => d.eventId === eventId
    );
  }

  async createAlertDelivery(
    delivery: InsertAlertDelivery
  ): Promise<AlertDelivery> {
    const newDelivery: AlertDelivery = {
      id: this.currentAlertDeliveryId++,
      ...delivery,
      createdAt: new Date(),
    };
    this.alertDeliveries.set(newDelivery.id, newDelivery);
    return newDelivery;
  }

  async updateAlertDeliveryStatus(
    id: number,
    status: string,
    errorMessage?: string
  ): Promise<AlertDelivery> {
    const delivery = this.alertDeliveries.get(id);
    if (!delivery) {
      throw new Error(`Alert delivery ${id} not found`);
    }
    const updated = {
      ...delivery,
      status,
      errorMessage,
      sentAt: status === 'sent' ? new Date() : delivery.sentAt,
      acknowledgedAt:
        status === 'acknowledged' ? new Date() : delivery.acknowledgedAt,
    };
    this.alertDeliveries.set(id, updated);
    return updated;
  }

  // Alert Config methods
  async getAlertConfig(vesselId: string): Promise<AlertConfig | undefined> {
    return this.alertConfigs.get(vesselId);
  }

  async createOrUpdateAlertConfig(
    config: InsertAlertConfig
  ): Promise<AlertConfig> {
    const existing = this.alertConfigs.get(config.vesselId);

    if (existing) {
      const updated = {
        ...existing,
        ...config,
        updatedAt: new Date(),
      };
      this.alertConfigs.set(config.vesselId, updated);
      return updated;
    } else {
      const newConfig: AlertConfig = {
        id: this.currentAlertConfigId++,
        ...config,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      this.alertConfigs.set(config.vesselId, newConfig);
      return newConfig;
    }
  }

  // Form Definition methods
  async getFormDefinitions(): Promise<FormDefinition[]> {
    return Array.from(this.formDefinitions.values());
  }

  async getFormDefinition(id: number): Promise<FormDefinition | undefined> {
    return this.formDefinitions.get(id);
  }

  async getFormDefinitionByName(
    name: string
  ): Promise<FormDefinition | undefined> {
    return Array.from(this.formDefinitions.values()).find(f => f.name === name);
  }

  async createFormDefinition(
    form: InsertFormDefinition
  ): Promise<FormDefinition> {
    const newForm: FormDefinition = {
      id: this.currentFormDefinitionId++,
      ...form,
    };
    this.formDefinitions.set(newForm.id, newForm);
    return newForm;
  }

  // Form Version methods
  async getFormVersions(formId: number): Promise<FormVersion[]> {
    return Array.from(this.formVersions.values())
      .filter(v => v.formId === formId)
      .sort((a, b) => b.versionNo - a.versionNo);
  }

  async getFormVersion(id: number): Promise<FormVersion | undefined> {
    return this.formVersions.get(id);
  }

  async getLatestPublishedVersion(
    formId: number
  ): Promise<FormVersion | undefined> {
    const versions = await this.getFormVersions(formId);
    return versions.find(v => v.status === 'PUBLISHED');
  }

  async getLatestPublishedVersionByName(
    name: string
  ): Promise<FormVersion | undefined> {
    const form = await this.getFormDefinitionByName(name);
    if (!form) return undefined;
    return this.getLatestPublishedVersion(form.id);
  }

  async createFormVersion(version: InsertFormVersion): Promise<FormVersion> {
    const newVersion: FormVersion = {
      id: this.currentFormVersionId++,
      ...version,
      versionDate: version.versionDate || new Date(),
    };
    this.formVersions.set(newVersion.id, newVersion);
    return newVersion;
  }

  async updateFormVersion(
    id: number,
    data: Partial<FormVersion>
  ): Promise<FormVersion> {
    const version = this.formVersions.get(id);
    if (!version) throw new Error('Form version not found');

    if (version.status !== 'DRAFT') {
      throw new Error('Can only update draft versions');
    }

    const updated = { ...version, ...data };
    this.formVersions.set(id, updated);
    return updated;
  }

  async publishFormVersion(
    id: number,
    userId: string,
    changelog: string
  ): Promise<FormVersion> {
    const version = this.formVersions.get(id);
    if (!version) throw new Error('Form version not found');

    if (version.status !== 'DRAFT') {
      throw new Error('Can only publish draft versions');
    }

    // Archive current published version
    const currentPublished = await this.getLatestPublishedVersion(
      version.formId
    );
    if (currentPublished) {
      this.formVersions.set(currentPublished.id, {
        ...currentPublished,
        status: 'ARCHIVED',
      });
    }

    // Publish new version
    const published = {
      ...version,
      status: 'PUBLISHED' as const,
      authorUserId: userId,
      changelog,
      versionDate: new Date(),
    };
    this.formVersions.set(id, published);
    return published;
  }

  async discardFormVersion(id: number): Promise<void> {
    const version = this.formVersions.get(id);
    if (!version) throw new Error('Form version not found');

    if (version.status !== 'DRAFT') {
      throw new Error('Can only discard draft versions');
    }

    this.formVersions.delete(id);
  }

  // Form Version Usage methods
  async createFormVersionUsage(
    usage: InsertFormVersionUsage
  ): Promise<FormVersionUsage> {
    const newUsage: FormVersionUsage = {
      id: this.currentFormUsageId++,
      ...usage,
      usedAt: usage.usedAt || new Date(),
    };
    this.formVersionUsages.push(newUsage);
    return newUsage;
  }

  async getFormVersionUsage(
    formVersionId: number
  ): Promise<FormVersionUsage[]> {
    return this.formVersionUsages.filter(
      u => u.formVersionId === formVersionId
    );
  }

  // Seed forms method
  async seedForms(): Promise<void> {
    // Check if forms already exist
    if (this.formDefinitions.size > 0) {
      return; // Already seeded
    }

    // Re-initialize forms
    await this.initializeFormDefinitions();
  }
}

// Export MySQL database storage from database.ts
export { storage } from './database';
