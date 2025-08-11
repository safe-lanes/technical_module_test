
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
  type InsertSpareHistory
} from "@shared/schema";

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
  createRunningHoursAudit(audit: InsertRunningHoursAudit): Promise<RunningHoursAudit>;
  getRunningHoursAudits(componentId: string, limit?: number): Promise<RunningHoursAudit[]>;
  getRunningHoursAuditsInDateRange(componentId: string, startDate: Date, endDate: Date): Promise<RunningHoursAudit[]>;
  
  // Spares methods
  getSpares(vesselId: string): Promise<Spare[]>;
  getSpare(id: number): Promise<Spare | undefined>;
  createSpare(spare: InsertSpare): Promise<Spare>;
  updateSpare(id: number, data: Partial<Spare>): Promise<Spare>;
  deleteSpare(id: number): Promise<void>;
  consumeSpare(id: number, quantity: number, userId: string, remarks?: string, reference?: string): Promise<Spare>;
  receiveSpare(id: number, quantity: number, userId: string, remarks?: string, reference?: string): Promise<Spare>;
  bulkUpdateSpares(updates: Array<{id: number, consumed?: number, received?: number}>, userId: string, remarks?: string): Promise<Spare[]>;
  
  // Spares History methods
  getSpareHistory(vesselId: string): Promise<SpareHistory[]>;
  getSpareHistoryBySpareId(spareId: number): Promise<SpareHistory[]>;
  createSpareHistory(history: InsertSpareHistory): Promise<SpareHistory>;
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
    
    // Initialize sample components and spares
    this.initializeComponents();
    this.initializeSpares();
  }

  private initializeComponents() {
    const sampleComponents: Component[] = [
      { id: "1", name: "Radar System", componentCode: "3.1.1", category: "Navigation System", currentCumulativeRH: "18560", lastUpdated: "02-Jun-2025", vesselId: "V001" },
      { id: "2", name: "Diesel Generator # 1", componentCode: "2.1.1", category: "Electrical System", currentCumulativeRH: "15670", lastUpdated: "09-Jun-2025", vesselId: "V001" },
      { id: "3", name: "Diesel Generator # 2", componentCode: "2.1.2", category: "Electrical System", currentCumulativeRH: "14980", lastUpdated: "16-Jun-2025", vesselId: "V001" },
      { id: "4", name: "Main Cooling Seawater Pump", componentCode: "7.1.2.1", category: "Cooling System", currentCumulativeRH: "12800", lastUpdated: "23-Jun-2025", vesselId: "V001" },
      { id: "5", name: "Main Engine", componentCode: "1.1.1", category: "Propulsion System", currentCumulativeRH: "12580", lastUpdated: "30-Jun-2025", vesselId: "V001" },
      { id: "6", name: "Propeller System", componentCode: "1.5.1", category: "Propulsion System", currentCumulativeRH: "12580", lastUpdated: "02-Jun-2025", vesselId: "V001" },
      { id: "7", name: "Main Lubrication Oil Pump", componentCode: "8.1.1", category: "Lubrication System", currentCumulativeRH: "12450", lastUpdated: "09-Jun-2025", vesselId: "V001" },
      { id: "8", name: "Steering Gear", componentCode: "3.2.1", category: "Navigation System", currentCumulativeRH: "11240", lastUpdated: "19-Jun-2025", vesselId: "V001" },
      { id: "9", name: "Main Air Compressor", componentCode: "9.1.1", category: "Air System", currentCumulativeRH: "10840", lastUpdated: "25-Jun-2025", vesselId: "V001" },
      { id: "10", name: "Bow Thruster", componentCode: "1.5.2", category: "Propulsion System", currentCumulativeRH: "10450", lastUpdated: "30-Jun-2025", vesselId: "V001" }
    ];
    
    sampleComponents.forEach(comp => this.components.set(comp.id, comp));
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
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
    return Array.from(this.components.values()).filter(c => c.vesselId === vesselId);
  }

  async getComponent(id: string): Promise<Component | undefined> {
    return this.components.get(id);
  }

  async updateComponent(id: string, data: Partial<Component>): Promise<Component> {
    const component = this.components.get(id);
    if (!component) {
      throw new Error(`Component ${id} not found`);
    }
    const updated = { ...component, ...data };
    this.components.set(id, updated);
    return updated;
  }

  async createRunningHoursAudit(audit: InsertRunningHoursAudit): Promise<RunningHoursAudit> {
    const id = this.currentAuditId++;
    const fullAudit: RunningHoursAudit = { 
      ...audit, 
      id,
      previousRH: audit.previousRH.toString(),
      newRH: audit.newRH.toString(),
      cumulativeRH: audit.cumulativeRH.toString(),
      oldMeterFinal: audit.oldMeterFinal?.toString() || null,
      newMeterStart: audit.newMeterStart?.toString() || null,
      enteredAtUTC: audit.enteredAtUTC || new Date()
    };
    this.runningHoursAudits.push(fullAudit);
    return fullAudit;
  }

  async getRunningHoursAudits(componentId: string, limit?: number): Promise<RunningHoursAudit[]> {
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
  private generateComponentSpareCode(vesselId: string, componentCode: string): string {
    // Get all existing spares for this component in this vessel
    const existingSpares = Array.from(this.spares.values())
      .filter(s => s.vesselId === vesselId && s.componentCode === componentCode && s.componentSpareCode)
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
    const nextNumber = existingNumbers.length > 0 ? Math.max(...existingNumbers) + 1 : 1;
    
    // Format with zero padding
    const nnn = String(nextNumber).padStart(3, '0');
    return `${prefix}${nnn}`;
  }

  private initializeSpares() {
    const sampleSpares: Spare[] = [
      { id: 1, partCode: "SP-ME-001", partName: "Fuel Injector", componentId: "6.1", componentCode: "6.1", componentName: "Main Engine", componentSpareCode: "SP-6.1-001", critical: "Critical", rob: 2, min: 1, location: "Store Room A", vesselId: "V001", deleted: false },
      { id: 2, partCode: "SP-ME-002", partName: "Cylinder Head Gasket", componentId: "6.1.1", componentCode: "6.1.1", componentName: "Cylinder Head", componentSpareCode: "SP-6.1.1-001", critical: "No", rob: 2, min: 1, location: "Store Room B", vesselId: "V001", deleted: false },
      { id: 3, partCode: "SP-ME-003", partName: "Piston Ring Set", componentId: "6.1", componentCode: "6.1", componentName: "Main Engine", componentSpareCode: "SP-6.1-002", critical: "No", rob: 3, min: 1, location: "Store Room B", vesselId: "V001", deleted: false },
      { id: 4, partCode: "SP-ME-004", partName: "Main Bearing", componentId: "6.1.2", componentCode: "6.1.2", componentName: "Main Bearings", componentSpareCode: "SP-6.1.2-001", critical: "Critical", rob: 4, min: 2, location: "Store Room C", vesselId: "V001", deleted: false },
      { id: 5, partCode: "SP-COOL-001", partName: "Cooling Pump Seal", componentId: "7.3", componentCode: "7.3", componentName: "Cooling Water System", componentSpareCode: "SP-7.3-001", critical: "Critical", rob: 4, min: 2, location: "Store Room D", vesselId: "V001", deleted: false },
      { id: 6, partCode: "SP-CC-001", partName: "Cylinder Cover Assembly", componentId: "6.1.1.1", componentCode: "6.1.1.1", componentName: "Valve Seats", componentSpareCode: "SP-6.1.1.1-001", critical: "Critical", rob: 2, min: 1, location: "Store Room A", vesselId: "V001", deleted: false },
      { id: 7, partCode: "SP-CC-002", partName: "Inlet Valve", componentId: "6.1.1.1", componentCode: "6.1.1.1", componentName: "Valve Seats", componentSpareCode: "SP-6.1.1.1-002", critical: "Critical", rob: 4, min: 2, location: "Store Room A", vesselId: "V001", deleted: false },
      { id: 8, partCode: "SP-CC-003", partName: "Exhaust Valve", componentId: "6.1.1.1", componentCode: "6.1.1.1", componentName: "Valve Seats", componentSpareCode: "SP-6.1.1.1-003", critical: "Critical", rob: 4, min: 2, location: "Store Room A", vesselId: "V001", deleted: false },
      { id: 9, partCode: "SP-CC-004", partName: "Valve Spring", componentId: "6.1.1.2", componentCode: "6.1.1.2", componentName: "Injector Sleeve", componentSpareCode: "SP-6.1.1.2-001", critical: "No", rob: 8, min: 4, location: "Store Room B", vesselId: "V001", deleted: false },
      { id: 10, partCode: "SP-CC-005", partName: "Valve Guide", componentId: "6.1.1.3", componentCode: "6.1.1.3", componentName: "Rocker Arm", componentSpareCode: "SP-6.1.1.3-001", critical: "No", rob: 1, min: 2, location: "Store Room B", vesselId: "V001", deleted: false },
    ];
    
    sampleSpares.forEach(spare => this.spares.set(spare.id, spare));
    this.currentSpareId = 11;
  }

  // Spares methods
  async getSpares(vesselId: string): Promise<Spare[]> {
    return Array.from(this.spares.values())
      .filter(s => s.vesselId === vesselId && !s.deleted);
  }

  async getSpare(id: number): Promise<Spare | undefined> {
    const spare = this.spares.get(id);
    return spare && !spare.deleted ? spare : undefined;
  }

  async createSpare(spare: InsertSpare): Promise<Spare> {
    const id = this.currentSpareId++;
    
    // Generate component spare code if not provided
    const componentSpareCode = spare.componentSpareCode || 
      (spare.componentCode ? this.generateComponentSpareCode(spare.vesselId, spare.componentCode) : null);
    
    const newSpare: Spare = { 
      ...spare, 
      id, 
      componentSpareCode,
      deleted: false 
    };
    this.spares.set(id, newSpare);
    
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
      componentSpareCode: componentSpareCode,
      eventType: 'LINK_CREATED',
      qtyChange: spare.rob,
      robAfter: spare.rob,
      userId: 'system',
      remarks: 'Initial creation',
      reference: null
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
        reference: null
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

  async consumeSpare(id: number, quantity: number, userId: string, remarks?: string, reference?: string): Promise<Spare> {
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
      reference: reference || null
    });
    
    return spare;
  }

  async receiveSpare(id: number, quantity: number, userId: string, remarks?: string, reference?: string): Promise<Spare> {
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
      reference: reference || null
    });
    
    return spare;
  }

  async bulkUpdateSpares(updates: Array<{id: number, consumed?: number, received?: number}>, userId: string, remarks?: string): Promise<Spare[]> {
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
          reference: null
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
}

// Use in-memory storage for Technical Module
const storage: IStorage = new MemStorage();
console.log("ℹ️  Technical Module using in-memory storage for development");

export { storage };
