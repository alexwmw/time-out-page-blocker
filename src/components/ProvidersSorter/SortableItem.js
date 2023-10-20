import { useEffect, useState } from "react";
import clsx from "clsx";
import ProviderForm from "../Forms/ProviderForm";
import Icon from "../Icons/Icon";
import IconTrigger from "../Icons/IconTrigger";
import "./SortableItem.less";
import Img from "../Images/Img";

function SortableItem({ provider, openItem, setOpenItem }) {
  /** State and local data */
  const [isExpanded, setIsExpanded] = useState(false);

  const faviconUrl = `https://www.google.com/s2/favicons?sz=64&domain_url=${provider.hostname}`;

  const toggleExpanded = () => {
    setIsExpanded((expanded) => !expanded);
  };

  useEffect(() => {
    if (document.getElementsByClassName("expanded").length > 0) {
      document.body.classList.add("expanded-open");
    } else {
      document.body.classList.remove("expanded-open");
    }
  }, [isExpanded]);

  useEffect(() => {
    if (openItem !== provider.name) {
      setIsExpanded(false);
    }
  }, [openItem]);

  /** on Unmount  */
  useEffect(() => () => {
    document.body.classList.remove("expanded-open");
  });

  return (
    <li
      data-id={provider.name}
      className={clsx("sortable-item", isExpanded && ["expanded"])}
      onClick={(e) => setOpenItem(provider.name)}
      onDragStart={(e) => setOpenItem(null)}
    >
      <div className={"li-header"}>
        <Img className="li-favicon" src={faviconUrl}></Img>
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
        ></ProviderForm>
      )}
    </li>
  );
}

export default SortableItem;
