import { __assign, __awaiter, __generator } from 'tslib';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { TooltipProvider } from '@/components/ui/tooltip';
var MicroFrontendContext = createContext(null);
export var useMicroFrontendConfig = function () {
  var context = useContext(MicroFrontendContext);
  if (!context) {
    throw new Error(
      'useMicroFrontendConfig must be used within MicroFrontendWrapper'
    );
  }
  return context;
};
export var MicroFrontendWrapper = function (_a) {
  var children = _a.children,
    _b = _a.config,
    initialConfig = _b === void 0 ? {} : _b;
  var _c = useState(
      __assign({ standalone: true, apiBaseUrl: '/api' }, initialConfig)
    ),
    config = _c[0],
    setConfig = _c[1];
  var queryClient = useState(function () {
    return new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
          refetchOnWindowFocus: false,
        },
        mutations: {
          retry: false,
        },
      },
    });
  })[0];
  var updateConfig = function (newConfig) {
    setConfig(function (prev) {
      return __assign(__assign({}, prev), newConfig);
    });
  };
  // Set up global fetch interceptor for authentication
  useEffect(
    function () {
      if (!config.standalone && config.authToken) {
        var originalFetch_1 = window.fetch;
        window.fetch = function (input, init) {
          return __awaiter(void 0, void 0, void 0, function () {
            var headers;
            return __generator(this, function (_a) {
              headers = new Headers(
                init === null || init === void 0 ? void 0 : init.headers
              );
              headers.set('Authorization', 'Bearer '.concat(config.authToken));
              return [
                2 /*return*/,
                originalFetch_1(
                  input,
                  __assign(__assign({}, init), { headers: headers })
                ),
              ];
            });
          });
        };
        return function () {
          window.fetch = originalFetch_1;
        };
      }
    },
    [config.authToken, config.standalone]
  );
  // Handle API base URL for micro frontend mode
  useEffect(
    function () {
      if (!config.standalone && config.apiBaseUrl) {
        // Update query client defaults to use the correct base URL
        queryClient.setDefaultOptions({
          queries: __assign(
            __assign({}, queryClient.getDefaultOptions().queries),
            {
              queryFn: function (_a) {
                return __awaiter(void 0, [_a], void 0, function (_b) {
                  var url, response;
                  var queryKey = _b.queryKey;
                  return __generator(this, function (_c) {
                    switch (_c.label) {
                      case 0:
                        url = ''.concat(config.apiBaseUrl).concat(queryKey[0]);
                        return [4 /*yield*/, fetch(url)];
                      case 1:
                        response = _c.sent();
                        if (!response.ok) {
                          if (
                            response.status === 401 &&
                            config.onAuthRequired
                          ) {
                            config.onAuthRequired();
                          }
                          throw new Error('Network response was not ok');
                        }
                        return [2 /*return*/, response.json()];
                    }
                  });
                });
              },
            }
          ),
        });
      }
    },
    [config.apiBaseUrl, config.standalone, config.onAuthRequired, queryClient]
  );
  return (
    <MicroFrontendContext.Provider
      value={{ config: config, updateConfig: updateConfig }}
    >
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <div
            className={'micro-frontend-app '.concat(
              !config.standalone ? 'micro-frontend-isolated' : ''
            )}
            data-micro-frontend='element-crew-appraisals'
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
//# sourceMappingURL=MicroFrontendWrapper.jsx.map
