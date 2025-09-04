import { __assign, __awaiter, __generator } from 'tslib';
import jwt from 'jsonwebtoken';
import { AuthenticationError, AuthorizationError } from '../utils/errors';
import { Permission, UserRole } from '../../shared/types/auth';
import { logger } from './logger';
var JWT_SECRET = process.env.JWT_SECRET || 'maritime-pms-dev-secret-key';
var JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '24h';
// Mock user data for development
var mockUsers = new Map([
  [
    'admin',
    {
      id: 'user-admin',
      username: 'admin',
      role: UserRole.ADMIN,
      permissions: Object.values(Permission),
      vesselId: 'MV Test Vessel',
    },
  ],
  [
    'master',
    {
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
        Permission.CHANGE_REQUESTS_APPROVE,
      ],
      vesselId: 'MV Test Vessel',
    },
  ],
  [
    'officer',
    {
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
        Permission.CHANGE_REQUESTS_WRITE,
      ],
      vesselId: 'MV Test Vessel',
    },
  ],
]);
export var generateToken = function (payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
};
export var verifyToken = function (token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    throw new AuthenticationError('Invalid or expired token');
  }
};
// Mock authentication function
export var authenticateUser = function (username, password) {
  return __awaiter(void 0, void 0, void 0, function () {
    var user, token;
    return __generator(this, function (_a) {
      // In production, this would verify against database
      if (!mockUsers.has(username)) {
        throw new AuthenticationError('Invalid credentials');
      }
      // Mock password check (in production, use proper password hashing)
      if (password !== 'password123') {
        throw new AuthenticationError('Invalid credentials');
      }
      user = mockUsers.get(username);
      token = generateToken({
        userId: user.id,
        username: user.username,
        role: user.role,
        permissions: user.permissions,
        vesselId: user.vesselId,
      });
      return [
        2 /*return*/,
        {
          user: __assign(__assign({}, user), {
            token: token,
            refreshToken: generateToken({
              userId: user.id,
              username: user.username,
              role: user.role,
              permissions: [],
              vesselId: user.vesselId,
            }),
          }),
          token: token,
        },
      ];
    });
  });
};
// Authentication middleware
export var requireAuth = function (req, res, next) {
  try {
    var authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new AuthenticationError('No valid authorization header found');
    }
    var token = authHeader.substring(7);
    var payload = verifyToken(token);
    req.user = payload;
    logger.info('User authenticated', {
      userId: payload.userId,
      username: payload.username,
      role: payload.role,
    });
    next();
  } catch (error) {
    next(error);
  }
};
// Authorization middleware factory
export var requirePermission = function () {
  var requiredPermissions = [];
  for (var _i = 0; _i < arguments.length; _i++) {
    requiredPermissions[_i] = arguments[_i];
  }
  return function (req, res, next) {
    if (!req.user) {
      return next(new AuthenticationError('User not authenticated'));
    }
    var hasPermission = requiredPermissions.every(function (permission) {
      return req.user.permissions.includes(permission);
    });
    if (!hasPermission) {
      return next(new AuthorizationError('Insufficient permissions'));
    }
    next();
  };
};
// Role-based authorization
export var requireRole = function () {
  var allowedRoles = [];
  for (var _i = 0; _i < arguments.length; _i++) {
    allowedRoles[_i] = arguments[_i];
  }
  return function (req, res, next) {
    if (!req.user) {
      return next(new AuthenticationError('User not authenticated'));
    }
    if (!allowedRoles.includes(req.user.role)) {
      return next(
        new AuthorizationError('Role '.concat(req.user.role, ' not authorized'))
      );
    }
    next();
  };
};
// Optional authentication (doesn't fail if no token)
export var optionalAuth = function (req, res, next) {
  try {
    var authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      var token = authHeader.substring(7);
      req.user = verifyToken(token);
    }
    next();
  } catch (error) {
    // Ignore authentication errors for optional auth
    next();
  }
};
//# sourceMappingURL=auth.js.map
