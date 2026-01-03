import os
import json
import decky_plugin

SETTINGS_FILE = os.path.join(decky_plugin.DECKY_PLUGIN_SETTINGS_DIR, "settings.json")

DEFAULT_SETTINGS = {
    "gateway_url": "",
    "gateway_api_key": "",
    "status_page_url": "https://store.steampowered.com/charts",
    "refresh_interval_seconds": 120,
    "show_regions": True,
    "show_history": True,
}


class Plugin:
    settings: dict = {}

    async def _main(self):
        """Initialize the plugin."""
        self.settings = self._load_settings()
        decky_plugin.logger.info("SteamStat plugin initialized")

    async def _unload(self):
        """Clean up when plugin is unloaded."""
        decky_plugin.logger.info("SteamStat plugin unloaded")

    def _load_settings(self) -> dict:
        """Load settings from file or return defaults."""
        try:
            if os.path.exists(SETTINGS_FILE):
                with open(SETTINGS_FILE, "r") as f:
                    loaded = json.load(f)
                    # Merge with defaults to ensure all keys exist
                    return {**DEFAULT_SETTINGS, **loaded}
        except Exception as e:
            decky_plugin.logger.error(f"Failed to load settings: {e}")
        return DEFAULT_SETTINGS.copy()

    def _save_settings(self) -> bool:
        """Save settings to file."""
        try:
            os.makedirs(os.path.dirname(SETTINGS_FILE), exist_ok=True)
            with open(SETTINGS_FILE, "w") as f:
                json.dump(self.settings, f, indent=2)
            return True
        except Exception as e:
            decky_plugin.logger.error(f"Failed to save settings: {e}")
            return False

    async def get_settings(self) -> dict:
        """Get all settings."""
        return self.settings

    async def set_setting(self, key: str, value) -> bool:
        """Set a single setting."""
        if key in DEFAULT_SETTINGS:
            self.settings[key] = value
            return self._save_settings()
        return False

    async def set_settings(self, settings: dict) -> bool:
        """Set multiple settings at once."""
        for key, value in settings.items():
            if key in DEFAULT_SETTINGS:
                self.settings[key] = value
        return self._save_settings()

    async def get_setting(self, key: str, default=None):
        """Get a single setting."""
        return self.settings.get(key, default)

    async def reset_settings(self) -> bool:
        """Reset all settings to defaults."""
        self.settings = DEFAULT_SETTINGS.copy()
        return self._save_settings()
