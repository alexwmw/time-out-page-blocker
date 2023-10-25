import clsx from "clsx";
import OptionRows from "./OptionsRows";
import information from "../../content/information.js";
import MarkdownMapper from "../Markdown/MarkdownMapper";
import ProvidersSorter from "../ProvidersSorter/ProvidersSorter";
import "./OptionsContainer.less";
import HelpIcon from "../Tooltips/HelpIcon";

function OptionsContainer(props) {
  const isInfoTab = props.selectedTab === props.tabs.info;
  const isSearchTab = props.selectedTab === props.tabs.search;
  const isOptionsTab = props.selectedTab.isOptionsTab;

  return (
    <div className={clsx("flex-container", "page", "options-container")}>
      <div
        className={clsx(
          "flex-container",
          "row",
          "center",
          "options-title-area",
        )}
      >
        <h2>{props.selectedTab.nameLong ?? props.selectedTab.name} </h2>
        {isSearchTab && <HelpIcon />}
      </div>
      <div
        className={clsx("flex-container", "page", "options-container-inner")}
      >
        {isSearchTab && (
          <div className="providers-page-wrap">
            <ProvidersSorter />
          </div>
        )}
        {isOptionsTab && <OptionRows selectedTab={props.selectedTab} />}
        {isInfoTab && (
          <MarkdownMapper
            classes={["flex-container", "width-100", "column", "info-tab"]}
            mdArray={information}
          />
        )}
      </div>
    </div>
  );
}

export default OptionsContainer;
