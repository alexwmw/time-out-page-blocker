import clsx from "clsx";
import ProviderForm from "../Forms/ProviderForm";
import IconTrigger from "../Icons/IconTrigger";
import "./SortableItem.less";
import Img from "../Images/Img";
import useExpanded from "../../hooks/useExpanded";
import { useContext, useState } from "react";
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
  const [isExpanded, setIsExpanded] = useExpanded(provider, openItem);
  const [isScheduled, setIsScheduled] = useState(null);
  const { dispatchChrome } = useContext(ChromeContext);
  const alertHandler = useContext(AlertsContext);

  const toggleExpanded = () => {
    setIsExpanded((expanded) => !expanded);
  };

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

  const switchHandler = (e) => {
    e.preventDefault();
    const type = provider.type == "Domain" ? "Web page" : "Domain";
    const hostname = provider.hostname.split("/")[0];
    const onProceed = () =>
      dispatchChrome({
        type: "UPDATE_PROVIDER",
        provider: { ...provider, hostname, type },
      });

    if (type === "Domain" && hostname !== provider.hostname) {
      alertHandler.confirm({
        title: "Change block type",
        question: `Are you sure you want to change this entry type from 'web page' to 'domain'? Details of the specific web page will be lost.`,
        onProceed,
      });
      return;
    }
    onProceed();
  };

  return (
    <li
      data-id={provider.id}
      className={clsx("sortable-item", isExpanded && ["expanded"])}
      onClick={(e) => setOpenItem(provider.id)}
      onDragStart={(e) => setOpenItem(null)}
    >
      <div className={"li-header"}>
        <Favicon className="li-favicon" provider={provider}></Favicon>
        <div className="li-provider-name">
          <p>{provider.hostname}</p>
          <p>{provider.type ?? "Domain"}</p>
        </div>
        <div className={"li-button-group"}>
          <IconTrigger
            className={clsx("li-btn")}
            onClick={switchHandler}
            title={"Swap between domain and webpage"}
            type={"swap"}
          />
          {isScheduled !== null && (
            <IconTrigger
              className={clsx(
                "li-btn",
                isScheduled ? "on" : "off",
                isExpanded && "expanded",
              )}
              onClick={toggleExpanded}
              type={!isExpanded ? "time" : "collapse"}
            />
          )}
          {!isExpanded && (
            <IconTrigger
              className={clsx("li-btn")}
              onClick={deleteHandler}
              type={"delete"}
            />
          )}
        </div>
      </div>
      {isExpanded && (
        <ProviderForm
          provider={provider}
          closeForm={() => setIsExpanded(false)}
        />
      )}
    </li>
  );
}

export default SortableItem;
