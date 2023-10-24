import { useEffect, useState } from "react";
import useChromeGet from "./useChromeGet";
import { get, set } from "../modules/Utilities";

// const getBlockList = async (setBlockList) => {
//   const blockList = getAsync(["providers"]);
//   setBlockList(blockList);
// };
//
// const useGetBlockList = (setBlockList, deps = []) => {
//   useEffect(() => {
//     getBlockList(setBlockList);
//   }, [setBlockList, ...deps]);
// };

const useBlockList = (currentTab, blockDomain) => {
  const [protocol, url] = currentTab?.url?.split(`//`) ?? [];
  const isValidSite = ["http:", "https:"].some(
    (prt) => prt === protocol?.toLowerCase(),
  );
  const domain = url?.split("/")[0];
  const [isBlockedSite, setIsBlockedSite] = useState(false);

  useEffect(() => {
    get(["providers"], ({ providers }) => {
      onBlockListChange({ newValue: providers });
    });
  }, [domain, url]);

  const addToBlockList = () => {
    get(["providers"], ({ providers }) => {
      const obj = {
        name: blockDomain ? domain : url,
        hostname: blockDomain ? domain : url,
        type: blockDomain ? "Domain" : "Web page",
      };
      if (providers?.some((item) => item.name === obj.name)) {
        alert("Site is already on block list!");
        return;
      }
      set({ providers: [...providers, obj] });
    });
  };

  const removeFromBlockList = () => {
    get(["providers"], ({ providers }) => {
      const filteredList = providers.filter((item) => {
        if (item.type === "Domain") {
          return !item.name === domain;
        }
        if (item.type === "Web page" || item.type === "Webpage") {
          return !item.name === url;
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
          (item.type === "Domain" && item.name === domain) ||
          (item.type === "Web page" && item.name === url)
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
