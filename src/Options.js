import { createRoot } from "react-dom/client";
import { useState, useReducer } from "react";
import tabs from "./data/tabs.json";
import TabContainer from "./components/Tabs/TabContainer";
import ToastsContainer from "./components/Modals/ToastsContainer";
import OptionsContainer from "./components/Options/OptionsContainer";
import Header from "./components/Headers/Header";
import Card from "./components/Cards/Card";
import ChromeContext from "./contexts/ChromeContext";
import { ToastsContext, ToastsReducer } from "./reducers/ToastsReducer";
import ChromeDispatcher from "./modules/ChromeDispatcher";
import { clear } from "./modules/Utilities";
import "./App.less";
import "./Options.less";
import "./less/flex.less";
import "./less/theme.less";
import useApplyTheme from "./hooks/useApplyTheme";
import useGetOptions from "./hooks/useGetOptions";
import Spinner from "./components/Spinner/Spinner";

const devOptions = {
  resetOptions: true,
};

/** Define root */
const rootElement = document.getElementById("options");
const root = createRoot(rootElement);

if (devOptions.resetOptions) {
  clear();
}

const Options = () => {
  const [toasts, dispatchToasts] = useReducer(ToastsReducer, []);
  const [options, setOptions] = useGetOptions(devOptions, () =>
    dispatchToasts({ type: "SETTING_UPDATED" }),
  );

  const hasTheme = useApplyTheme(options);

  /** Define tabs */
  const defaultTab = tabs.search;
  const [selectedTab, setSelectedTab] = useState(defaultTab);

  /** Custom dispatcher */
  const dispatchChrome = ChromeDispatcher;

  if (!hasTheme || !options || Object.keys(options).length === 0) {
    return <Spinner type={"fullScreen"} />;
  }
  return (
    <ChromeContext.Provider value={{ options, dispatchChrome }}>
      <ToastsContext.Provider value={{ toasts, dispatchToasts }}>
        <div className={"options flex-container column"}>
          <ToastsContainer position={"right"} />
          <Header />
          <div className="main-content flex-container row">
            <div className="tabs-column">
              <h1>Options</h1>
              <Card>
                <TabContainer
                  tabs={tabs}
                  selectedTab={selectedTab}
                  onTabSelect={(tabId) => setSelectedTab(tabs[tabId])}
                />
              </Card>
            </div>
            <div className="main-column">
              {options && (
                <OptionsContainer selectedTab={selectedTab} tabs={tabs} />
              )}
            </div>
          </div>
        </div>
      </ToastsContext.Provider>
    </ChromeContext.Provider>
  );
};

//** Render options page */
root.render(<Options />);