const startTime = "start-time";
const endTime = "end-time";
const matches = "matches";
const revisits = "revisits-checkbox";
const revisitsMins = "revisits-number";
const seconds = "seconds";
const allday = "allday-checkbox";
const timeCheckMode = {
  IsPast: {
    hours: (hour, hoursPast) => hour > hoursPast,
    minutes: (minute, minutesPast) => minute >= minutesPast,
  },
  IsBefore: {
    hours: (hour, hoursPast) => hour < hoursPast,
    minutes: (minute, minutesPast) => minute < minutesPast,
  },
};
const TOButtonHTML = "Click and hold to view contents";
const TOPopUpPageHTML =
  "Page added to <span style='font-family: georgia; font-size: 16pt'>Time Out : <span style='color: black;'>Page Blocker</span></span>";
const TOPopUpLinkHTML =
  "Link address added to <span style='font-family: georgia; font-size: 16pt'>Time Out : <span style='color: black;'>Page Blocker</span></span>";
const TOPopUpHTML = {
  page: TOPopUpPageHTML,
  link: TOPopUpLinkHTML,
};
const TOPopUpCSS = {
  "background-color": "#e32d91",
  color: "white",
  width: "100%",
  height: "50px",
  "line-height": "50px",
  "font-size": "13pt",
  display: "none",
  position: "fixed",
  "text-align": "center",
  "z-index": "9999",
  "font-weight": "400",
};
const TOBgCSS = {
  "background-image": "linear-gradient(to bottom left, black, #312)",
  position: "absolute",
  width: "100%",
  height: "100%",
  color: "white",
  "text-align": "center",
  "font-size": "16pt",
  "font-weight": "500",
};
const TOIconCSS = {
  width: "100px",
  height: "100px",
  margin: "10% 0 5% 0",
  padding: "0",
  "font-size": "inherit",
  "font-weight": "inherit",
  "text-align": "inherit",
  border: "none",
  outline: "none",
};
const TOInfoCSS = {
  "font-family": "georgia",
  display: "block",
  margin: "10% 0 0 0", //check this? 10% or 10px
  padding: "0",
  color: "inherit",
  "text-align": "inherit",
  "font-size": "inherit",
  "font-weight": "inherit",
  "line-height": "2em",
};
const TOButtonCSS = {
  position: "relative",
  display: "inline-block",
  top: "50px",
  width: "320px",
  height: "60px",
  padding: "35px 20px 0 20px",
  margin: "0",
  cursor: "pointer",
  color: "black",
  "user-select": "none",
  background: "lightgrey",
  "background-color": "lightgrey",
  "line-height": "1.1em",
  "box-shadow": "0 2px 0 0 darkgrey",
  "border-radius": "10px",
  "font-family": "helvetica",
  "font-size": "inherit",
  "font-weight": "inherit",
  "box-sizing": "content-box",
};
const TOButtonCSS_mousedown = {
  top: "51px",
  "box-shadow": "0 1px 0 0 darkgrey",
  opacity: "0.9",
};
const TOButtonCSS_mouseup = {
  top: "50px",
  "box-shadow": "0 2px 0 0 darkgrey",
  opacity: "1",
};

// START Functions -------------------------------------------------------------------------------------------------------------------------------------

function timeCheck(timeToTest, date, timeCheckMode) {
  var hour = parseInt(date.getHours());
  var minute = parseInt(date.getMinutes());
  var hoursPast = parseInt(timeToTest.substring(0, 2));
  var minutesPast = parseInt(timeToTest.substring(3, 5));
  return (
    timeCheckMode.hours(hour, hoursPast) ||
    (hour == hoursPast) & timeCheckMode.minutes(minute, minutesPast)
  );
}
function validSite(pageUrl, matchesStr) {
  return matchesStr.split("\n").some(
    (storedUrl) =>
      storedUrl.toLowerCase() ==
      pageUrl
        .substring(pageUrl.indexOf("://") + 3)
        .replace(/\/$/, "")
        .toLowerCase()
  );
}
function onMessage_popUp(request, sender, sendResponse) {
  if (request.type) {
    var TOPopUp = document.createElement("div");
    $(TOPopUp).css(TOPopUpCSS);
    TOPopUp.innerHTML = TOPopUpHTML[request.type];
    $("body").prepend(TOPopUp);
    $(TOPopUp).slideDown(1000).delay(3000).slideUp(1000);
    sendResponse(true);
  } else {
    sendResponse(false);
  }
}

// END Functions --------------------------------------------------------------------------------------------------------------------------------------------

// START Chrome  --------------------------------------------------------------------------------------------------------------------------------------------

chrome.runtime.onMessage.addListener(onMessage_popUp);

