export interface User {
  id: string;
  username: string;
  email?: string;
  role: UserRole;
  permissions: Permission[];
  vesselId?: string;
  lastLoginAt?: Date;
  createdAt: Date;
}

export interface AuthenticatedUser extends User {
  token: string;
  refreshToken: string;
}

export enum UserRole {
  ADMIN = 'admin',
  MASTER = 'master',
  CHIEF_ENGINEER = 'chief_engineer',
  OFFICER = 'officer',
  CREW = 'crew',
  SHORE_STAFF = 'shore_staff',
}

export enum Permission {
  // Component permissions
  COMPONENTS_READ = 'components:read',
  COMPONENTS_WRITE = 'components:write',
  COMPONENTS_DELETE = 'components:delete',

  // Work Order permissions
  WORK_ORDERS_READ = 'work_orders:read',
  WORK_ORDERS_WRITE = 'work_orders:write',
  WORK_ORDERS_APPROVE = 'work_orders:approve',

  // Spares permissions
  SPARES_READ = 'spares:read',
  SPARES_WRITE = 'spares:write',
  SPARES_CONSUME = 'spares:consume',

  // Running Hours permissions
  RUNNING_HOURS_READ = 'running_hours:read',
  RUNNING_HOURS_WRITE = 'running_hours:write',

  // Reports permissions
  REPORTS_READ = 'reports:read',
  REPORTS_GENERATE = 'reports:generate',

  // Admin permissions
  PMS_ADMIN = 'pms:admin',
  USER_MANAGEMENT = 'user:management',
  SYSTEM_CONFIG = 'system:config',

  // Change Request permissions
  CHANGE_REQUESTS_READ = 'change_requests:read',
  CHANGE_REQUESTS_WRITE = 'change_requests:write',
  CHANGE_REQUESTS_APPROVE = 'change_requests:approve',
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  user?: AuthenticatedUser;
  message?: string;
}

export interface JWTPayload {
  userId: string;
  username: string;
  role: UserRole;
  vesselId?: string;
  permissions: Permission[];
  iat: number;
  exp: number;
}

export interface RefreshTokenPayload {
  userId: string;
  tokenVersion: number;
  iat: number;
  exp: number;
}
