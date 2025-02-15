import { createRoot } from "react-dom/client";

import "./PageBlock.less";
import "./less/theme.less";
import useApplyTheme from "./hooks/useApplyTheme";
import MarkdownMapper from "./components/Markdown/MarkdownMapper";
import { update_v2_1_0 } from "./content/information";
import Header from "./components/Headers/Header";
import Icon from "./components/Icons/Icon";

/** Define root */
const rootElement = document.getElementById("update");
const root = createRoot(rootElement);

const Update = () => {
  useApplyTheme({}, "dark");
  return (
    <>
      <Header />
      <div className={"content update-content"}>
        <Icon type={"update"} />
        <MarkdownMapper
          classes={["flex-container", "width-100", "column", "info-tab"]}
          mdArray={update_v2_1_0}
        />
      </div>
    </>
  );
};

//** Render options page */
root.render(<Update />);
