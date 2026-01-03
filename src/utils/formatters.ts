/**
 * Format a number with abbreviation (e.g., 28500000 -> "28.5M")
 */
export function formatPlayerCount(num: number): string {
  if (num >= 1_000_000) {
    return (num / 1_000_000).toFixed(1) + 'M';
  }
  if (num >= 1_000) {
    return (num / 1_000).toFixed(1) + 'K';
  }
  return num.toString();
}

/**
 * Format seconds as relative time (e.g., "30s ago", "2m ago")
 */
export function formatRelativeTime(seconds: number): string {
  if (seconds < 60) {
    return `${Math.floor(seconds)}s ago`;
  }
  if (seconds < 3600) {
    return `${Math.floor(seconds / 60)}m ago`;
  }
  return `${Math.floor(seconds / 3600)}h ago`;
}

/**
 * Format region key to display name
 */
export function formatRegionName(region: string): string {
  const names: Record<string, string> = {
    us_east: 'US East',
    us_west: 'US West',
    eu_west: 'EU West',
    eu_east: 'EU East',
    asia: 'Asia',
    australia: 'Australia',
    south_america: 'S. America',
  };
  return names[region] || region.replace(/_/g, ' ').toUpperCase();
}

/**
 * Get status indicator color
 */
export function getStatusColor(status: string): string {
  switch (status) {
    case 'online':
      return '#4caf50';
    case 'degraded':
      return '#ff9800';
    case 'offline':
      return '#f44336';
    default:
      return '#9e9e9e';
  }
}
