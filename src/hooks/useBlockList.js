import { useEffect, useState } from "react";
import { createUniqueId, get, sanitize, set } from "../modules/Utilities";

const useBlockList = (currentTab, isByPath) => {
  const [protocol, url] = currentTab?.url?.split(`//`) ?? [];
  const isValidSite = ["http:", "https:"].some(
    (prt) => prt === protocol?.toLowerCase(),
  );
  const domain = sanitize(url?.split("/")[0]);
  const [isBlockedSite, setIsBlockedSite] = useState(false);

  useEffect(() => {
    get(["providers"], ({ providers }) => {
      onBlockListChange({ newValue: providers });
    });
  }, [domain, url]);

  const addPageToBlockList = () => {
    get(["providers"], ({ providers }) => {
      const uniqueId = createUniqueId();
      const obj = {
        id: uniqueId,
        hostname: sanitize(url),
        isByPath,
        dateAdded: new Date(Date.now()).toLocaleString(),
      };
      const matches = providers.filter(
        (item) => item.hostname === obj.hostname,
      );
      if (matches.length === 0) {
        set({ providers: [...providers, obj] });
        return;
      }
      alert("Site is already on block list!");
    });
  };
  const addDomainToBlockList = () => {
    get(["providers"], ({ providers }) => {
      const uniqueId = createUniqueId();
      const obj = {
        id: uniqueId,
        hostname: domain,
        isByPath,
        dateAdded: new Date(Date.now()).toLocaleString(),
      };
      const matches = providers.filter(
        (item) => item.hostname === obj.hostname,
      );
      if (matches.length === 0) {
        set({ providers: [...providers, obj] });
        return;
      }
      alert("Site is already on block list!");
    });
  };

  function onBlockListChange({ newValue }) {
    setIsBlockedSite(
      newValue?.some((item) => {
        console.log({ ...item, url });
        return (
          (item.isByPath && url?.startsWith(item.hostname)) ||
          item.hostname === sanitize(url)
        );
      }),
    );
  }

  const onStorageChange = (changes, namespace) => {
    if (
      Object.keys(changes["providers"]?.newValue ?? {})?.length ||
      Object.keys(changes["providers"]?.oldValue ?? {})?.length
    ) {
      onBlockListChange(changes["providers"]);
    }
  };

  useEffect(() => {
    if (domain && url) {
      chrome.storage.onChanged.removeListener(onStorageChange);
      chrome.storage.onChanged.addListener(onStorageChange);
    }
  }, [domain, url]);

  return {
    isValidSite,
    isBlockedSite,
    addPageToBlockList,
    addDomainToBlockList,
  };
};
export default useBlockList;
