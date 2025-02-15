import ext_options from "../data/options.json";
import contextMenuItems from "../data/contextMenus.json";
import {
  contextMenuListener,
  manageDataOnStartup,
  runtimeMessageListener,
  runtimeStartupListener,
} from "../modules/startup";

const devConfig = {
  setLegacyData: false,
  clearStoredData: false,
  resetOptions: false,
  clearStoredSyncData: false,
  clearStoredMatchData: false,
  clearStoredLocalData: false,
};

// Defaults for storage
const defaults = {
  providers: [],
  options: ext_options,
};

const createContextMenus = () =>
  contextMenuItems.forEach((item) => {
    chrome.contextMenus.create(item);
  });

const onUpdate = async (details) => {
  if (details.reason === chrome.runtime.OnInstalledReason.UPDATE) {
    chrome.tabs.create({ url: "update.html" });
  }
};

chrome.runtime.onInstalled.addListener(createContextMenus);
chrome.runtime.onInstalled.addListener(onUpdate);
chrome.contextMenus.onClicked.addListener(contextMenuListener);
chrome.runtime.onMessage.addListener(runtimeMessageListener);
chrome.runtime.onStartup.addListener(runtimeStartupListener);

manageDataOnStartup(devConfig, defaults);
