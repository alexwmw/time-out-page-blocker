import { useEffect } from "react";

const getCurrentTab = async (setTab) => {
  const [tab] = await chrome.tabs.query({
    active: true,
    lastFocusedWindow: true,
  });
  setTab(tab);
};

const useGetCurrentTab = (setTab, deps = []) => {
  useEffect(() => {
    getCurrentTab(setTab);
  }, [setTab, ...deps]);
};

export default useGetCurrentTab;
