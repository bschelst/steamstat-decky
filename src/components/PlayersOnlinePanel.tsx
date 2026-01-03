import React, { useState } from 'react';
import { PanelSectionRow, Focusable } from '@decky/ui';
import { FaChevronDown, FaChevronUp, FaUsers } from 'react-icons/fa';
import { HistoryEntry } from '../../types/types';
import { formatPlayerCount } from '../utils/formatters';
import { Sparkline } from './Sparkline';
import useTranslations from '../hooks/useTranslations';

interface PlayersOnlinePanelProps {
  online: number;
  history?: HistoryEntry[];
  showHistory: boolean;
}

export const PlayersOnlinePanel: React.FC<PlayersOnlinePanelProps> = ({
  online,
  history,
  showHistory,
}) => {
  const t = useTranslations();
  const [isExpanded, setIsExpanded] = useState(true); // Expanded by default

  return (
    <div style={{ marginTop: '8px' }}>
      <Focusable
        onActivate={() => setIsExpanded(!isExpanded)}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '8px 0',
          cursor: 'pointer',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <FaUsers size={14} color="#8bc34a" />
          <span>{t('playersOnlineTitle')}</span>
        </div>
        {isExpanded ? <FaChevronUp size={12} /> : <FaChevronDown size={12} />}
      </Focusable>

      {isExpanded && (
        <div style={{ paddingLeft: '12px' }}>
          <PanelSectionRow>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
              <span>{t('playersOnline')}</span>
              <span style={{ fontWeight: 'bold' }}>
                {formatPlayerCount(online)}
              </span>
            </div>
          </PanelSectionRow>
          {showHistory && history && history.length > 0 && (
            <PanelSectionRow>
              <div style={{ padding: '4px 0', width: '100%' }}>
                <Sparkline history={history} />
              </div>
            </PanelSectionRow>
          )}
        </div>
      )}
    </div>
  );
};
