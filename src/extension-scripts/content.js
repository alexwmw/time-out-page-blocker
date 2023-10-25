import { getAsync, sanitize } from "../modules/Utilities";

(async function () {
  const { providers } = await getAsync("providers");
  const { options } = await getAsync("options");
  const hostname = window.location.hostname;
  const url = sanitize(window.location.href.split("://")[1]);

  console.log(url);

  const matches = providers.filter(
    (provider) =>
      (provider.type === "Web page" && provider.hostname === url) ||
      (provider.type === "Domain" && provider.hostname === hostname),
  );

  const redirect = `chrome-extension://${
    chrome.runtime.id
  }/page-block.html?redirect=${encodeURIComponent(url)}&id=${matches[0]?.id}`;

  if (!matches[0] || matches[0].unblocked) {
    return;
  }
  window.location = redirect;
})();
