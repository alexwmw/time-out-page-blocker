import legacyData from "../data/legacyData.js";
import {get, set} from "../modules/Utilities";

import convertLegacyData from "./convertLegacyData";

// Localized objects
const ext_options = require("../data/options.json");
// const ext_matches = localizedProviders();

const devConfig = {
  setLegacyData: false,
  clearStoredData: false,
  clearStoredSyncData: false,
  clearStoredMatchData: false,
  clearStoredLocalData: false,
};

const sw_log = (...args) => {
  console.log("service worker:", ...args);
};

if (devConfig.clearStoredSyncData || devConfig.clearStoredData) {
  chrome.storage.sync.clear(() => {
    sw_log("Sync storage was cleared");
  });
}
if (devConfig.clearStoredLocalData || devConfig.clearStoredData) {
  chrome.storage.local.clear(() => sw_log("Local storage was cleared"));
}
if (devConfig.clearStoredMatchData) {
  chrome.storage.sync.remove(["providers"]);
}

// Defaults for storage
const defaults = {
  providers: [],
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
