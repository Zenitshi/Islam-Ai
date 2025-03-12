from pathlib import Path
import json
import os
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class Config:
    def __init__(self):
        # Use environment variables if available, otherwise use home directory
        config_dir = os.getenv('CONFIG_DIR', str(Path.home() / ".islamai"))
        config_file = os.getenv('CONFIG_FILE', 'config.json')
        
        self.config_dir = Path(config_dir)
        self.config_file = self.config_dir / config_file
        self._ensure_config_dir()
        self.load_config()

    def _ensure_config_dir(self):
        try:
            self.config_dir.mkdir(parents=True, exist_ok=True)
            if not self.config_file.exists():
                self.save_config({
                    "api_keys": {
                        "gemini": "",
                        "deepseek": ""
                    },
                    "active_model": "gemini-pro"
                })
            logger.info(f"Config directory ensured at {self.config_dir}")
        except Exception as e:
            logger.error(f"Error ensuring config directory: {e}")
            raise

    def load_config(self):
        try:
            if self.config_file.exists():
                with open(self.config_file, 'r') as f:
                    self.config = json.load(f)
                logger.info("Config loaded successfully")
            else:
                self.config = {
                    "api_keys": {
                        "gemini": "",
                        "deepseek": ""
                    },
                    "active_model": "gemini-pro"
                }
                logger.info("Created new default config")
        except Exception as e:
            logger.error(f"Error loading config: {e}")
            raise

    def save_config(self, config=None):
        try:
            if config is not None:
                self.config = config
            with open(self.config_file, 'w') as f:
                json.dump(self.config, f, indent=2)
            logger.info("Config saved successfully")
        except Exception as e:
            logger.error(f"Error saving config: {e}")
            raise

    def get_api_key(self, provider):
        try:
            key = self.config["api_keys"].get(provider, "")
            # Log whether we found a key (without revealing the key itself)
            logger.info(f"Retrieved API key for {provider}: {'Found' if key else 'Not found'}")
            return key
        except Exception as e:
            logger.error(f"Error getting API key for {provider}: {e}")
            raise

    def set_api_key(self, provider, key):
        try:
            self.config["api_keys"][provider] = key
            self.save_config()
            logger.info(f"API key for {provider} updated successfully")
        except Exception as e:
            logger.error(f"Error setting API key for {provider}: {e}")
            raise

    def get_active_model(self):
        return self.config.get("active_model", "gemini-pro")

    def set_active_model(self, model):
        self.config["active_model"] = model
        self.save_config() 