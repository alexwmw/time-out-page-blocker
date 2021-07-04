/**
 * Settings names as they appear in the settings page HTML.
 */
const STARTTIME = "start-time";
const ENDTIME = "end-time";
const MATCHES = "matches";
const REVISITS_CB = "revisits-checkbox";
const REVISITS_MINS = "revisits-number";
const SECONDS = "seconds";
const ALLDAY_CB = "allday-checkbox";
/**
 * Default settings for the extension.
 */
const DEFAULT_SETTINGS = {
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
/**
 * Two modes for the isWithinTime function and associated bool functions for hours, mins in the check.
 */
const TIME_CHECK_MODE = {
  IsPast: {
    hours: (hour, hoursPast) => hour > hoursPast,
    minutes: (minute, minutesPast) => minute >= minutesPast,
  },
  IsBefore: {
    hours: (hour, hoursPast) => hour < hoursPast,
    minutes: (minute, minutesPast) => minute < minutesPast,
  },
};
/**
 * Options to be passed to chrome notifications
 * @param {string} successMessage Message to show depoending on success of action.
 * @returns {object} Options object
 */
const NOTIF_OPTS = (successMessage) => {
  return {
    iconUrl: "/images/icon128.png",
    message: successMessage,
    title: "Time Out : Page Blocker",
    type: "basic",
  };
};
/**
 * Success messages for NOTIF_OPTS
 */
const SUCCESS_MESSAGE = {
  success: "Page added successfully",
  failure: "Page already added",
};
/**
 * Holds URLs of any pages that have been unblocked by the user
 * using the Time Out interface button. This ensures they are not
 * blocked when the user next returns to the page
 */
var unblocked = new Set();
/**
 * Holds URLs of any pages that have been unblocked by the user
 * using the Time Out interface button - ONLY if the user settings
 * dictate to allow revisits within a timeframe
 */
var withinTimeOut = new Set();

/**
 * Trims the scheme/protocol and trailing '/' from URL
 * @param {string} url A URL
 * @returns {string} A trimmed URL
 */
function trimUrl(url) {
  return url
    .substring(url.indexOf("://") + 3)
    .replace(/\/$/, "")
    .toLowerCase();
}

/**
 * Check if a given time falls before or past the current time.
 * @param {string} timeToTest A time as specified in user settings
 * @param {Date} date A date object (i.e. the current date)
 * @param {object} timeCheckMode Functions to help test for IsPast and IsBefore
 * @returns {boolean}
 */
function isWithinTime(timeToTest, date, timeCheckMode) {
  var hour = parseInt(date.getHours());
  var minute = parseInt(date.getMinutes());
  var hoursPast = parseInt(timeToTest.substring(0, 2));
  var minutesPast = parseInt(timeToTest.substring(3, 5));
  return (
    timeCheckMode.hours(hour, hoursPast) ||
    (hour == hoursPast) & timeCheckMode.minutes(minute, minutesPast)
  );
}

/**
 * Check if the pageUrl parameter is found in the list of matches
 * @param {string} matchesStr The list of URLs to match against in string form
 * @param {string} pageUrl The URL of the active tab
 * @returns {boolean} True if pageUrl string exists in split match string
 */
function isBlockedUrl(matchesStr, pageUrl) {
  return matchesStr
    .split("\n")
    .some((storedUrl) => storedUrl.toLowerCase() == trimUrl(pageUrl));
}

/**
 * Check if the current time is within those specified in settings.
 * @param {object} settings User settings for the extension
 * @param {function} isWithinTime A boolean function
 * @returns {boolean} True if allDay is set OR (current time is past starttime AND before endtime)
 */
function isBlockedTime(settings, isWithinTime) {
  // Activation conditions
  var date = new Date();
  return (
    settings[ALLDAY_CB] ||
    (isWithinTime(settings[STARTTIME], date, TIME_CHECK_MODE.IsPast) &&
      isWithinTime(settings[ENDTIME], date, TIME_CHECK_MODE.IsBefore))
  );
}
/**
 *
 * @param {*} settings User settings for the extension
 * @returns {boolean} True if
 */
function isBlockedDay(settings) {
  var date = new Date();
  var day = date.toString().split(" ")[0].toLowerCase();
  return settings[day];
}

/**
 * contextMenus onClick listener.
 * Adds a given URL to the list of blocked sites.
 * @param {object} data onclick data
 * @param {object} tab State info for chrome Tab in which click occurred
 */
function addToBlockList(data, tab) {
  // Get the matches string from stored settings
  chrome.storage.local.get("matches", (settings) => {
    var matchString = settings["matches"];
    // ...and the URL of the current page from the onlick data
    var pageUrl = trimUrl(data.pageUrl);
    /* If URL is not in matches:
     * -- add the URL to list of matches
     * -- store the matches in storage
     * -- notify the user of success
     * Else:
     * -- notify the user of failure
     */
    if (!matchString.includes(pageUrl)) {
      matchString += "\n" + pageUrl;
      chrome.storage.local.set({ matches: matchString });
      chrome.notifications.create(NOTIF_OPTS(SUCCESS_MESSAGE.success));
    } else {
      chrome.notifications.create(NOTIF_OPTS(SUCCESS_MESSAGE.failure));
    }
  });
}

/**
 * runtime.onMessage listener.
 * Add the requested URL to set of unblocked URLs.
 * @param {object} request Message request data
 * @param {object} sender
 * @param {function} sendResponse
 */
function unblockPage(request, sender, sendResponse) {
  if (request.unblock) {
    var url = request["url"];
    // Add the URL to 'unblocked' so that the page is not blocked when returning from Time Out page
    unblocked.add(url);
    // If settings dictate revisits are allowed, add URL to 'withinTimeOut' until n-mins have passed
    chrome.storage.local.get(null, (settings) => {
      if (settings[REVISITS_CB]) {
        withinTimeOut.add(url);
        setTimeout(() => {
          withinTimeOut.delete(url);
        }, settings[REVISITS_MINS] * 60000);
      }
    });
    sendResponse({ ok: true });
  }
}
/**
 * runtime.onMessage listener.
 * Reset the setting to default and store them.
 * @param {object} request Message request data
 * @param {object} sender
 * @param {function} sendResponse
 */
function resetToDefault(request, sender, sendResponse) {
  if (request.reset) {
    chrome.storage.local.set(DEFAULT_SETTINGS);
    sendResponse(true);
  }
}

/**
 * tabs.onUpdated listener.
 * Send a message to 'block' the active tab if settings criteria are met.
 * @param {number} tabId
 * @param {object} changeInfo Lists the changes to the state of the tab that was updated.
 * @param {tab} tab State info for chrome Tab that was updated
 */
function blockPage(tabId, changeInfo, tab) {
  if (changeInfo.status == "complete") {
    chrome.storage.local.get(null, (settings) => {
      if (
        !unblocked.has(tab.url) &&
        !withinTimeOut.has(tab.url) &&
        isBlockedDay(settings) &&
        isBlockedTime(settings, isWithinTime) &&
        isBlockedUrl(settings[MATCHES], tab.url)
      ) {
        chrome.tabs.sendMessage(tabId, {
          createBlock: "true",
          url: tab.url,
        });
      } else {
        unblocked.delete(tab.url);
      }
    });
  }
}

// Chrome ------------------------------------------------------------------------------------

chrome.contextMenus.create({
  title: "Add this page to blocked list",
  contexts: ["page"],
  onclick: addToBlockList,
});

chrome.storage.local.get(DEFAULT_SETTINGS, (result) => {
  // Settings are retrieved or set to default
  chrome.storage.local.set(result);
});

chrome.storage.onChanged.addListener((changes, area) => {
  var keys = Object.keys(changes);
  if (keys.includes(REVISITS_MINS) || keys.includes(REVISITS_CB)) {
    withinTimeOut.clear();
  }
});

chrome.runtime.onMessage.addListener(unblockPage);

chrome.runtime.onMessage.addListener(resetToDefault);

chrome.tabs.onUpdated.addListener(blockPage);
