import React from 'react';
import { definePlugin, staticClasses } from '@decky/ui';
import { FaSteam } from 'react-icons/fa';

import Content from './components/Content';
import { loadSettings } from './hooks/useSettings';
import { startBackgroundMonitor, stopBackgroundMonitor } from './services/backgroundMonitor';

export default definePlugin(() => {
  loadSettings();
  startBackgroundMonitor();

  return {
    title: <div className={staticClasses.Title}>Steam Status</div>,
    icon: <FaSteam />,
    content: <Content />,
    onDismount() {
      stopBackgroundMonitor();
    },
  };
});
