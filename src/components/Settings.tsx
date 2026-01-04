import React from 'react';
import {
  PanelSection,
  PanelSectionRow,
  TextField,
  SliderField,
  ToggleField,
} from '@decky/ui';
import { useSettings } from '../hooks/useSettings';
import useTranslations from '../hooks/useTranslations';

export const Settings: React.FC = () => {
  const t = useTranslations();
  const [settings, updateSetting] = useSettings();

  return (
    <>
      <PanelSection title={t('displayOptions')}>
        <PanelSectionRow>
          <TextField
            label={t('statusPageUrl')}
            description={t('statusPageUrlDesc')}
            value={settings.status_page_url}
            onChange={(e) => updateSetting('status_page_url', e.target.value)}
          />
        </PanelSectionRow>

        <PanelSectionRow>
          <SliderField
            label={t('refreshInterval')}
            description={t('refreshIntervalDesc')}
            value={settings.refresh_interval_seconds}
            min={0}
            max={600}
            step={60}
            notchCount={5}
            notchLabels={[
              { notchIndex: 0, label: t('off') },
              { notchIndex: 1, label: '3m' },
              { notchIndex: 2, label: '5m' },
              { notchIndex: 3, label: '7m' },
              { notchIndex: 4, label: '10m' },
            ]}
            onChange={(value) => {
              // Minimum 3 minutes (180 seconds) if not off
              const adjustedValue = value > 0 && value < 180 ? 180 : value;
              updateSetting('refresh_interval_seconds', adjustedValue);
            }}
          />
        </PanelSectionRow>

        <PanelSectionRow>
          <ToggleField
            label={t('showHistory')}
            description={t('showHistoryDesc')}
            checked={settings.show_history}
            onChange={(value) => updateSetting('show_history', value)}
          />
        </PanelSectionRow>

        <PanelSectionRow>
          <ToggleField
            label={t('showTrendingGames')}
            description={t('showTrendingGamesDesc')}
            checked={settings.show_trending_games}
            onChange={(value) => updateSetting('show_trending_games', value)}
          />
        </PanelSectionRow>

        <PanelSectionRow>
          <ToggleField
            label={t('checkForUpdates')}
            description={t('checkForUpdatesDesc')}
            checked={settings.check_for_updates}
            onChange={(value) => updateSetting('check_for_updates', value)}
          />
        </PanelSectionRow>
      </PanelSection>

      <PanelSection title={t('notifications')}>
        <PanelSectionRow>
          <ToggleField
            label={t('enableNotifications')}
            description={t('enableNotificationsDesc')}
            checked={settings.enable_notifications}
            onChange={(value) => updateSetting('enable_notifications', value)}
          />
        </PanelSectionRow>
      </PanelSection>
    </>
  );
};
