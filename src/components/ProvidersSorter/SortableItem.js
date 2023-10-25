import clsx from "clsx";
import ProviderForm from "../Forms/ProviderForm";
import IconTrigger from "../Icons/IconTrigger";
import "./SortableItem.less";
import Img from "../Images/Img";
import useExpanded from "../../hooks/useExpanded";
import { useContext, useEffect, useState } from "react";
import ChromeContext from "../../contexts/ChromeContext";
import AlertsContext from "../../contexts/AlertsContext";

export const Favicon = ({ url, provider, className }) => {
  const faviconUrl = `https://www.google.com/s2/favicons?sz=64&domain_url=${
    url ? url : provider.hostname
  }`;
  return <Img className={className} src={faviconUrl}></Img>;
};

function SortableItem({ provider, openItem, setOpenItem }) {
  /** State and local data */
  const [isByPath, setIsByPath] = useState(provider.isByPath ?? false);
  const [isScheduled] = useState(false);
  const { dispatchChrome } = useContext(ChromeContext);
  const alertHandler = useContext(AlertsContext);

  const deleteHandler = (e) => {
    e.preventDefault();

    alertHandler.confirm({
      title: "Confirm delete",
      question: `Are you sure you want to delete the item?`,
      onProceed: () =>
        dispatchChrome({
          type: "DELETE_PROVIDER",
          provider: provider,
        }),
    });
  };

  const handleTogglePath = (e) => {
    setIsByPath(e.target.checked);
  };

  useEffect(() => {
    dispatchChrome({
      type: "UPDATE_PROVIDER",
      provider: {
        ...provider,
        isByPath,
      },
    });
  }, [isByPath]);

  return (
    <li
      data-id={provider.id}
      className={clsx("sortable-item")}
      onClick={(e) => setOpenItem(provider.id)}
      onDragStart={(e) => setOpenItem(null)}
    >
      <div className={"li-header"}>
        <Favicon className="li-favicon" provider={provider}></Favicon>
        <div className="li-provider-name">
          <p>{provider.hostname}</p>
        </div>
        <div className={"li-button-group"}>
          <IconTrigger
            className={clsx("li-btn")}
            onClick={deleteHandler}
            type={"delete"}
          />

          {/*<IconTrigger*/}
          {/*  className={clsx(*/}
          {/*    "li-btn",*/}
          {/*    isScheduled ? "on" : "off",*/}
          {/*    isExpanded && "expanded",*/}
          {/*  )}*/}
          {/*  onClick={toggleExpanded}*/}
          {/*  type={!isExpanded ? "edit" : "collapse"}*/}
          {/*/>*/}
        </div>
      </div>
      <label className={clsx("switch-row", isByPath && "by-path")}>
        <label className={"switch"}>
          <input
            checked={isByPath}
            onChange={handleTogglePath}
            type={"checkbox"}
          />
          <div className={"handle"} />
        </label>
        <span>Block subpages</span>
      </label>
    </li>
  );
}

export default SortableItem;
