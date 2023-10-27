import clsx from "clsx";
import SortableItem from "./SortableItem";
import "./SortableSection.less";

function SortableSection(props) {
  const { id, list, openItem, setOpenItem } = props;

  return (
    <div className={clsx("sortable-section", list.length === 0 && "empty")}>
      {/*<h3 className="section-name">{name}</h3>*/}
      <ul id={id}>
        {list
          .sort((a, b) => a.hostname.localeCompare(b.hostname))
          .map((p) => (
            <SortableItem
              provider={p}
              key={p.id}
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
