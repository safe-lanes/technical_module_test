import { __extends } from 'tslib';
var AppError = /** @class */ (function (_super) {
  __extends(AppError, _super);
  function AppError(message, statusCode, isOperational, code) {
    if (statusCode === void 0) {
      statusCode = 500;
    }
    if (isOperational === void 0) {
      isOperational = true;
    }
    var _this = _super.call(this, message) || this;
    _this.name = _this.constructor.name;
    _this.statusCode = statusCode;
    _this.isOperational = isOperational;
    _this.code = code;
    Error.captureStackTrace(_this, _this.constructor);
    return _this;
  }
  return AppError;
})(Error);
export { AppError };
var ValidationError = /** @class */ (function (_super) {
  __extends(ValidationError, _super);
  function ValidationError(message, field) {
    var _this =
      _super.call(this, message, 400, true, 'VALIDATION_ERROR') || this;
    _this.name = 'ValidationError';
    return _this;
  }
  return ValidationError;
})(AppError);
export { ValidationError };
var NotFoundError = /** @class */ (function (_super) {
  __extends(NotFoundError, _super);
  function NotFoundError(resource) {
    if (resource === void 0) {
      resource = 'Resource';
    }
    var _this =
      _super.call(
        this,
        ''.concat(resource, ' not found'),
        404,
        true,
        'NOT_FOUND'
      ) || this;
    _this.name = 'NotFoundError';
    return _this;
  }
  return NotFoundError;
})(AppError);
export { NotFoundError };
var DatabaseError = /** @class */ (function (_super) {
  __extends(DatabaseError, _super);
  function DatabaseError(message) {
    if (message === void 0) {
      message = 'Database operation failed';
    }
    var _this = _super.call(this, message, 500, true, 'DATABASE_ERROR') || this;
    _this.name = 'DatabaseError';
    return _this;
  }
  return DatabaseError;
})(AppError);
export { DatabaseError };
var AuthenticationError = /** @class */ (function (_super) {
  __extends(AuthenticationError, _super);
  function AuthenticationError(message) {
    if (message === void 0) {
      message = 'Authentication failed';
    }
    var _this =
      _super.call(this, message, 401, true, 'AUTHENTICATION_ERROR') || this;
    _this.name = 'AuthenticationError';
    return _this;
  }
  return AuthenticationError;
})(AppError);
export { AuthenticationError };
var AuthorizationError = /** @class */ (function (_super) {
  __extends(AuthorizationError, _super);
  function AuthorizationError(message) {
    if (message === void 0) {
      message = 'Access denied';
    }
    var _this =
      _super.call(this, message, 403, true, 'AUTHORIZATION_ERROR') || this;
    _this.name = 'AuthorizationError';
    return _this;
  }
  return AuthorizationError;
})(AppError);
export { AuthorizationError };
var ConflictError = /** @class */ (function (_super) {
  __extends(ConflictError, _super);
  function ConflictError(message) {
    if (message === void 0) {
      message = 'Resource conflict';
    }
    var _this = _super.call(this, message, 409, true, 'CONFLICT_ERROR') || this;
    _this.name = 'ConflictError';
    return _this;
  }
  return ConflictError;
})(AppError);
export { ConflictError };
var RateLimitError = /** @class */ (function (_super) {
  __extends(RateLimitError, _super);
  function RateLimitError(message) {
    if (message === void 0) {
      message = 'Too many requests';
    }
    var _this =
      _super.call(this, message, 429, true, 'RATE_LIMIT_ERROR') || this;
    _this.name = 'RateLimitError';
    return _this;
  }
  return RateLimitError;
})(AppError);
export { RateLimitError };
//# sourceMappingURL=errors.js.map
