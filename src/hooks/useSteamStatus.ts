import { useState, useEffect, useCallback, useRef } from 'react';
import { SteamStatus } from '../../types/types';
import { useSettings } from './useSettings';
import { useCache } from './useCache';

interface UseSteamStatusResult {
  status: SteamStatus | null;
  isLoading: boolean;
  error: string | null;
  isOffline: boolean;
  lastUpdated: number | null;
  refresh: () => Promise<void>;
}

export function useSteamStatus(): UseSteamStatusResult {
  const [status, setStatus] = useState<SteamStatus | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<number | null>(null);
  const [settings] = useSettings();
  const { isUsingCache, setIsUsingCache, saveToCache, loadFromCache } = useCache();
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const fetchRef = useRef<() => Promise<void>>();

  const fetchStatus = useCallback(async () => {
    if (!settings.gateway_url || !settings.gateway_api_key) {
      setError('Gateway not configured. Please set URL and API key in settings.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`${settings.gateway_url}/api/v1/status`, {
        method: 'GET',
        headers: {
          'X-API-Key': settings.gateway_api_key,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          throw new Error('Invalid API key');
        }
        if (response.status === 429) {
          throw new Error('Rate limited. Try again later.');
        }
        throw new Error(`Server error: ${response.status}`);
      }

      const data: SteamStatus = await response.json();
      setStatus(data);
      setLastUpdated(Date.now());
      setIsUsingCache(false);
      saveToCache(data);
      setError(null);
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : 'Failed to fetch status';
      console.error('Failed to fetch Steam status:', errorMessage);

      // Try to load from cache on error
      const cached = loadFromCache();
      if (cached) {
        setStatus(cached);
        setError(`Offline mode: ${errorMessage}`);
      } else {
        setError(errorMessage);
      }
    } finally {
      setIsLoading(false);
    }
  }, [settings.gateway_url, settings.gateway_api_key, saveToCache, loadFromCache, setIsUsingCache]);

  // Keep fetchRef updated with latest fetchStatus
  useEffect(() => {
    fetchRef.current = fetchStatus;
  }, [fetchStatus]);

  // Initial fetch - run once on mount
  useEffect(() => {
    // Load cached data immediately
    const cached = loadFromCache();
    if (cached) {
      setStatus(cached);
    }

    // Fetch fresh data
    fetchStatus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Interval setup - separate effect that only depends on interval setting
  useEffect(() => {
    // Clear any existing interval
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    // Setup new interval that calls the ref (always has latest function)
    if (settings.refresh_interval_seconds > 0) {
      intervalRef.current = setInterval(() => {
        fetchRef.current?.();
      }, settings.refresh_interval_seconds * 1000);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [settings.refresh_interval_seconds]);

  return {
    status,
    isLoading,
    error,
    isOffline: isUsingCache,
    lastUpdated,
    refresh: fetchStatus,
  };
}
