import {createRoot} from "react-dom/client";
import React, {useState} from "react";
import clsx from "clsx";
import Header from "./components/Headers/Header";
import IconAnchor from "./components/Icons/IconAnchor";
import {get} from "./modules/Utilities";
import "./App.less";
import "./less/flex.less";
import "./less/theme.less";
import "./components/Inputs/Switch.less";
import Button from "./components/Buttons/Button";
import Icon from "./components/Icons/Icon";
import useGetCurrentTab from "./hooks/useGetCurrentTab";
import useBlockList from "./hooks/useBlockListData";
import {Favicon} from "./components/ProvidersSorter/SortableItem";
import useGetOptionValue from "./hooks/useGetOptionValue";

/** Define root */
const rootElement = document.getElementById("app");
const root = createRoot(rootElement);

/** Define App */
const App = () => {
  /** Context States */
  const [currentTab, setCurrentTab] = useState({});
  useGetCurrentTab(setCurrentTab);
  const [added, setAdded] = useState(false);
  const [isBlockDomain, setIsBlockDomain] = useGetOptionValue(
    "blockDomainByDefault",
  );
  const [schedulingOn] = useGetOptionValue("scheduleBlocking");

  const { isValidSite, isBlockedSite, addToBlockList, removeFromBlockList } =
    useBlockList(currentTab, isBlockDomain);

  const handleCheckboxChange = (e) => {
    setIsBlockDomain(e.target.checked);
  };

  const NotValidWarn = <p>This page cannot be blocked</p>;
  const currentUrl = (currentTab?.url?.split(`//`) ?? [])[1]?.split("/")[0];
  return (
    <div className={clsx("app", "flex-container", "column")}>
      <Header>
        <div className={clsx("icons-group", "flex-container", "row", "center")}>
          <IconAnchor href={"options.html"} newTab type={"options"} />
        </div>
      </Header>
      {!isValidSite && NotValidWarn}
      {isValidSite && (
        <>
          {schedulingOn && (
            <p className={"scheduling-on banner"}>
              <Icon icon={"time"} />
              Scheduling is on
              <a target={"_blank"} href="options.html">
                Edit
              </a>
            </p>
          )}

          <div className={clsx("button-container")}>
            <p className={"current-url banner"}>
              <Favicon url={currentUrl} /> {currentUrl}
            </p>
            {isBlockedSite && (
              <>
                <h1>
                  <Icon type={"block"} />
                  {added
                    ? "Site added to block list"
                    : "This page is on your block list"}
                </h1>
                <Button onClick={removeFromBlockList}>Unblock this page</Button>
                {added && <Button onClick={() => {}}>Refresh site</Button>}
              </>
            )}
            {!isBlockedSite && (
              <>
                <h1>
                  <Icon type={"unblocked"} />
                  This page is not on your block list
                </h1>
                <Button
                  onClick={() => {
                    setAdded(true);
                    addToBlockList();
                  }}
                >
                  Block this page
                </Button>
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
              </>
            )}
          </div>
        </>
      )}
    </div>
  );
};

//** Get options from storage, set theme and render App  */
get(["options"], ({ options: { theme } }) => {
  const html = document.querySelector("html");
  const mode = theme.value.toLowerCase();
  html.dataset.theme = `theme-${mode}`;
  root.render(<App />);
});
