import { useEffect, useState } from "react";
import clsx from "clsx";
import SortableSection from "./SortableSection";
import ChromeContext from "../../contexts/ChromeContext";
import ChromeDispatcher from "../../modules/ChromeDispatcher";
import useChromeGet from "../../hooks/useChromeGet";
import AlertsContext from "../../contexts/AlertsContext";
import useAlerts from "../../hooks/useAlerts";

const ProvidersSorter = (props) => {
  /** State and contexts */
  const [openItem, setOpenItem] = useState(null);
  const [providers, setProviders] = useState([]);
  const { alertHandler, AlertProvider } = useAlerts();
  const areItems = providers.length > 0;

  const dispatchChrome = ChromeDispatcher;

  /** Get providers on first render */
  useChromeGet(
    (result) => {
      setProviders(result.providers);
    },
    ["providers"],
  );

  const onStorageChange = (changes, namespace) => {
    if (
      Object.keys(changes["providers"]?.newValue ?? {})?.length ||
      Object.keys(changes["providers"]?.oldValue ?? {})?.length
    ) {
      setProviders(changes["providers"]?.newValue);
    }
  };

  useEffect(() => {
    chrome.storage.onChanged.removeListener(onStorageChange);
    chrome.storage.onChanged.addListener(onStorageChange);
  }, []);

  return (
    <>
      <AlertProvider />
      <div className="page-container">
        <div
          className={clsx("flex-container", "page")}
          id={"providersPage"}
          direction={"column"}
        >
          {props.children}

          <AlertsContext.Provider value={alertHandler}>
            <ChromeContext.Provider value={{ providers, dispatchChrome }}>
              <SortableSection
                openItem={openItem}
                setOpenItem={setOpenItem}
                id={"hidden"}
                name={"Blocked pages"}
                list={providers}
              />
            </ChromeContext.Provider>
          </AlertsContext.Provider>
        </div>
      </div>
    </>
  );
};

export default ProvidersSorter;
