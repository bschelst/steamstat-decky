import React from 'react';
import { Sparklines, SparklinesLine, SparklinesCurve, SparklinesReferenceLine } from 'react-sparklines';
import { HistoryEntry } from '../../types/types';

interface SparklineProps {
  history: HistoryEntry[];
  maxPoints?: number;
  height?: number;
}

// Format large numbers (e.g., 28500000 -> "28.5M")
function formatCompact(value: number): string {
  if (value >= 1000000) {
    return `${(value / 1000000).toFixed(1)}M`;
  }
  if (value >= 1000) {
    return `${(value / 1000).toFixed(0)}K`;
  }
  return value.toString();
}

export const Sparkline: React.FC<SparklineProps> = ({
  history,
  maxPoints = 72,
  height = 40,
}) => {
  if (!history || history.length === 0) {
    return <div style={{ color: '#666', fontSize: '12px' }}>No history data</div>;
  }

  // Downsample if we have more points than maxPoints
  let displayHistory = history;
  if (history.length > maxPoints) {
    const step = Math.ceil(history.length / maxPoints);
    displayHistory = history.filter((_, i) => i % step === 0);
  }

  // Get online counts
  const values = displayHistory.map((h) => h.online);
  const min = Math.min(...values);
  const max = Math.max(...values);

  // Color based on whether all services are up
  const allUp = history[history.length - 1]?.all_services_up ?? true;
  const lineColor = allUp ? '#4caf50' : '#ff9800';

  // Calculate time span
  const intervalMinutes = 10; // matches gateway INTERVAL_MINUTES
  const totalMinutes = history.length * intervalMinutes;
  const hours = Math.floor(totalMinutes / 60);
  const timeLabel = hours >= 1 ? `${hours}h` : `${totalMinutes}m`;

  return (
    <div style={{ fontSize: '11px' }}>
      {/* Y-axis labels */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          color: '#888',
          marginBottom: '2px',
        }}
      >
        <span>{formatCompact(max)}</span>
        <span style={{ color: '#666' }}>Players (last {timeLabel})</span>
        <span>{formatCompact(min)}</span>
      </div>

      {/* Sparkline Chart */}
      <div title={`${history.length} data points over ${timeLabel}`}>
        <Sparklines data={values} height={height} margin={2}>
          <defs>
            <linearGradient id="sparklineGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={lineColor} stopOpacity={0.4} />
              <stop offset="100%" stopColor={lineColor} stopOpacity={0.05} />
            </linearGradient>
          </defs>
          <SparklinesCurve
            color={lineColor}
            style={{ strokeWidth: 2, fill: 'url(#sparklineGradient)' }}
          />
          <SparklinesReferenceLine type="mean" style={{ stroke: '#666', strokeDasharray: '2,2', strokeWidth: 1 }} />
        </Sparklines>
      </div>

      {/* X-axis labels */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          color: '#666',
          marginTop: '2px',
        }}
      >
        <span>{timeLabel} ago</span>
        <span>now</span>
      </div>
    </div>
  );
};
