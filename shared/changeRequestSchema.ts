import { z } from "zod";
import { createInsertSchema } from "drizzle-zod";

// Change Request interface and schema
export interface ChangeRequest {
  id: number;
  category: "components" | "work-orders" | "spares" | "stores";
  requestTitle: string;
  requestedBy: string;
  requestDate: string;
  status: "Pending Approval" | "Approved" | "Rejected";
  originalData: Record<string, any>;
  newData: Record<string, any>;
  changedFields: string[];
  comments?: string;
  approvedBy?: string;
  approvedDate?: string;
  rejectionReason?: string;
}

// User roles for permission system
export type UserRole = "requestor" | "approver";

export interface User {
  id: string;
  name: string;
  role: UserRole;
  title?: string;
}

// Change log for audit trail
export interface ChangeLog {
  id: number;
  changeRequestId: number;
  action: "created" | "approved" | "rejected";
  performedBy: string;
  performedDate: string;
  oldValues: Record<string, any>;
  newValues: Record<string, any>;
  comments?: string;
}

// Form mode context
export interface FormModeContext {
  isChangeRequestMode: boolean;
  originalData?: Record<string, any>;
  changedFields: Record<string, any>;
  onFieldChange?: (fieldName: string, value: any) => void;
}