chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.createBlock) {
    window.location =
      "chrome-extension://" +
      chrome.runtime.id +
      "/scripts/page_block.html?redirect=" +
      encodeURIComponent(request.url);
  }
  sendResponse(true);
});
