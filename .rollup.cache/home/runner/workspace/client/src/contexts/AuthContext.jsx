import { __awaiter, __generator } from 'tslib';
import { createContext, useContext, useState, useEffect } from 'react';
var AuthContext = createContext(undefined);
export var AuthProvider = function (_a) {
  var children = _a.children;
  var _b = useState(null),
    user = _b[0],
    setUser = _b[1];
  var _c = useState(true),
    isLoading = _c[0],
    setIsLoading = _c[1];
  useEffect(function () {
    // Check for stored token on app startup
    var storedToken = localStorage.getItem('auth_token');
    var storedUser = localStorage.getItem('auth_user');
    if (storedToken && storedUser) {
      try {
        var parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
      } catch (error) {
        console.error('Failed to parse stored user:', error);
        localStorage.removeItem('auth_token');
        localStorage.removeItem('auth_user');
      }
    }
    setIsLoading(false);
  }, []);
  var login = function (credentials) {
    return __awaiter(void 0, void 0, void 0, function () {
      var response, error, authenticatedUser;
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            setIsLoading(true);
            _a.label = 1;
          case 1:
            _a.trys.push([1, , 6, 7]);
            return [
              4 /*yield*/,
              fetch('/api/auth/login', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify(credentials),
              }),
            ];
          case 2:
            response = _a.sent();
            if (!!response.ok) return [3 /*break*/, 4];
            return [4 /*yield*/, response.json()];
          case 3:
            error = _a.sent();
            throw new Error(error.message || 'Login failed');
          case 4:
            return [4 /*yield*/, response.json()];
          case 5:
            authenticatedUser = _a.sent().user;
            setUser(authenticatedUser);
            // Store token and user data
            localStorage.setItem('auth_token', authenticatedUser.token);
            localStorage.setItem(
              'auth_user',
              JSON.stringify(authenticatedUser)
            );
            return [3 /*break*/, 7];
          case 6:
            setIsLoading(false);
            return [7 /*endfinally*/];
          case 7:
            return [2 /*return*/];
        }
      });
    });
  };
  var logout = function () {
    setUser(null);
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');
  };
  var hasPermission = function (permission) {
    var _a;
    return (_a =
      user === null || user === void 0
        ? void 0
        : user.permissions.includes(permission)) !== null && _a !== void 0
      ? _a
      : false;
  };
  var hasRole = function (role) {
    return (user === null || user === void 0 ? void 0 : user.role) === role;
  };
  var hasAnyPermission = function (permissions) {
    return permissions.some(function (permission) {
      return hasPermission(permission);
    });
  };
  var contextValue = {
    user: user,
    isAuthenticated: !!user,
    isLoading: isLoading,
    login: login,
    logout: logout,
    hasPermission: hasPermission,
    hasRole: hasRole,
    hasAnyPermission: hasAnyPermission,
    token: (user === null || user === void 0 ? void 0 : user.token) || null,
  };
  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};
export var useAuth = function () {
  var context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
// Higher-order component for route protection
export var withAuth = function (
  WrappedComponent,
  requiredPermissions,
  requiredRoles
) {
  return function AuthenticatedComponent(props) {
    var _a = useAuth(),
      isAuthenticated = _a.isAuthenticated,
      hasAnyPermission = _a.hasAnyPermission,
      hasRole = _a.hasRole,
      isLoading = _a.isLoading,
      user = _a.user;
    if (isLoading) {
      return (
        <div className='flex items-center justify-center min-h-screen'>
          <div className='text-lg'>Loading...</div>
        </div>
      );
    }
    if (!isAuthenticated) {
      return (
        <div className='flex items-center justify-center min-h-screen'>
          <div className='text-lg text-red-600'>
            Please log in to access this page.
          </div>
        </div>
      );
    }
    if (requiredPermissions && !hasAnyPermission(requiredPermissions)) {
      return (
        <div className='flex items-center justify-center min-h-screen'>
          <div className='text-lg text-red-600'>
            You don't have permission to access this page.
          </div>
        </div>
      );
    }
    if (
      requiredRoles &&
      !requiredRoles.some(function (role) {
        return hasRole(role);
      })
    ) {
      return (
        <div className='flex items-center justify-center min-h-screen'>
          <div className='text-lg text-red-600'>
            Your role doesn't have access to this page.
          </div>
        </div>
      );
    }
    return <WrappedComponent {...props} />;
  };
};
//# sourceMappingURL=AuthContext.jsx.map
