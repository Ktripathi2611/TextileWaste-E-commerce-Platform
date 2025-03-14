import axios from 'axios';

// Determine if we're in production
const isProduction = process.env.NODE_ENV === 'production';

// Get the API URL from environment variables or use a default
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Create API client instance
const apiClient = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor
apiClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response interceptor
apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Handle unauthorized errors (e.g., token expired)
            localStorage.removeItem('token');
            // Redirect to login page if not already there
            if (!window.location.pathname.includes('/auth')) {
                window.location.href = '/auth';
            }
        }
        return Promise.reject(error);
    }
);

// Auth API
export const authApi = {
    login: (credentials) => apiClient.post('/auth/login', credentials),
    register: (userData) => apiClient.post('/auth/register', userData),
    getProfile: () => apiClient.get('/auth/profile'),
    updateProfile: (data) => apiClient.put('/auth/profile', data),
    addAddress: (data) => apiClient.post('/auth/address', data),
    updateAddress: (addressId, data) => apiClient.put(`/auth/address/${addressId}`, data),
    setDefaultAddress: (addressId) => apiClient.put(`/auth/address/${addressId}/default`),
    changePassword: (data) => apiClient.put('/auth/password', data),
    deleteAccount: () => apiClient.delete('/auth/profile'),
    updatePreferences: (preferences) => apiClient.put('/auth/preferences', preferences),
};

// Products API
export const productsApi = {
    getAll: (params) => apiClient.get('/products', { params }),
    getById: (id) => apiClient.get(`/products/${id}`),
    getFeatured: () => apiClient.get('/products/featured'),
    search: (query) => apiClient.get('/products/search', { params: { q: query } }),
};

// Orders API
export const ordersApi = {
    create: (orderData) => apiClient.post('/orders', orderData),
    getAll: () => apiClient.get('/orders'),
    getById: (id) => apiClient.get(`/orders/${id}`),
};

// Support Tickets API
export const supportTicketsApi = {
    create: (ticketData) => apiClient.post('/support/tickets', ticketData),
    getAll: () => apiClient.get('/support/tickets/my-tickets'),
    getById: (id) => apiClient.get(`/support/tickets/${id}`),
    update: (id, data) => apiClient.put(`/support/tickets/${id}`, data),
    addReply: (id, reply) => apiClient.post(`/support/tickets/${id}/messages`, reply),
    closeTicket: (id) => apiClient.put(`/support/tickets/${id}/status`, { status: 'closed' }),
    reopenTicket: (id) => apiClient.put(`/support/tickets/${id}/status`, { status: 'open' }),
};

export default apiClient; 