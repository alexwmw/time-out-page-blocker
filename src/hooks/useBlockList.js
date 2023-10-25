import { useEffect, useState } from "react";
import { createUniqueId, get, sanitize, set } from "../modules/Utilities";

const useBlockList = (currentTab, blockDomain) => {
  const [protocol, url] = currentTab?.url?.split(`//`) ?? [];
  const isValidSite = ["http:", "https:"].some(
    (prt) => prt === protocol?.toLowerCase(),
  );
  const domain = sanitize(url?.split("/")[0]);
  const [isBlockedSite, setIsBlockedSite] = useState(false);

  console.log(url);

  useEffect(() => {
    get(["providers"], ({ providers }) => {
      onBlockListChange({ newValue: providers });
    });
  }, [domain, url]);

  const addToBlockList = () => {
    get(["providers"], ({ providers }) => {
      const uniqueId = createUniqueId();
      const obj = {
        id: uniqueId,
        hostname: blockDomain ? domain : sanitize(url),
        type: blockDomain ? "Domain" : "Web page",
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

  const removeFromBlockList = () => {
    get(["providers"], ({ providers }) => {
      const filteredList = providers.filter((item) => {
        if (item.type === "Domain") {
          return !item.hostname === domain;
        }
        if (item.type === "Web page" || item.type === "Webpage") {
          return !item.hostname === sanitize(url) || !item.hostname === url;
        }
        throw Error("Unknown blockList item type");
      });
      set({ providers: filteredList });
    });
  };

  function onBlockListChange({ newValue }) {
    setIsBlockedSite(
      newValue?.some((item) => {
        return (
          (item.type === "Domain" && item.hostname === domain) ||
          item.hostname === sanitize(url)
        );
      }),
    );
  }

  const onStorageChange = (changes, namespace) => {
    if (
      Object.keys(changes["providers"]?.newValue)?.length ||
      Object.keys(changes["providers"]?.oldValue)?.length
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

  return { isValidSite, isBlockedSite, addToBlockList, removeFromBlockList };
};
export default useBlockList;
