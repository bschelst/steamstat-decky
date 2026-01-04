import { useState, useEffect } from 'react';
import { PLUGIN_VERSION } from '../constants';

const LATEST_VERSION_URL =
  'https://raw.githubusercontent.com/bschelst/steamstatus-decky/main/LATEST_VERSION';

// Compare semantic versions: returns 1 if a > b, -1 if a < b, 0 if equal
function compareVersions(a: string, b: string): number {
  const partsA = a.split('.').map((n) => parseInt(n, 10));
  const partsB = b.split('.').map((n) => parseInt(n, 10));

  for (let i = 0; i < Math.max(partsA.length, partsB.length); i++) {
    const numA = partsA[i] || 0;
    const numB = partsB[i] || 0;
    if (numA > numB) return 1;
    if (numA < numB) return -1;
  }
  return 0;
}

export interface LatestVersionInfo {
  latestVersion: string | null;
  isLoading: boolean;
  error: string | null;
  updateAvailable: boolean;
  currentVersion: string;
}

export function useLatestVersion(enabled: boolean = true): LatestVersionInfo {
  const [latestVersion, setLatestVersion] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(enabled);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!enabled) {
      setIsLoading(false);
      setLatestVersion(null);
      return;
    }

    const fetchLatestVersion = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const response = await fetch(LATEST_VERSION_URL, {
          cache: 'no-store',
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch: ${response.status}`);
        }

        const text = await response.text();
        const version = text.trim();

        // Validate version format (basic check)
        if (!/^\d+\.\d+\.\d+/.test(version)) {
          throw new Error('Invalid version format');
        }

        setLatestVersion(version);
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Failed to check for updates');
        setLatestVersion(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLatestVersion();
  }, [enabled]);

  const updateAvailable =
    latestVersion !== null && compareVersions(latestVersion, PLUGIN_VERSION) > 0;

  return {
    latestVersion,
    isLoading,
    error,
    updateAvailable,
    currentVersion: PLUGIN_VERSION,
  };
}
