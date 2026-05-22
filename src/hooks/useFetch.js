import { useState, useEffect, useCallback } from 'react';
import config from '../config';

// In-memory cache shared across all hook instances
const cache = new Map();

export const useFetch = (endpoint, { auth = false, deps = [] } = {}) => {
  const [data, setData] = useState(() => cache.get(endpoint) ?? undefined);
  const [loading, setLoading] = useState(!cache.has(endpoint));
  const [error, setError] = useState(null);
  const depsKey = JSON.stringify(deps);

  const fetchData = useCallback(async () => {
    if (!endpoint) {
      setData([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const headers = {};
      if (auth) {
        const token = localStorage.getItem('authToken');
        if (token) headers['Authorization'] = `Bearer ${token}`;
      }
      const res = await fetch(`${config.apiUrl}${endpoint}`, { headers });
      if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
      const json = await res.json();
      cache.set(endpoint, json);
      setData(json);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [endpoint, auth]);

  useEffect(() => {
    if (!cache.has(endpoint)) {
      fetchData();
    }
  }, [endpoint, fetchData, depsKey]);

  const refetch = () => {
    cache.delete(endpoint);
    fetchData();
  };

  return { data, loading, error, refetch };
};

export const usePost = (endpoint, { auth = false } = {}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const post = useCallback(async (body, method = 'POST') => {
    setLoading(true);
    setError(null);
    try {
      const headers = { 'Content-Type': 'application/json' };
      if (auth) {
        const token = localStorage.getItem('authToken');
        if (token) headers['Authorization'] = `Bearer ${token}`;
      }
      const res = await fetch(`${config.apiUrl}${endpoint}`, {
        method,
        headers,
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error((await res.json()).message || `${res.status}`);
      return await res.json();
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [endpoint, auth]);

  return { post, loading, error };
};

// Invalidate cache for an endpoint (call after mutations)
export const invalidateCache = (endpoint) => cache.delete(endpoint);
export const clearCache = () => cache.clear();
