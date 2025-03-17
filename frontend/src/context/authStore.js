import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { authApi } from '../utils/apiClient';
import toast from 'react-hot-toast';

// Create a mock user for development
const mockUser = {
    _id: 'user123',
    firstName: 'Test',
    lastName: 'User',
    email: 'test@example.com',
    role: 'admin',
    addresses: [
        {
            street: '123 Main St',
            city: 'New York',
            state: 'NY',
            zipCode: '10001',
            country: 'USA',
            isDefault: true
        },
        {
            street: '456 Oak Ave',
            city: 'San Francisco',
            state: 'CA',
            zipCode: '94103',
            country: 'USA',
            isDefault: false
        }
    ],
    phoneNumber: '555-123-4567',
    wishlist: [
        {
            _id: 'prod1',
            name: 'Organic Cotton T-Shirt',
            price: 39.99,
            imageUrl: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
        },
        {
            _id: 'prod2',
            name: 'Recycled Denim Jeans',
            price: 89.99,
            imageUrl: 'https://images.unsplash.com/photo-1542272604-787c3835535d?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
        }
    ]
};

// Mock token
const mockToken = 'mock-jwt-token';

export const useAuthStore = create(
    persist(
        (set, get) => ({
            // For development/testing, initialize with mockUser
            user: process.env.NODE_ENV === 'development' ? mockUser : null,
            token: process.env.NODE_ENV === 'development' ? mockToken : null,
            loading: false,
            error: null,

            login: async (email, password) => {
                try {
                    set({ loading: true, error: null });

                    // For development/testing, use mock data
                    if (process.env.NODE_ENV === 'development' && email === 'admin@example.com') {
                        setTimeout(() => {
                            set({ user: mockUser, token: mockToken, loading: false });
                            toast.success('Login successful');
                        }, 800);
                        return true;
                    }

                    // Real API call for production
                    const response = await authApi.login({ email, password });
                    const { token, user } = response.data;

                    // Set token in localStorage
                    localStorage.setItem('token', token);

                    set({ user, token, loading: false });
                    toast.success('Login successful');
                    return true;
                } catch (error) {
                    set({
                        loading: false,
                        error: error.response?.data?.message || 'Login failed'
                    });
                    toast.error(error.response?.data?.message || 'Login failed');
                    return false;
                }
            },

            register: async (userData) => {
                try {
                    set({ loading: true, error: null });
                    const response = await authApi.register(userData);
                    const { token, user } = response.data;

                    // Set token in localStorage
                    localStorage.setItem('token', token);

                    set({ user, token, loading: false });
                    toast.success('Registration successful');
                    return true;
                } catch (error) {
                    set({
                        loading: false,
                        error: error.response?.data?.message || 'Registration failed'
                    });
                    toast.error(error.response?.data?.message || 'Registration failed');
                    return false;
                }
            },

            logout: () => {
                localStorage.removeItem('token');
                set({ user: null, token: null });
                toast.success('Logged out successfully');
            },

            updateProfile: async (userData) => {
                try {
                    set({ loading: true, error: null });
                    const response = await authApi.updateProfile(userData);
                    set({ user: response.data, loading: false });
                    toast.success('Profile updated successfully');
                    return true;
                } catch (error) {
                    set({
                        loading: false,
                        error: error.response?.data?.message || 'Profile update failed'
                    });
                    toast.error(error.response?.data?.message || 'Profile update failed');
                    return false;
                }
            },

            checkAuth: async () => {
                try {
                    set({ loading: true });

                    // For development/testing, use mock data
                    if (process.env.NODE_ENV === 'development') {
                        setTimeout(() => {
                            set({
                                user: mockUser,
                                token: mockToken,
                                loading: false
                            });
                        }, 300);
                        return true;
                    }

                    // Real API call for production
                    const token = localStorage.getItem('token');
                    if (!token) {
                        set({ user: null, token: null, loading: false });
                        return false;
                    }

                    const response = await authApi.getProfile();
                    set({ user: response.data, token, loading: false });
                    return true;
                } catch (error) {
                    localStorage.removeItem('token');
                    set({ user: null, token: null, loading: false });
                    return false;
                }
            },

            resetPassword: async (email) => {
                try {
                    set({ loading: true, error: null });
                    await authApi.resetPassword({ email });
                    set({ loading: false });
                    toast.success('Password reset instructions sent to your email');
                    return true;
                } catch (error) {
                    set({
                        loading: false,
                        error: error.response?.data?.message || 'Password reset failed'
                    });
                    toast.error(error.response?.data?.message || 'Password reset failed');
                    return false;
                }
            }
        }),
        {
            name: 'auth-storage',
            partialize: (state) => ({ user: state.user, token: state.token })
        }
    )
); 