
import React, { createContext, useContext, useEffect, useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { TooltipProvider } from '@/components/ui/tooltip';

interface MicroFrontendConfig {
  apiBaseUrl?: string;
  authToken?: string;
  onAuthRequired?: () => void;
  standalone?: boolean;
}

interface MicroFrontendContextType {
  config: MicroFrontendConfig;
  updateConfig: (newConfig: Partial<MicroFrontendConfig>) => void;
}

const MicroFrontendContext = createContext<MicroFrontendContextType | null>(null);

export const useMicroFrontendConfig = () => {
  const context = useContext(MicroFrontendContext);
  if (!context) {
    throw new Error('useMicroFrontendConfig must be used within MicroFrontendWrapper');
  }
  return context;
};

interface MicroFrontendWrapperProps {
  children: React.ReactNode;
  config?: MicroFrontendConfig;
}

export const MicroFrontendWrapper: React.FC<MicroFrontendWrapperProps> = ({ 
  children, 
  config: initialConfig = {} 
}) => {
  const [config, setConfig] = useState<MicroFrontendConfig>({
    standalone: true,
    apiBaseUrl: '/api',
    ...initialConfig
  });

  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        refetchOnWindowFocus: false,
      },
      mutations: {
        retry: false,
      },
    },
  }));

  const updateConfig = (newConfig: Partial<MicroFrontendConfig>) => {
    setConfig(prev => ({ ...prev, ...newConfig }));
  };

  // Set up global fetch interceptor for authentication
  useEffect(() => {
    if (!config.standalone && config.authToken) {
      const originalFetch = window.fetch;
      window.fetch = async (input, init) => {
        const headers = new Headers(init?.headers);
        headers.set('Authorization', `Bearer ${config.authToken}`);
        
        return originalFetch(input, {
          ...init,
          headers
        });
      };

      return () => {
        window.fetch = originalFetch;
      };
    }
  }, [config.authToken, config.standalone]);

  // Handle API base URL for micro frontend mode
  useEffect(() => {
    if (!config.standalone && config.apiBaseUrl) {
      // Update query client defaults to use the correct base URL
      queryClient.setDefaultOptions({
        queries: {
          ...queryClient.getDefaultOptions().queries,
          queryFn: async ({ queryKey }) => {
            const url = `${config.apiBaseUrl}${queryKey[0]}`;
            const response = await fetch(url);
            if (!response.ok) {
              if (response.status === 401 && config.onAuthRequired) {
                config.onAuthRequired();
              }
              throw new Error('Network response was not ok');
            }
            return response.json();
          }
        }
      });
    }
  }, [config.apiBaseUrl, config.standalone, config.onAuthRequired, queryClient]);

  return (
    <MicroFrontendContext.Provider value={{ config, updateConfig }}>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <div 
            className={`micro-frontend-app ${!config.standalone ? 'micro-frontend-isolated' : ''}`}
            data-micro-frontend="element-crew-appraisals"
          >
            {children}
          </div>
        </TooltipProvider>
      </QueryClientProvider>
    </MicroFrontendContext.Provider>
  );
};

// Export for micro frontend consumption
export default MicroFrontendWrapper;
