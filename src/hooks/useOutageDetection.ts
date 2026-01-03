import { useState, useEffect } from 'react';
import { SteamStatus, HistoryEntry } from '../../types/types';

export interface OutageInfo {
  hasCurrentOutage: boolean;
  hadRecentOutage: boolean;
  outageCount: number;
  lastOutageTime: string | null;
}

// This hook only provides outage info for UI display
// Notifications are handled by the background monitor service
export function useOutageDetection(status: SteamStatus | null): OutageInfo {
  const [outageInfo, setOutageInfo] = useState<OutageInfo>({
    hasCurrentOutage: false,
    hadRecentOutage: false,
    outageCount: 0,
    lastOutageTime: null,
  });

  useEffect(() => {
    if (!status) return;

    // Check current service status for outage
    const currentServicesDown = Object.values(status.services).some(
      (svc) => svc.status !== 'online'
    );

    // Check history for outages in the last hour
    const recentOutages = status.history?.filter(
      (entry: HistoryEntry) => !entry.all_services_up
    ) || [];
    const hadRecentOutage = recentOutages.length > 0;
    const lastOutage = recentOutages.length > 0 ? recentOutages[recentOutages.length - 1] : null;

    setOutageInfo({
      hasCurrentOutage: currentServicesDown,
      hadRecentOutage,
      outageCount: recentOutages.length,
      lastOutageTime: lastOutage?.timestamp || null,
    });
  }, [status]);

  return outageInfo;
}
