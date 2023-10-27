import { useEffect, useState } from "react";
import { createUniqueId, get, sanitize, set } from "../modules/Utilities";

export const getBlockListAdders = (url) => {
  const domain = sanitize(url?.split("/")[0]);
  const addPageToBlockList = (callback) => {
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
        callback();
        return;
      }
      alert("Site is already on block list!");
    });
  };
  const addDomainToBlockList = (callback) => {
    get(["providers"], ({ providers }) => {
      const uniqueId = createUniqueId();
      const obj = {
        id: uniqueId,
        hostname: domain,
        isByPath: true,
        dateAdded: new Date(Date.now()).toLocaleString(),
      };
      const matches = providers.filter(
        (item) => item.hostname === obj.hostname,
      );
      if (matches.length === 0) {
        set({ providers: [...providers, obj] });
        callback();
        return;
      }
      alert("Site is already on block list!");
    });
  };

  return { addPageToBlockList, addDomainToBlockList };
};

const useBlockList = (currentTab) => {
  const [protocol, url] = currentTab?.url?.split(`//`) ?? [];
  const isValidSite = ["http:", "https:"].some(
    (prt) => prt === protocol?.toLowerCase(),
  );

  const [isBlockedSite, setIsBlockedSite] = useState(false);

  const { addPageToBlockList, addDomainToBlockList } = getBlockListAdders(url);

  useEffect(() => {
    get(["providers"], ({ providers }) => {
      onBlockListChange({ newValue: providers });
    });
  }, [url]);

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

  const onStorageChange = (changes) => {
    if (
      Object.keys(changes["providers"]?.newValue ?? {})?.length ||
      Object.keys(changes["providers"]?.oldValue ?? {})?.length
    ) {
      onBlockListChange(changes["providers"]);
    }
  };

  useEffect(() => {
    if (url) {
      chrome.storage.onChanged.removeListener(onStorageChange);
      chrome.storage.onChanged.addListener(onStorageChange);
    }
  }, [url]);

  return {
    isValidSite,
    isBlockedSite,
    addPageToBlockList,
    addDomainToBlockList,
  };
};
export default useBlockList;
