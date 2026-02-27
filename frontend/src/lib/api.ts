import { ApiResponse } from '@/types';
import { API_ROUTES } from '@reclamtrack/shared';
import axios, { AxiosError, AxiosInstance, AxiosResponse } from 'axios';

// ReclamTrack backend (complaints, teams, IT admin, billing…)
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:2060/api';
// Herbute backend (fleet, planning, staff, interventions…)
const HERBUTE_API_BASE_URL = process.env.NEXT_PUBLIC_HERBUTE_API_URL || 'http://localhost:2065/api';
console.log('[API] ReclamTrack URL:', API_BASE_URL);
console.log('[API] Herbute URL:', HERBUTE_API_BASE_URL);

class ApiClient {
    private client: AxiosInstance;

    constructor(baseURL: string) {
        this.client = axios.create({
            baseURL,
            timeout: 30000,
            headers: {
                'Content-Type': 'application/json',
            },
        });

        this.setupInterceptors();
    }

    private setupInterceptors() {
        // Request interceptor
        this.client.interceptors.request.use(
            (config) => {
                // Add auth token if available
                let token: string | null = null;
                if (typeof window !== 'undefined') {
                    token = localStorage.getItem('auth_token');
                }
                if (token) {
                    config.headers.Authorization = `Bearer ${token}`;
                }

                if (typeof window !== 'undefined') {
                    const orgId = localStorage.getItem('active_organization_id');
                    if (orgId) {
                        config.headers['x-organization-id'] = orgId;
                    }
                }

                return config;
            },
            (error) => {
                return Promise.reject(error);
            }
        );

        // Response interceptor
        this.client.interceptors.response.use(
            (response: AxiosResponse<ApiResponse>) => {
                return response;
            },
            (error: AxiosError<ApiResponse>) => {
                if (error.response) {
                    const status = error.response.status;
                    const data = error.response.data;
                    const code = data?.code || 'UNKNOWN_ERROR';
                    const message = data?.error || data?.message || 'An error occurred';

                    console.error(`[API] Error ${status} (${code}): ${message}`);

                    // Handle specific error codes
                    switch (status) {
                        case 401:
                            // Unauthorized - redirect to login
                            if (typeof window !== 'undefined' && !window.location.pathname.includes('/login')) {
                                localStorage.removeItem('auth_token');
                                // Detect current locale from URL to maintain i18n context
                                const pathLocale = window.location.pathname.split('/')[1];
                                const locale = ['fr', 'en'].includes(pathLocale) ? pathLocale : 'fr';
                                window.location.href = `/${locale}/login`;
                            }
                            break;
                        case 403:
                            // Forbidden
                            console.warn('Access forbidden: Insufficient permissions');
                            break;
                        case 404:
                            // Not found
                            console.warn('Resource not found');
                            break;
                        case 429:
                            // Rate limit
                            console.warn('Too many requests. Please try again later.');
                            break;
                        case 500:
                            // Server error
                            console.error('Server error:', message);
                            break;
                    }
                } else if (error.request) {
                    // Network error
                    console.error('Network error:', error.message);
                }
                return Promise.reject(error);
            }
        );
    }

    // Generic request methods
    async get<T = any>(url: string, params?: any): Promise<T> {
        const response = await this.client.get<ApiResponse<T>>(url, { params });
        // Handle both wrapped and unwrapped responses
        return (response.data?.data || response.data) as T;
    }

    async post<T = any>(url: string, data?: any): Promise<T> {
        const response = await this.client.post<ApiResponse<T>>(url, data);
        return (response.data?.data || response.data) as T;
    }

    async put<T = any>(url: string, data?: any): Promise<T> {
        const response = await this.client.put<ApiResponse<T>>(url, data);
        return (response.data?.data || response.data) as T;
    }

    async patch<T = any>(url: string, data?: any): Promise<T> {
        const response = await this.client.patch<ApiResponse<T>>(url, data);
        return (response.data?.data || response.data) as T;
    }

