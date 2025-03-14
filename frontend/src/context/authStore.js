import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { authApi } from '../utils/apiClient';
import toast from 'react-hot-toast';

export const useAuthStore = create(
    persist(
        (set, get) => ({
            user: null,
            token: null,
            loading: false,
            error: null,

            login: async (email, password) => {
                try {
                    set({ loading: true, error: null });
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