var defaultSettings = {
  saved: "true",
  seconds: "30",
  "start-time": "09:00",
  "end-time": "17:00",
  "revisits-number": "1",
  "revisits-checkbox": 1,
  "allday-checkbox": 0,
  mon: "true",
  tue: "true",
  wed: "true",
  thu: "true",
  fri: "true",
  sat: "true",
  sun: "true",
  matches: "",
};

function addPage(info, tab) {
  chrome.storage.local.get("matches", function (result) {
    var matchString = result["matches"];
    var url = info.pageUrl
      .substring(info.pageUrl.indexOf("://") + 3)
      .replace(/\/$/, "")
      .toLowerCase();

    if (!matchString.includes(url)) {
      matchString += "\n" + url;
      chrome.storage.local.set({ matches: matchString });
      sendAlert(tab.id, "page");
    } else {
      sendAlert(tab.id, "exists");
    }
  });
}

function addLink(info, tab) {
  chrome.storage.local.get("matches", function (result) {
    var matchString = result["matches"];
    var link = info.linkUrl
      .substring(info.linkUrl.indexOf("://") + 3)
      .replace(/\/$/, "")
      .toLowerCase();
    if (!matchString.includes(link)) {
      matchString += "\n" + link;
      chrome.storage.local.set({ matches: matchString });
      sendAlert(tab.id, "link");
    } else {
      sendAlert(tab.id, "exists");
    }
  });
}

function sendAlert(tabId, addType) {
  chrome.tabs.sendMessage(tabId, { type: addType }, function (response) {});
}

// chrome ------------------------------------------------------------------------------------

chrome.contextMenus.create({
  title: "Add this page to blocked list",
  contexts: ["page"],
  onclick: addPage,
});

chrome.contextMenus.create({
  title: "Add link address to blocked list",
  contexts: ["link"],
  onclick: addLink,
});

chrome.storage.local.get(defaultSettings, function (retrievedSettings) {
  // Settings are retrieved or set to default
  chrome.storage.local.set(retrievedSettings);
});
