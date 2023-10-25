import legacyData from "../data/legacyData.js";
import ext_options from "../data/options.json";
import { get, getAsync, replaceObjectInArray, set } from "../modules/Utilities";
import convertLegacyData from "../modules/convertLegacyData";

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
    if (Array.isArray(result.providers)) {
      result.providers = result.providers.map((p) => {
        return {
          ...p,
          unblocked: false,
        };
      });
    }
    set(result, () => {
      sw_log("This object was set in storage:\n", result);
    });
  });
}

chrome.runtime.onMessage.addListener(({ action, id }) => {
  const unblockProvider = async () => {
    let { providers } = await getAsync(["providers"]);
    const provider = providers.filter((p) => p.id === id)[0];
    if (provider) {
      sw_log("Unblocking provider", provider);
      providers = replaceObjectInArray(
        providers,
        {
          ...provider,
          unblocked: false,
        },
        "id",
      );
      set({ providers });
    }
  };

  if (action === "unblock") {
    get(["options"], ({ options }) => {
      const allowRevisits = options.allowRevisits.value;
      const time = !allowRevisits ? 1000 : options.revisitLimit.value * 60000;
      sw_log(
        "Setting unblock timeout for provider",
        id,
        "in",
        time / 1000,
        "seconds",
      );
      setTimeout(unblockProvider, time);
    });
  }
});

chrome.runtime.onStartup.addListener(() => {
  (async function () {
    let { providers } = getAsync([providers]);
    if (Array.isArray(providers)) {
      providers = providers.map((p) => {
        return {
          ...p,
          unblocked: false,
        };
      });
      set({ providers });
    }
  })();
});
convertLegacyData((obj) => {
  sw_log("Legacy data was converted to", obj);
});