    async delete<T = any>(url: string): Promise<T> {
        const response = await this.client.delete<ApiResponse<T>>(url);
        return (response.data?.data || response.data) as T;
    }

    // File upload
    async upload<T = any>(url: string, formData: FormData): Promise<T> {
        const response = await this.client.post<ApiResponse<T>>(url, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return (response.data?.data || response.data) as T;
    }

    // Download file
    async download(url: string, filename: string): Promise<void> {
        const response = await this.client.get(url, {
            responseType: 'blob',
        });

        if (typeof window !== 'undefined') {
            const blob = new Blob([response.data]);
            const downloadUrl = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = downloadUrl;
            link.download = filename;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(downloadUrl);
        }
    }
}

// Export singleton instances
export const apiClient = new ApiClient(API_BASE_URL);           // ReclamTrack
export const herbuteApiClient = new ApiClient(HERBUTE_API_BASE_URL); // Herbute

// Export specific API endpoints
export const authApi = {
    login: (credentials: { email: string; password: string }) =>
        apiClient.post(API_ROUTES.auth.login, credentials),
    logout: () => apiClient.post(API_ROUTES.auth.logout),
    me: () => apiClient.get(API_ROUTES.auth.me),
    refreshToken: () => apiClient.post(API_ROUTES.auth.refresh),
    googleLogin: (credential: string) => apiClient.post('/auth/google', { credential }), // Not in shared yet, keep as is or add
};

export const complaintsApi = {
    getAll: (params?: any) => apiClient.get(API_ROUTES.complaints.root, params),
    getById: (id: string) => apiClient.get(API_ROUTES.complaints.byId(id)),
    create: (data: any) => apiClient.post(API_ROUTES.complaints.root, data),
    update: (id: string, data: any) => apiClient.put(API_ROUTES.complaints.byId(id), data),
    delete: (id: string) => apiClient.delete(API_ROUTES.complaints.byId(id)),
    uploadPhoto: (id: string, formData: FormData) =>
        apiClient.upload(`${API_ROUTES.complaints.root}/${id}/photos`, formData),
};

export const teamsApi = {
    getAll: (params?: any) => apiClient.get(API_ROUTES.teams.root, params),
    getById: (id: string) => apiClient.get(API_ROUTES.teams.byId(id)),
    create: (data: any) => apiClient.post(API_ROUTES.teams.root, data),
    update: (id: string, data: any) => apiClient.put(API_ROUTES.teams.byId(id), data),
    delete: (id: string) => apiClient.delete(API_ROUTES.teams.byId(id)),
};

export const interventionsApi = {
    getAll: (params?: any) => herbuteApiClient.get('/interventions', params),
    getById: (id: string) => herbuteApiClient.get(`/interventions/${id}`),
    create: (data: any) => herbuteApiClient.post('/interventions', data),
    update: (id: string, data: any) => herbuteApiClient.put(`/interventions/${id}`, data),
    delete: (id: string) => herbuteApiClient.delete(`/interventions/${id}`),
};

export const assignmentsApi = {
    getAll: (params?: any) => apiClient.get('/assignments', params),
    getById: (id: string) => apiClient.get(`/assignments/${id}`),
    create: (data: any) => apiClient.post('/assignments', data),
    update: (id: string, data: any) => apiClient.put(`/assignments/${id}`, data),
    delete: (id: string) => apiClient.delete(`/assignments/${id}`),
    assign: (data: any) => apiClient.post('/assignments/assign', data),
};

export const planningApi = {
    getAll: (params?: any) => herbuteApiClient.get('/planning', params),
    getById: (id: string) => herbuteApiClient.get(`/planning/${id}`),
    create: (data: any) => herbuteApiClient.post('/planning', data),
    update: (id: string, data: any) => herbuteApiClient.put(`/planning/${id}`, data),
    delete: (id: string) => herbuteApiClient.delete(`/planning/${id}`),
};

export const messagesApi = {
    getAll: (params?: any) => herbuteApiClient.get('/messages', params),
    getById: (id: string) => herbuteApiClient.get(`/messages/${id}`),
    send: (data: any) => herbuteApiClient.post('/messages', data),
    markRead: (id: string) => herbuteApiClient.put(`/messages/${id}/read`, {}),
    delete: (id: string) => herbuteApiClient.delete(`/messages/${id}`),
};

export const feedbackApi = {
    getAll: (params?: any) => herbuteApiClient.get('/feedback', params),
    create: (data: any) => herbuteApiClient.post('/feedback', data),
};

export const fleetApi = {
    getAll: (params?: any) => herbuteApiClient.get('/fleet/vehicles', params),
    getById: (id: string) => herbuteApiClient.get(`/fleet/vehicles/${id}`),
    create: (data: any) => herbuteApiClient.post('/fleet/vehicles', data),
    update: (id: string, data: any) => herbuteApiClient.put(`/fleet/vehicles/${id}/status`, data),
    delete: (id: string) => herbuteApiClient.delete(`/fleet/vehicles/${id}`),
};

export const knowledgeApi = {
    getAll: (params?: any) => herbuteApiClient.get('/knowledge', params),
    getById: (id: string) => herbuteApiClient.get(`/knowledge/${id}`),
    create: (data: any) => herbuteApiClient.post('/knowledge', data),
    update: (id: string, data: any) => herbuteApiClient.put(`/knowledge/${id}`, data),
    delete: (id: string) => herbuteApiClient.delete(`/knowledge/${id}`),
};

export const schedulerApi = {
    getAll: (params?: any) => herbuteApiClient.get('/scheduler', params),
    create: (data: any) => herbuteApiClient.post('/scheduler', data),
};

export const inventoryApi = {
    getAll: (params?: any) => apiClient.get(API_ROUTES.inventory.root, params),
    getById: (id: string) => apiClient.get(API_ROUTES.inventory.byId(id)),
    update: (id: string, data: any) => apiClient.put(API_ROUTES.inventory.byId(id), data),
    createRequest: (data: any) => apiClient.post('/inventory/requests', data),
    getRequests: (params?: any) => apiClient.get('/inventory/requests', params),
    approveRequest: (id: string) => apiClient.post(API_ROUTES.inventory.approve(id)),
    rejectRequest: (id: string, reason: string) =>
        apiClient.post(API_ROUTES.inventory.reject(id), { reason }),
};

export const analyticsApi = {
    getDashboard: (params?: any) => apiClient.get(API_ROUTES.analytics.dashboard, params),
    getComplaintStats: (params?: any) => apiClient.get('/analytics/complaints', params),
    getTeamStats: (params?: any) => apiClient.get('/analytics/teams', params),
    getPerformance: (params?: any) => apiClient.get('/analytics/performance', params),
    getSatisfaction: (params?: any) => apiClient.get('/analytics/satisfaction', params),
    getHeatmap: (params?: any) => apiClient.get('/analytics/heatmap', params),
    exportReport: (type: string, _params?: any) =>
        apiClient.download(`/analytics/export/${type}`, `report-${type}-${Date.now()}.pdf`),
};

export const adminApi = {
    getUsers: (params?: any) => apiClient.get('/admin/users', params),
    createUser: (data: any) => apiClient.post('/admin/users', data),
    updateUser: (id: string, data: any) => apiClient.put(`/admin/users/${id}`, data),
    deleteUser: (id: string) => apiClient.delete(`/admin/users/${id}`),
    getAuditLogs: (params?: any) => apiClient.get('/audit-logs', params),
    getSystemStatus: () => apiClient.get('/admin/system/status'),
    getSecurityMetrics: () => apiClient.get('/admin/security/metrics'),
    getSecurityAudit: () => apiClient.get('/admin/security/audit'),
};

export const staffApi = {
    getAll: () => herbuteApiClient.get('/staff'),
    create: (data: any) => herbuteApiClient.post('/staff', data),
};

export const rosterApi = {
    get: (params: { week: string }) => herbuteApiClient.get('/roster', params),
    update: (data: { week: string; shifts: any[] }) => herbuteApiClient.post('/roster/update', data),
};

export const leaveApi = {
    getAll: () => herbuteApiClient.get('/leave'),
    updateStatus: (id: string, status: string) => herbuteApiClient.patch(`/leave/${id}/status`, { status }),
};
export const organizationsApi = {
    getAll: () => apiClient.get('/organizations'),
    getById: (id: string) => apiClient.get(`/organizations/${id}`),
    create: (data: any) => apiClient.post('/organizations', data),
    update: (id: string, data: any) => apiClient.put(`/organizations/${id}`, data),
    getMyOrganizations: () => apiClient.get('/organizations/me/memberships'),
    getMembers: (id: string) => apiClient.get(`/organizations/${id}/members`),
    inviteMember: (id: string, email: string, roles: string[]) =>
        apiClient.post(`/organizations/${id}/members`, { email, role: roles[0] }),
    updateMemberRole: (id: string, membershipId: string, roles: string[]) =>
        apiClient.patch(`/organizations/${id}/members/${membershipId}`, { roles }),
    removeMember: (id: string, membershipId: string) =>
        apiClient.delete(`/organizations/${id}/members/${membershipId}`),
};

// Alias for compatibility
export const organizationApi = organizationsApi;

// Security API
export const securityApi = {
    getPasswordAudit: () => apiClient.get('/security/audit/passwords'),
    getRdpSessions: () => apiClient.get('/security/sessions/rdp'),
    getGpoList: () => apiClient.get('/security/gpo'),
    getCompliance: () => apiClient.get('/security/compliance'),
    runPowerShell: (scriptName: string) => apiClient.post('/security/powershell', { scriptName }),
    // pfSense
    connectPfsense: (data: any) => apiClient.post('/security/pfsense/connect', data),
    getPfsenseRules: () => apiClient.get('/security/pfsense/rules'),
    getPfsenseLogs: (limit = 50) => apiClient.get('/security/pfsense/logs', { limit }),
    getPfsenseSystem: () => apiClient.get('/security/pfsense/system'),
    getPfsenseTraffic: () => apiClient.get('/security/pfsense/traffic'),
    // Secret Vault
    getSecrets: () => apiClient.get('/security/secrets'),
    createSecret: (data: any) => apiClient.post('/security/secrets', data),
    revealSecret: (id: string) => apiClient.get(`/security/secrets/${id}/reveal`),
    deleteSecret: (id: string) => apiClient.delete(`/security/secrets/${id}`),
    getSecretStats: () => apiClient.get('/security/secrets/stats'),
};

// IT Assets API
export const itAssetsApi = {
    getAll: (params?: any) => apiClient.get('/it-assets', params),
    getById: (id: string) => apiClient.get(`/it-assets/${id}`),
    getStats: () => apiClient.get('/it-assets/stats'),
    create: (data: any) => apiClient.post('/it-assets', data),
    update: (id: string, data: any) => apiClient.put(`/it-assets/${id}`, data),
    delete: (id: string) => apiClient.delete(`/it-assets/${id}`),
    addMaintenance: (id: string, data: any) => apiClient.post(`/it-assets/${id}/maintenance`, data),
};

// IT Tickets (Helpdesk) API
export const itTicketsApi = {
    getAll: (params?: any) => apiClient.get('/it-tickets', params),
    getById: (id: string) => apiClient.get(`/it-tickets/${id}`),
    getStats: () => apiClient.get('/it-tickets/stats'),
    create: (data: any) => apiClient.post('/it-tickets', data),
    update: (id: string, data: any) => apiClient.put(`/it-tickets/${id}`, data),
    addUpdate: (id: string, data: any) => apiClient.post(`/it-tickets/${id}/updates`, data),
    assign: (id: string, data: any) => apiClient.post(`/it-tickets/${id}/assign`, data),
    resolve: (id: string, data: any) => apiClient.post(`/it-tickets/${id}/resolve`, data),
};

export default apiClient;
