import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';
import {
  AuthenticatedUser,
  LoginRequest,
  UserRole,
  Permission,
} from '../../../shared/types/auth';

interface AuthContextType {
  user: AuthenticatedUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginRequest) => Promise<void>;
  logout: () => void;
  hasPermission: (permission: Permission) => boolean;
  hasRole: (role: UserRole) => boolean;
  hasAnyPermission: (permissions: Permission[]) => boolean;
  token: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<AuthenticatedUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for stored token on app startup
    const storedToken = localStorage.getItem('auth_token');
    const storedUser = localStorage.getItem('auth_user');

    if (storedToken && storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser) as AuthenticatedUser;
        setUser(parsedUser);
      } catch (error) {
        console.error('Failed to parse stored user:', error);
        localStorage.removeItem('auth_token');
        localStorage.removeItem('auth_user');
      }
    }

    setIsLoading(false);
  }, []);

  const login = async (credentials: LoginRequest) => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Login failed');
      }

      const { user: authenticatedUser } = await response.json();
      setUser(authenticatedUser);

      // Store token and user data
      localStorage.setItem('auth_token', authenticatedUser.token);
      localStorage.setItem('auth_user', JSON.stringify(authenticatedUser));
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');
  };

  const hasPermission = (permission: Permission): boolean => {
    return user?.permissions.includes(permission) ?? false;
  };

  const hasRole = (role: UserRole): boolean => {
    return user?.role === role;
  };

  const hasAnyPermission = (permissions: Permission[]): boolean => {
    return permissions.some(permission => hasPermission(permission));
  };

  const contextValue: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
    hasPermission,
    hasRole,
    hasAnyPermission,
    token: user?.token || null,
  };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Higher-order component for route protection
export const withAuth = <P extends object>(
  WrappedComponent: React.ComponentType<P>,
  requiredPermissions?: Permission[],
  requiredRoles?: UserRole[]
) => {
  return function AuthenticatedComponent(props: P) {
    const { isAuthenticated, hasAnyPermission, hasRole, isLoading, user } =
      useAuth();

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

    if (requiredRoles && !requiredRoles.some(role => hasRole(role))) {
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
