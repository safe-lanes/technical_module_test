/**
 * Centralized API Configuration
 * 
 * This file manages all API endpoint configurations for the Technical Module.
 * Update API_BASE_URL to change all endpoints at once.
 */

// Environment-based API configuration
const getApiBaseUrl = (): string => {
  // Check if running behind nginx proxy
  if (window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
    // Production/dev server - use nginx proxy endpoint
    return '/technical-api';
  }
  
  // Local development - direct connection
  return '/api';
};

export const API_BASE_URL = getApiBaseUrl();

/**
 * Centralized API Endpoints
 * All endpoints are automatically prefixed with API_BASE_URL
 */
export const API_ENDPOINTS = {
  // Authentication
  AUTH: {
    LOGIN: `${API_BASE_URL}/auth/login`,
    LOGOUT: `${API_BASE_URL}/auth/logout`,
    PROFILE: `${API_BASE_URL}/auth/profile`,
  },

  // Technical Module APIs
  STORES: `${API_BASE_URL}/stores`,
  SPARES: `${API_BASE_URL}/spares`,
  WORK_ORDERS: `${API_BASE_URL}/work-orders`,
  RUNNING_HOURS: `${API_BASE_URL}/running-hours`,
  CHANGE_REQUESTS: `${API_BASE_URL}/modify-pms/requests`,
  COMPONENTS: `${API_BASE_URL}/components`,
  
  // Bulk Operations
  BULK: {
    TEMPLATE: `${API_BASE_URL}/bulk/template`,
    DRY_RUN: `${API_BASE_URL}/bulk/dry-run`,
    IMPORT: `${API_BASE_URL}/bulk/import`,
    HISTORY: `${API_BASE_URL}/bulk/history`,
  },

  // Admin & Configuration
  ALERTS: {
    POLICIES: `${API_BASE_URL}/alerts/policies`,
    CONFIG: `${API_BASE_URL}/alerts/config`,
    EVENTS: `${API_BASE_URL}/alerts/events`,
    TEST: `${API_BASE_URL}/alerts/test`,
  },
} as const;

/**
 * Helper function to build dynamic endpoints
 * @param endpoint - Base endpoint template
 * @param params - Parameters to substitute
 */
export const buildEndpoint = (endpoint: string, params: Record<string, string | number>): string => {
  let url = endpoint;
  Object.entries(params).forEach(([key, value]) => {
    url = url.replace(`:${key}`, String(value));
  });
  return url;
};

/**
 * Common endpoint builders for dynamic routes
 */
export const DYNAMIC_ENDPOINTS = {
  // Stores
  getStores: (vesselId: string) => `${API_ENDPOINTS.STORES}/${vesselId}`,
  createStoreTransaction: (vesselId: string) => `${API_ENDPOINTS.STORES}/${vesselId}/transaction`,
  
  // Spares
  getSpare: (id: number) => `${API_ENDPOINTS.SPARES}/item/${id}`,
  consumeSpare: (id: number) => `${API_ENDPOINTS.SPARES}/${id}/consume`,
  receiveSpare: (id: number) => `${API_ENDPOINTS.SPARES}/${id}/receive`,
  spareHistory: (id: number) => `${API_ENDPOINTS.SPARES}/history/spare/${id}`,
  
  // Work Orders
  getWorkOrders: (vesselId: string) => `${API_ENDPOINTS.WORK_ORDERS}/${vesselId}`,
  createWorkOrder: (vesselId: string) => `${API_ENDPOINTS.WORK_ORDERS}/${vesselId}`,
  updateWorkOrder: (vesselId: string, workOrderId: string) => `${API_ENDPOINTS.WORK_ORDERS}/${vesselId}/${workOrderId}`,
  
  // Running Hours
  getComponents: (vesselId: string) => `${API_ENDPOINTS.RUNNING_HOURS}/components/${vesselId}`,
  updateRunningHours: (componentId: string) => `${API_ENDPOINTS.RUNNING_HOURS}/update/${componentId}`,
  getAudits: (componentId: string) => `${API_ENDPOINTS.RUNNING_HOURS}/audits/${componentId}`,
  
  // Change Requests
  getChangeRequest: (id: number) => `${API_ENDPOINTS.CHANGE_REQUESTS}/${id}`,
  getChangeRequestComments: (id: number) => `${API_ENDPOINTS.CHANGE_REQUESTS}/${id}/comments`,
  getChangeRequestAttachments: (id: number) => `${API_ENDPOINTS.CHANGE_REQUESTS}/${id}/attachments`,
  
  // Components
  getComponentsByVessel: (vesselId: string) => `${API_ENDPOINTS.COMPONENTS}/${vesselId}`,
  
  // Alerts
  getAlertConfig: (vesselId: string) => `${API_ENDPOINTS.ALERTS.CONFIG}/${vesselId}`,
};

// Export the current configuration for debugging
export const API_CONFIG = {
  BASE_URL: API_BASE_URL,
  IS_NGINX_PROXY: !window.location.hostname.includes('localhost'),
  CURRENT_HOST: window.location.hostname,
} as const;

console.log('🔧 API Configuration:', API_CONFIG);