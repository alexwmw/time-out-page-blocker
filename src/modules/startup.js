import { get, getAsync, replaceObjectInArray, set } from "./Utilities";
import ext_options from "../data/options.json";
import legacyData from "../data/legacyData";
import convertLegacyData from "./convertLegacyData";
import { getBlockListAdders } from "../hooks/useBlockList";

export const runtimeStartupListener = () => {
  (async function () {
    let { providers } = getAsync(["providers"]);
    if (Array.isArray(providers)) {
      providers = providers.map((p) => {
        return {
          ...p,
          unblocked: false,
        };
      });
      set({ providers }, () => {});
    }
  })();
};
export const runtimeMessageListener = (
  { action, id, log },
  sender,
  sendResponse,
) => {
  const blockAfterTimeout = async () => {
    let { providers } = await getAsync(["providers"]);
    const provider = providers.filter((p) => p.id === id)[0];
    if (provider) {
      providers = replaceObjectInArray(
        providers,
        { ...provider, unblocked: false },
        "id",
      );
      set({ providers }, () => {
        console.log(
          "timeout: Blocking provider (removing unblock)",
          id,
          provider,
        );
      });
    }
  };

  if (action === "unblock") {
    get(["options"], ({ options }) => {
      const allowRevisits = options.allowRevisits.value;
      const time = !allowRevisits ? 1000 : options.revisitLimit.value * 60000;
      console.log(
        "unblock listener: Setting unblock timeout for provider",
        id,
        "in",
        time / 1000,
        "seconds",
      );
      setTimeout(blockAfterTimeout, time);
      sendResponse(true);
      return true;
    });
  }
  if (action === "Enable context menu") {
    chrome.contextMenus.update("addPageToBlockList", { visible: true });
    chrome.contextMenus.update("addDomainToBlockList", { visible: true });
  }
  if (action === "Disable context menu") {
    chrome.contextMenus.update("addPageToBlockList", { visible: false });
    chrome.contextMenus.update("addDomainToBlockList", { visible: false });
  }
  if (log) {
    console.log(...(Array.isArray(log) ? log : [log]));
    sendResponse(true);
    return true;
  }
};

export const contextMenuListener = async (info, tab) => {
  const [protocol, url] = tab.url.split(`//`) ?? [];
  const refreshTab = () => chrome.tabs.reload(tab.id);
  const { addPageToBlockList, addDomainToBlockList } = getBlockListAdders(url);
  if (info.menuItemId === "addPageToBlockList") {
    addPageToBlockList(refreshTab);
    return true;
  }
  if (info.menuItemId === "addDomainToBlockList") {
    addDomainToBlockList(refreshTab);
    return true;
  }
  if (info.menuItemId === "manageBlockList") {
    chrome.runtime.openOptionsPage();
    return true;
  }
};

export async function manageDataOnStartup(devConfig, defaults) {
  if (devConfig.clearStoredSyncData || devConfig.clearStoredData) {
    await chrome.storage.sync.clear();
    console.log("Sync storage was cleared");
  }
  if (devConfig.clearStoredLocalData || devConfig.clearStoredData) {
    await chrome.storage.local.clear();
    console.log("Local storage was cleared");
  }
  if (devConfig.clearStoredMatchData) {
    await chrome.storage.sync.remove(["providers"]);
  }
  if (devConfig.resetOptions) {
    await chrome.storage.sync.set({ options: ext_options });
    console.log("Local storage options were reset");
  }
  if (devConfig.setLegacyData) {
    await chrome.storage.local.set(legacyData);
    console.log("Local storage was set to legacyData");
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
    console.log("This object was set in storage:\n", result);
  }

  await convertLegacyData((obj) => {
    console.log("Legacy data was converted to", obj);
  });
}
