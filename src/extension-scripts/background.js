import legacyData from "../data/legacyData.js";
import ext_options from "../data/options.json";
import { getAsync, set } from "../modules/Utilities";
import convertLegacyData from "../modules/convertLegacyData";
import {
  runtimeMessageListener,
  runtimeStartupListener,
} from "../modules/listeners";

const devConfig = {
  setLegacyData: false,
  clearStoredData: false,
  resetOptions: false,
  clearStoredSyncData: false,
  clearStoredMatchData: false,
  clearStoredLocalData: false,
};

const sw_log = (...args) => {
  console.log("service worker:", ...args);
};

// Defaults for storage
const defaults = {
  providers: [],
  options: ext_options,
};

chrome.runtime.onMessage.addListener(runtimeMessageListener(sw_log));
chrome.runtime.onStartup.addListener(runtimeStartupListener);

(async function () {
  if (devConfig.clearStoredSyncData || devConfig.clearStoredData) {
    await chrome.storage.sync.clear();
    sw_log("Sync storage was cleared");
  }
  if (devConfig.clearStoredLocalData || devConfig.clearStoredData) {
    await chrome.storage.local.clear();
    sw_log("Local storage was cleared");
  }
  if (devConfig.clearStoredMatchData) {
    await chrome.storage.sync.remove(["providers"]);
  }
  if (devConfig.resetOptions) {
    await chrome.storage.sync.set({ options: ext_options });
    sw_log("Local storage options were reset");
  }
  if (devConfig.setLegacyData) {
    await chrome.storage.local.set(legacyData);
    sw_log("Local storage was set to legacyData");
  } else {
    // Check data in storage
    const result = await getAsync(defaults);

    if (Array.isArray(result.providers)) {
      result.providers = result.providers.map((p) => {
        return {
          ...p,
          unblocked: false,
        };
      });
    }
    await set(result);
    sw_log("This object was set in storage:\n", result);
  }

  await convertLegacyData((obj) => {
    sw_log("Legacy data was converted to", obj);
  });
})();
