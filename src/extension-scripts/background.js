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

contextMenuItems.forEach((item) => {
  chrome.contextMenus.create(item);
});
chrome.contextMenus.onClicked.addListener(contextMenuListener);
chrome.runtime.onMessage.addListener(runtimeMessageListener);
chrome.runtime.onStartup.addListener(runtimeStartupListener);

manageDataOnStartup(devConfig, defaults);
