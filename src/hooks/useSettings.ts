import { useEffect, useState } from 'react';
import { call } from '@decky/api';
import { DEFAULT_SETTINGS } from '../constants';
import { PluginSettings } from '../../types/types';

let cachedSettings: PluginSettings = { ...DEFAULT_SETTINGS };
let settingsListeners: Set<(settings: PluginSettings) => void> = new Set();

export function loadSettings(): Promise<PluginSettings> {
  return call<[], PluginSettings>('get_settings').then((settings) => {
    cachedSettings = { ...DEFAULT_SETTINGS, ...settings };
    notifyListeners();
    return cachedSettings;
  }).catch(() => {
    return cachedSettings;
  });
}

function notifyListeners() {
  settingsListeners.forEach((listener) => listener(cachedSettings));
}

export function useSettings(): [PluginSettings, (key: keyof PluginSettings, value: any) => Promise<void>] {
  const [settings, setSettings] = useState<PluginSettings>(cachedSettings);

  useEffect(() => {
    const listener = (newSettings: PluginSettings) => {
      setSettings({ ...newSettings });
    };
    settingsListeners.add(listener);

    // Load settings on mount
    loadSettings();

    return () => {
      settingsListeners.delete(listener);
    };
  }, []);

  const updateSetting = async (key: keyof PluginSettings, value: any) => {
    cachedSettings = { ...cachedSettings, [key]: value };
    setSettings(cachedSettings);
    notifyListeners();

    await call<[string, any], boolean>('set_setting', key, value);
  };

  return [settings, updateSetting];
}

export function getSettings(): PluginSettings {
  return cachedSettings;
}
