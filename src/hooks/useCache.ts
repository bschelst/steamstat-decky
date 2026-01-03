import { useState, useCallback } from 'react';
import { CACHE_KEY } from '../constants';
import { SteamStatus, CachedStatus } from '../../types/types';

/**
 * Hook for managing offline cache of Steam status
 */
export function useCache() {
  const [isUsingCache, setIsUsingCache] = useState(false);

  const saveToCache = useCallback((data: SteamStatus) => {
    try {
      const cached: CachedStatus = {
        data,
        cachedAt: Date.now(),
      };
      localStorage.setItem(CACHE_KEY, JSON.stringify(cached));
    } catch (e) {
      console.error('Failed to save to cache:', e);
    }
  }, []);

  const loadFromCache = useCallback((): SteamStatus | null => {
    try {
      const cached = localStorage.getItem(CACHE_KEY);
      if (cached) {
        const parsed: CachedStatus = JSON.parse(cached);
        setIsUsingCache(true);
        return parsed.data;
      }
    } catch (e) {
      console.error('Failed to load from cache:', e);
    }
    return null;
  }, []);

  const getCacheAge = useCallback((): number | null => {
    try {
      const cached = localStorage.getItem(CACHE_KEY);
      if (cached) {
        const parsed: CachedStatus = JSON.parse(cached);
        return Math.floor((Date.now() - parsed.cachedAt) / 1000);
      }
    } catch (e) {
      // Ignore
    }
    return null;
  }, []);

  const clearCache = useCallback(() => {
    try {
      localStorage.removeItem(CACHE_KEY);
      setIsUsingCache(false);
    } catch (e) {
      console.error('Failed to clear cache:', e);
    }
  }, []);

  return {
    isUsingCache,
    setIsUsingCache,
    saveToCache,
    loadFromCache,
    getCacheAge,
    clearCache,
  };
}
