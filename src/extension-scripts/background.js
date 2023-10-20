import legacyData from "../data/legacyData.js";
import {
  get,
  set,
  localizedOptions,
  localizedProviders,
} from "../modules/Utilities";

import convertLegacyData from "./convertLegacyData";

// Localized objects
const ext_options = localizedOptions();
const ext_matches = localizedProviders();

const devConfig = {
  setLegacyData: false,
  clearStoredData: false,
  clearStoredSyncData: false,
  clearStoredLocalData: false,
};

const sw_log = (...args) => {
  console.log("service worker:", ...args);
};

if (devConfig.clearStoredSyncData || devConfig.clearStoredData) {
  chrome.storage.sync.clear(() => sw_log("Sync storage was cleared"));
}
if (devConfig.clearStoredLocalData || devConfig.clearStoredData) {
  chrome.storage.local.clear(() => sw_log("Local storage was cleared"));
}

// Defaults for storage
const defaults = {
  providers: ext_matches,
  options: ext_options,
};

if (devConfig.setLegacyData) {
  chrome.storage.local.set(legacyData, () =>
    sw_log("Local storage was set to legacyData"),
  );
} else {
  // Check data in storage
  get(defaults, (result) => {
    set(result, () => {
      sw_log("This object was set in storage:\n", result);
    });
  });
}

convertLegacyData();
