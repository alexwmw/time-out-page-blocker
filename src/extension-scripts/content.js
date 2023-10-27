import { getAsync, getBlockPredicates, sanitize } from "../modules/Utilities";

(async function () {
  const { providers, options } = await getAsync(["providers", "options"]);
  const url = sanitize(window.location.href.split("://")[1]);
  const { isScheduled, isBlockingDay, isBlockingTime } =
    getBlockPredicates(options);

  const matches = providers.filter((provider) => {
    return (
      (provider.isByPath && url?.startsWith(provider.hostname)) ||
      provider.hostname === url
    );
  });

  const redirect = `chrome-extension://${
    chrome.runtime.id
  }/page-block.html?redirect=${encodeURIComponent(url)}&id=${matches[0]?.id}`;

  if (!matches[0]) {
    chrome.runtime.sendMessage({ action: "Enable context menu" });
    return;
  }
  if (matches.some((match) => match.unblocked)) {
    chrome.runtime.sendMessage({ action: "Disable context menu" });
    return;
  }

  if (!isScheduled || (isBlockingDay && isBlockingTime)) {
    window.location.assign(redirect);
  } else {
    chrome.runtime.sendMessage({ action: "Disable context menu" });
  }
})();
