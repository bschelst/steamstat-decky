import React, { useState } from 'react';
import { PanelSectionRow, Focusable } from '@decky/ui';
import { FaChevronDown, FaChevronUp, FaGamepad, FaArrowUp, FaArrowDown } from 'react-icons/fa';
import { TrendingGame } from '../../types/types';
import { formatPlayerCount } from '../utils/formatters';
import useTranslations from '../hooks/useTranslations';

interface TrendingGamesProps {
  games: TrendingGame[];
}

export const TrendingGamesPanel: React.FC<TrendingGamesProps> = ({ games }) => {
  const t = useTranslations();
  const [isExpanded, setIsExpanded] = useState(false);

  if (!games || games.length === 0) {
    return null;
  }

  // Check if most games are trending up
  const trendingUp = games.filter((g) => g.gain_24h > 0).length > games.length / 2;

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
          <FaGamepad size={14} color="#8bc34a" />
          <span>{t('trendingGames')}</span>
          {trendingUp ? (
            <FaArrowUp size={10} color="#4caf50" />
          ) : (
            <FaArrowDown size={10} color="#f44336" />
          )}
        </div>
        {isExpanded ? <FaChevronUp size={12} /> : <FaChevronDown size={12} />}
      </Focusable>

      {isExpanded && (
        <div style={{ paddingLeft: '12px' }}>
          {games.map((game, index) => (
            <PanelSectionRow key={game.appid}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  width: '100%',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span
                    style={{
                      fontSize: '11px',
                      color: '#888',
                      width: '16px',
                    }}
                  >
                    {index + 1}.
                  </span>
                  <span
                    style={{
                      fontSize: '13px',
                      maxWidth: '140px',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {game.name}
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '12px', color: '#888' }}>
                    {formatPlayerCount(game.current_players)}
                  </span>
                  <span
                    style={{
                      fontSize: '11px',
                      color: game.gain_24h >= 0 ? '#4caf50' : '#f44336',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '2px',
                    }}
                  >
                    {game.gain_24h >= 0 ? (
                      <FaArrowUp size={8} />
                    ) : (
                      <FaArrowDown size={8} />
                    )}
                    {formatPlayerCount(Math.abs(game.gain_24h))}
                  </span>
                </div>
              </div>
            </PanelSectionRow>
          ))}
          <div
            style={{
              fontSize: '10px',
              color: '#666',
              textAlign: 'center',
              paddingTop: '4px',
            }}
          >
            {t('trendingGamesSubtitle')}
          </div>
        </div>
      )}
    </div>
  );
};
