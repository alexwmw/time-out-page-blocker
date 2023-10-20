import clsx from "clsx";

import { ReactSortable } from "react-sortablejs";
import SortableItem from "./SortableItem";
import "./SortableSection.less";

function SortableSection(props) {
  const { name, id, list, openItem, setOpenItem } = props;

  return (
    <div className={clsx("sortable-section", list.length == 0 && "empty")}>
      <h3 className="section-name">{name}</h3>
      <ul id={id}>
        {list.map((p) => (
          <SortableItem
            provider={p}
            key={p.name}
            type={p.type ?? "Domain"}
            openItem={openItem}
            setOpenItem={setOpenItem}
          ></SortableItem>
        ))}
      </ul>
    </div>
  );
}

export default SortableSection;
