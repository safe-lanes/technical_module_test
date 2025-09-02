import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AuthenticationError, AuthorizationError } from '../utils/errors';
import { JWTPayload, Permission, UserRole } from '../../shared/types/auth';
import { logger } from './logger';

const JWT_SECRET = process.env.JWT_SECRET || 'maritime-pms-dev-secret-key';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '24h';

// Extend Express Request to include user
declare global {
  namespace Express {
    interface Request {
      user?: JWTPayload;
    }
  }
}

// Mock user data for development
const mockUsers = new Map([
  ['admin', {
    id: 'user-admin',
    username: 'admin',
    role: UserRole.ADMIN,
    permissions: Object.values(Permission),
    vesselId: 'MV Test Vessel'
  }],
  ['master', {
    id: 'user-master',
    username: 'master',
    role: UserRole.MASTER,
    permissions: [
      Permission.COMPONENTS_READ,
      Permission.COMPONENTS_WRITE,
      Permission.WORK_ORDERS_READ,
      Permission.WORK_ORDERS_WRITE,
      Permission.WORK_ORDERS_APPROVE,
      Permission.SPARES_READ,
      Permission.SPARES_WRITE,
      Permission.SPARES_CONSUME,
      Permission.RUNNING_HOURS_READ,
      Permission.RUNNING_HOURS_WRITE,
      Permission.REPORTS_READ,
      Permission.REPORTS_GENERATE,
      Permission.CHANGE_REQUESTS_READ,
      Permission.CHANGE_REQUESTS_WRITE,
      Permission.CHANGE_REQUESTS_APPROVE
    ],
    vesselId: 'MV Test Vessel'
  }],
  ['officer', {
    id: 'user-officer',
    username: 'officer',
    role: UserRole.OFFICER,
    permissions: [
      Permission.COMPONENTS_READ,
      Permission.WORK_ORDERS_READ,
      Permission.WORK_ORDERS_WRITE,
      Permission.SPARES_READ,
      Permission.SPARES_WRITE,
      Permission.RUNNING_HOURS_READ,
      Permission.RUNNING_HOURS_WRITE,
      Permission.REPORTS_READ,
      Permission.CHANGE_REQUESTS_READ,
      Permission.CHANGE_REQUESTS_WRITE
    ],
    vesselId: 'MV Test Vessel'
  }]
]);

export const generateToken = (payload: Omit<JWTPayload, 'iat' | 'exp'>): string => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
};

export const verifyToken = (token: string): JWTPayload => {
  try {
    return jwt.verify(token, JWT_SECRET) as JWTPayload;
  } catch (error) {
    throw new AuthenticationError('Invalid or expired token');
  }
};

// Mock authentication function
export const authenticateUser = async (username: string, password: string) => {
  // In production, this would verify against database
  if (!mockUsers.has(username)) {
    throw new AuthenticationError('Invalid credentials');
  }

  // Mock password check (in production, use proper password hashing)
  if (password !== 'password123') {
    throw new AuthenticationError('Invalid credentials');
  }

  const user = mockUsers.get(username)!;
  const token = generateToken({
    userId: user.id,
    username: user.username,
    role: user.role,
    permissions: user.permissions,
    vesselId: user.vesselId
  });

  return {
    user: {
      ...user,
      token,
      refreshToken: generateToken({ userId: user.id, username: user.username, role: user.role, permissions: [], vesselId: user.vesselId })
    },
    token
  };
};

// Authentication middleware
export const requireAuth = (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new AuthenticationError('No valid authorization header found');
    }

    const token = authHeader.substring(7);
    const payload = verifyToken(token);
    
    req.user = payload;
    
    logger.info('User authenticated', {
      userId: payload.userId,
      username: payload.username,
      role: payload.role
    });

    next();
  } catch (error) {
    next(error);
  }
};

// Authorization middleware factory
export const requirePermission = (...requiredPermissions: Permission[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new AuthenticationError('User not authenticated'));
    }

    const hasPermission = requiredPermissions.every(permission =>
      req.user!.permissions.includes(permission)
    );

    if (!hasPermission) {
      return next(new AuthorizationError('Insufficient permissions'));
    }

    next();
  };
};

// Role-based authorization
export const requireRole = (...allowedRoles: UserRole[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new AuthenticationError('User not authenticated'));
    }

    if (!allowedRoles.includes(req.user.role)) {
      return next(new AuthorizationError(`Role ${req.user.role} not authorized`));
    }

    next();
  };
};

// Optional authentication (doesn't fail if no token)
export const optionalAuth = (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      req.user = verifyToken(token);
    }
    next();
  } catch (error) {
    // Ignore authentication errors for optional auth
    next();
  }
};