import { useState, useEffect, useCallback } from 'react';
import { productsApi } from '../utils/apiClient';

// Cache object to store API responses
const cache = {
    featured: null,
    list: {},
    lastFetch: {}
};

// Cache duration in milliseconds (5 minutes)
const CACHE_DURATION = 5 * 60 * 1000;

export const useProducts = (params = {}) => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchProducts = useCallback(async (fetchParams = params) => {
        const cacheKey = JSON.stringify(fetchParams);
        const now = Date.now();
        const lastFetch = cache.lastFetch[cacheKey] || 0;

        // Check if we have valid cached data
        if (cache.list[cacheKey] && (now - lastFetch) < CACHE_DURATION) {
            setData(cache.list[cacheKey]);
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            const response = await productsApi.getAll(fetchParams);
            cache.list[cacheKey] = response.data;
            cache.lastFetch[cacheKey] = now;
            setData(response.data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, [params]);

    const fetchFeatured = useCallback(async () => {
        const now = Date.now();
        const lastFetch = cache.lastFetch.featured || 0;

        // Check if we have valid cached data
        if (cache.featured && (now - lastFetch) < CACHE_DURATION) {
            setData(cache.featured);
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            const response = await productsApi.getFeatured();
            cache.featured = response.data;
            cache.lastFetch.featured = now;
            setData(response.data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        if (params.featured) {
            fetchFeatured();
        } else {
            fetchProducts();
        }
    }, [fetchProducts, fetchFeatured, params]);

    return { data, loading, error, refetch: fetchProducts };
}; 