
import { 
  users, 
  type User, 
  type InsertUser,
  components,
  type Component,
  type InsertComponent,
  runningHoursAudit,
  type RunningHoursAudit,
  type InsertRunningHoursAudit
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
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private currentUserId: number;
  private components: Map<string, Component>;
  private runningHoursAudits: RunningHoursAudit[];
  private currentAuditId: number;

  constructor() {
    this.users = new Map();
    this.currentUserId = 1;
    this.components = new Map();
    this.runningHoursAudits = [];
    this.currentAuditId = 1;
    
    // Initialize sample components
    this.initializeComponents();
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
}

// Use in-memory storage for Technical Module
const storage: IStorage = new MemStorage();
console.log("ℹ️  Technical Module using in-memory storage for development");

export { storage };