chrome.storage.local.get(null, function (result) {
  // Activation conditions
  var date = new Date();
  var day = date.toString().split(" ")[0].toLowerCase();
  var validDay = result[day];
  var validTime =
    result[allday] ||
    (timeCheck(result[startTime], date, timeCheckMode.IsPast) &&
      timeCheck(result[endTime], date, timeCheckMode.IsBefore));
  var allowRevisit =
    result[revisits] &&
    Date.now() - result[location.href] < result[revisitsMins] * 60000;

  if (
    validDay &&
    validTime &&
    validSite(location.href, result[matches]) &&
    !allowRevisit
  ) {
    // Initialise timer ----------------------------------------------------------------------------------
    var timerInit = result[seconds];
    var timer = timerInit;

    // Create elements ------------------------------------------------------------------------------------
    var TOButton = document.createElement("div");
    var TOBg = document.createElement("div");
    var TOInfo = document.createElement("div");
    var TOIcon = new Image();

    // Set properties -------------------------------------------------------------------------------------
    TOInfo.innerHTML = `This page is being blocked by <span style="font-weight: 800;">Time Out : Page Blocker</span>.<br>
    You will need to hold the button for ${timer} seconds to view the page.`;
    TOButton.innerHTML = TOButtonHTML;
    TOIcon.src = icon100_src;

    // Set styles ---------------------------------------------------------------------------------------------
    $(TOBg).css(TOBgCSS);
    $(TOIcon).css(TOIconCSS);
    $(TOInfo).css(TOInfoCSS);
    $(TOButton).css(TOButtonCSS);

    // Event handling -------------------------------------------------------------------------------------
    var pressedDown = false;
    var tickInterval;
    var btnTimeout;

    $(TOButton)
      .bind("contextmenu", function (e) {
        return false;
      })
      .on("mousedown", function (e) {
        pressedDown = true;
        $(this).text(`Hold for ${timer} seconds...`);
        tickInterval = setInterval(function () {
          timer--;
          $(TOButton).text(`Hold for ${timer} seconds...`);
        }, 1000);
        btnTimeout = setTimeout(function () {
          if (pressedDown) {
            chrome.storage.local.set({ [location.href]: Date.now() }); // siteKey: timestamp
            $(TOBg).hide();
            $("body").show();
          }
        }, timer * 1000);
        $(this).css(TOButtonCSS_mousedown);
      });
    TOBg.addEventListener("mouseup", function (event) {
      $(TOButton).stop(true, true);
      $(TOButton).css(TOButtonCSS_mouseup);
      $(TOButton).text(TOButtonHTML);
      clearInterval(tickInterval);
      clearTimeout(btnTimeout);
      pressedDown = false;
      timer = timerInit;
    });

    // DOM Manipulation

    $("body").hide();
    $(TOIcon).appendTo(TOBg);
    $(TOInfo).appendTo(TOBg);
    $(TOButton).appendTo(TOBg);
    $(TOBg).appendTo("html").show();
  }
});

// END Chrome    --------------------------------------------------------------------------------------------------------------------------------------------

chrome.runtime.onMessage.addListener(onMessage_createBlock);

function isValid(result, validSite) {
  // Activation conditions
  var date = new Date();
  var day = date.toString().split(" ")[0].toLowerCase();
  var validDay = result[day];
  var validTime =
    result[allday] ||
    (timeCheck(result[startTime], date, timeCheckMode.IsPast) &&
      timeCheck(result[endTime], date, timeCheckMode.IsBefore));
  var allowRevisit =
    result[revisits] &&
    Date.now() - result[location.href] < result[revisitsMins] * 60000;

  return;
  validDay &&
    validTime &&
    validSite(location.href, result[matches]) &&
    !allowRevisit;
}

function onMessage_createBlock(request, sender, sendResponse) {
  if (request.createBlock) {
    // Initialise timer
    var timerInit = request.seconds;
    var timer = timerInit;
    // Create elements
    var TOButton = document.createElement("div");
    var TOBg = document.createElement("div");
    var TOInfo = document.createElement("div");
    var TOIcon = new Image();
    // Set properties
    TOInfo.innerHTML = `This page is being blocked by <span style="font-weight: 800;">Time Out : Page Blocker</span>.<br>
    You will need to hold the button for ${timer} seconds to view the page.`;
    TOButton.innerHTML = TOButtonHTML;
    TOIcon.src = icon100_src;
    // Set styles
    $(TOBg).css(TOBgCSS);
    $(TOIcon).css(TOIconCSS);
    $(TOInfo).css(TOInfoCSS);
    $(TOButton).css(TOButtonCSS);
    // Event handling
    var pressedDown = false;
    var tickInterval;
    var btnTimeout;
    $(TOButton)
      .bind("contextmenu", function (e) {
        return false;
      })
      .on("mousedown", function (e) {
        pressedDown = true;
        $(this).text(`Hold for ${timer} seconds...`);
        tickInterval = setInterval(function () {
          timer--;
          $(TOButton).text(`Hold for ${timer} seconds...`);
        }, 1000);
        btnTimeout = setTimeout(function () {
          if (pressedDown) {
            chrome.storage.local.set({ [location.href]: Date.now() }); // siteKey: timestamp
            $(TOBg).hide();
            $("body").show();
          }
        }, timer * 1000);
        $(this).css(TOButtonCSS_mousedown);
      });
    TOBg.addEventListener("mouseup", function (event) {
      $(TOButton).stop(true, true);
      $(TOButton).css(TOButtonCSS_mouseup);
      $(TOButton).text(TOButtonHTML);
      clearInterval(tickInterval);
      clearTimeout(btnTimeout);
      pressedDown = false;
      timer = timerInit;
    });
    // DOM Manipulation
    $("body").hide();
    $(TOIcon).appendTo(TOBg);
    $(TOInfo).appendTo(TOBg);
    $(TOButton).appendTo(TOBg);
    $(TOBg).appendTo("html").show();
    sendResponse(true);
  } else {
    sendResponse(false);
  }
}
