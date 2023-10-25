import { createRoot } from "react-dom/client";
import { useState } from "react";
import clsx from "clsx";
import Header from "./components/Headers/Header";
import IconAnchor from "./components/Icons/IconAnchor";
import { get, sanitize } from "./modules/Utilities";
import "./App.less";
import "./less/flex.less";
import "./less/theme.less";
import "./components/Inputs/Switch.less";
import Button from "./components/Buttons/Button";
import Icon from "./components/Icons/Icon";
import useGetCurrentTab from "./hooks/useGetCurrentTab";
import useBlockList from "./hooks/useBlockList";
import { Favicon } from "./components/ProvidersSorter/SortableItem";
import useGetOptionValue from "./hooks/useGetOptionValue";
import useGetPredicates from "./hooks/useGetPredicates";

const ToggleRow = ({ isBlockDomain, handleCheckboxChange }) => {
  return (
    <div className={"toggle-row"}>
      <span>Block by:</span>
      <span>
        <p>Page</p>
        <label className={"switch"}>
          <input
            type={"checkbox"}
            checked={isBlockDomain ?? false}
            onChange={handleCheckboxChange}
          />
          <span className="handle notBool"></span>
        </label>
        <p>Domain</p>
      </span>
    </div>
  );
};

const NotValidSiteContent = () => {
  return (
    <div className={clsx("button-container")}>
      <h1>
        <Icon type={"stop"} />
        This page cannot be blocked
      </h1>
      <Button onClick={() => window.open("options.html")}>
        Go to settings
      </Button>
    </div>
  );
};

const Banners = ({ isScheduled, isBlockingDay, isBlockingTime }) => {
  if (isScheduled && (!isBlockingDay || !isBlockingTime))
    return (
      <p className={"scheduling-on banner warn"}>
        <Icon icon={"time"} />
        Outside scheduled time
        <a target={"_blank"} href="options.html?tab=scheduling">
          Edit
        </a>
      </p>
    );
  if (isScheduled && isBlockingDay && isBlockingTime)
    return (
      <p className={"scheduling-on banner"}>
        <Icon icon={"time"} />
        Scheduling is on
        <a target={"_blank"} href="options.html?tab=scheduling">
          Edit
        </a>
      </p>
    );
  return <></>;
};

const App = () => {
  const [currentTab, setCurrentTab] = useState({});
  useGetCurrentTab(setCurrentTab);
  const [added, setAdded] = useState(false);
  const [isByPath, setIsBlockDomain] = useGetOptionValue(
    "blockDomainByDefault",
  );
  const predicates = useGetPredicates();
  const {
    isValidSite,
    isBlockedSite,
    addPageToBlockList,
    addDomainToBlockList,
  } = useBlockList(currentTab, isByPath);
  const handleCheckboxChange = (e) => {
    setIsBlockDomain(e.target.checked);
  };
  const refreshTab = () => {
    chrome.tabs.reload(currentTab.id);
  };
  const currentPage = sanitize((currentTab?.url?.split(`//`) ?? [])[1]);
  const currentDomain = (currentTab?.url?.split(`//`) ?? [])[1]?.split("/")[0];

  return (
    <div className={clsx("app", "flex-container", "column")}>
      <Header>
        <div className={clsx("icons-group", "flex-container", "row", "center")}>
          <IconAnchor href={"options.html"} newTab type={"options"} />
        </div>
      </Header>
      <Banners {...predicates} />
      {!isValidSite && <NotValidSiteContent />}
      {isValidSite && (
        <div className={clsx("button-container")}>
          <p className={"current-url banner"}>
            <Favicon url={currentDomain} /> {currentDomain}
          </p>
          {isBlockedSite && (
            <>
              <h1>
                <Icon type={"block"} />
                {added
                  ? "Site added to block list"
                  : "This page is on your block list"}
              </h1>
              {!added && (
                <Button onClick={() => window.open("options.html")}>
                  Manage block list
                </Button>
              )}
              {added && <Button onClick={refreshTab}>Refresh site</Button>}
            </>
          )}
          {!isBlockedSite && (
            <>
              <h1>
                <Icon type={"unblocked"} />
                This page is not on your block list
              </h1>
              {currentPage !== currentDomain && (
                <Button
                  onClick={() => {
                    setAdded(true);
                    addPageToBlockList();
                  }}
                >
                  <span>Block {currentPage}</span>
                </Button>
              )}
              <Button
                onClick={() => {
                  setAdded(true);
                  addDomainToBlockList();
                }}
              >
                <span>Block {currentDomain}</span>
              </Button>
              <a target="_blank" href={"options.html"}>
                Manage block list
              </a>
            </>
          )}
        </div>
      )}
    </div>
  );
};

/** Define root */
const rootElement = document.getElementById("app");
const root = createRoot(rootElement);
/** Get options from storage, set theme and render App  */
get(["options"], ({ options: { theme } }) => {
  const html = document.querySelector("html");
  const mode = theme.value.toLowerCase();
  html.dataset.theme = `theme-${mode}`;
  root.render(<App />);
});
