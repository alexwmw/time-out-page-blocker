import clsx from "clsx";
import ProviderForm from "../Forms/ProviderForm";
import IconTrigger from "../Icons/IconTrigger";
import "./SortableItem.less";
import Img from "../Images/Img";
import useExpanded from "../../hooks/useExpanded";

export const Favicon = ({ url, provider, className }) => {
  const faviconUrl = `https://www.google.com/s2/favicons?sz=64&domain_url=${
    url ? `http://${url}` : provider.hostname
  }`;
  return <Img className={className} src={faviconUrl}></Img>;
};

function SortableItem({ provider, openItem, setOpenItem }) {
  /** State and local data */
  const [isExpanded, setIsExpanded] = useExpanded(provider, openItem);

  const toggleExpanded = () => {
    setIsExpanded((expanded) => !expanded);
  };

  return (
    <li
      data-id={provider.name}
      className={clsx("sortable-item", isExpanded && ["expanded"])}
      onClick={(e) => setOpenItem(provider.name)}
      onDragStart={(e) => setOpenItem(null)}
    >
      <div className={"li-header"}>
        <Favicon className="li-favicon" provider={provider}></Favicon>
        <div className="li-provider-name">
          <p>{provider.name}</p>
          <p>{provider.type ?? "Domain"}</p>
        </div>
        <IconTrigger
          className={clsx("li-expand-btn")}
          onClick={toggleExpanded}
          type={!isExpanded ? "edit" : "collapse"}
        />
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
