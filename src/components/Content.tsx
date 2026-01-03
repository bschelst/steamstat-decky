import React, { useState } from 'react';
import {
  PanelSection,
  PanelSectionRow,
  ButtonItem,
  Field,
  Navigation,
  showModal,
} from '@decky/ui';
import {
  FaCog,
  FaArrowLeft,
  FaExclamationTriangle,
  FaQuestionCircle,
  FaGithub,
} from 'react-icons/fa';

import { StatusPanel } from './StatusPanel';
import { Settings } from './Settings';
import HelpModal from './HelpModal';
import { useSteamStatus } from '../hooks/useSteamStatus';
import { useOutageDetection, OutageInfo } from '../hooks/useOutageDetection';
import { PLUGIN_VERSION } from '../constants';
import useTranslations from '../hooks/useTranslations';

const GITHUB_URL = 'https://github.com/bschelst/steamstatus-decky';

const formatOutageTime = (timestamp: string | null, unknownText: string) => {
  if (!timestamp) return unknownText;
  const date = new Date(timestamp);
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

const ServiceStatusSection: React.FC<{ outageInfo: OutageInfo }> = ({ outageInfo }) => {
  const t = useTranslations();
  return (
    <PanelSection title={t('serviceStatus')}>
      <PanelSectionRow>
        {outageInfo.hasCurrentOutage ? (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '12px',
              background: 'rgba(244, 67, 54, 0.2)',
              borderRadius: '8px',
              borderLeft: '3px solid #f44336',
            }}
          >
            <FaExclamationTriangle size={18} color="#f44336" />
            <div>
              <div style={{ fontWeight: 'bold', marginBottom: '2px' }}>
                {t('activeOutage')}
              </div>
              <div style={{ fontSize: '12px', color: '#ccc' }}>
                {t('steamServicesIssues')}
              </div>
            </div>
          </div>
        ) : outageInfo.hadRecentOutage ? (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '12px',
              background: 'rgba(255, 152, 0, 0.15)',
              borderRadius: '8px',
              borderLeft: '3px solid #ff9800',
            }}
          >
            <FaExclamationTriangle size={18} color="#ff9800" />
            <div>
              <div style={{ fontWeight: 'bold', marginBottom: '2px' }}>
                {t('recentOutagesDetected')}
              </div>
              <div style={{ fontSize: '12px', color: '#ccc' }}>
                {outageInfo.outageCount} {t('outagesInLastHour')}
                {outageInfo.lastOutageTime && (
                  <span> - {t('lastAt')} {formatOutageTime(outageInfo.lastOutageTime, t('unknown'))}</span>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '12px',
              background: 'rgba(76, 175, 80, 0.15)',
              borderRadius: '8px',
              borderLeft: '3px solid #4caf50',
            }}
          >
            <div
              style={{
                width: '12px',
                height: '12px',
                borderRadius: '50%',
                background: '#4caf50',
              }}
            />
            <div>
              <div style={{ fontWeight: 'bold', marginBottom: '2px' }}>
                {t('allSystemsOperational')}
              </div>
              <div style={{ fontSize: '12px', color: '#ccc' }}>
                {t('noOutagesDetected')}
              </div>
            </div>
          </div>
        )}
      </PanelSectionRow>
    </PanelSection>
  );
};

const LinksSection: React.FC = () => {
  const t = useTranslations();
  return (
    <PanelSection title={t('links')}>
      <PanelSectionRow>
        <ButtonItem
          layout="below"
          onClick={() => showModal(<HelpModal />)}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <FaQuestionCircle size={16} />
            <span>{t('helpAndDocumentation')}</span>
          </div>
        </ButtonItem>
      </PanelSectionRow>
      <PanelSectionRow>
        <ButtonItem
          layout="below"
          onClick={() => Navigation.NavigateToExternalWeb(GITHUB_URL)}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <FaGithub size={16} />
            <span>{t('githubRepository')}</span>
          </div>
        </ButtonItem>
      </PanelSectionRow>
    </PanelSection>
  );
};

const AboutSection: React.FC = () => {
  const t = useTranslations();
  return (
    <PanelSection title={t('about')}>
      <PanelSectionRow>
        <Field label={t('version')} bottomSeparator="none">
          {PLUGIN_VERSION}
        </Field>
      </PanelSectionRow>
    </PanelSection>
  );
};

const Content: React.FC = () => {
  const t = useTranslations();
  const [showSettings, setShowSettings] = useState(false);
  const { status, isLoading, error, isOffline, lastUpdated, refresh } = useSteamStatus();
  const outageInfo = useOutageDetection(status);

  if (showSettings) {
    return (
      <>
        <PanelSectionRow>
          <ButtonItem
            layout="below"
            onClick={() => setShowSettings(false)}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <FaArrowLeft size={12} />
              {t('backToStatus')}
            </div>
          </ButtonItem>
        </PanelSectionRow>
        <Settings />
      </>
    );
  }

  return (
    <>
      {/* Outage Banner */}
      {(outageInfo.hasCurrentOutage || outageInfo.hadRecentOutage) && (
        <PanelSectionRow>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 12px',
              background: outageInfo.hasCurrentOutage
                ? 'rgba(244, 67, 54, 0.2)'
                : 'rgba(255, 152, 0, 0.15)',
              borderRadius: '6px',
              borderLeft: `3px solid ${outageInfo.hasCurrentOutage ? '#f44336' : '#ff9800'}`,
              marginBottom: '8px',
            }}
          >
            <FaExclamationTriangle
              size={14}
              color={outageInfo.hasCurrentOutage ? '#f44336' : '#ff9800'}
            />
            <span style={{ fontSize: '12px' }}>
              {outageInfo.hasCurrentOutage
                ? t('serviceOutageDetected')
                : `${outageInfo.outageCount} ${t('outagesInLastHourShort')}`}
            </span>
          </div>
        </PanelSectionRow>
      )}
      <StatusPanel
        status={status}
        isLoading={isLoading}
        error={error}
        isOffline={isOffline}
        lastUpdated={lastUpdated}
        onRefresh={refresh}
      />

      {/* Service Status Section */}
      <ServiceStatusSection outageInfo={outageInfo} />

      {/* Links Section */}
      <LinksSection />

      {/* About Section */}
      <AboutSection />

      <PanelSection title={t('settings')}>
        <PanelSectionRow>
          <ButtonItem
            layout="below"
            onClick={() => setShowSettings(true)}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <FaCog size={12} />
              {t('configurePlugin')}
            </div>
          </ButtonItem>
        </PanelSectionRow>
      </PanelSection>
    </>
  );
};

export default Content;
