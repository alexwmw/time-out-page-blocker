import { useContext, useState, useEffect, useRef } from "react";
import ChromeContext from "../../contexts/ChromeContext";
import "./Switch.less";
import clsx from "clsx";

const MiniSwitch = ({ checked, onChange, disabled }) => {
  const ref = useRef();
  return (
    <input
      ref={ref}
      type={"checkbox"}
      checked={checked}
      onChange={onChange}
      disabled={disabled}
    />
  );
};

const SwitchList = ({ settingId }) => {
  const { options, dispatchChrome } = useContext(ChromeContext);
  const [list, setList] = useState(options[settingId].value);
  // const isMounted = useRef(false);

  const changeHandler = (index) => (e) => {
    setList((oldList) => {
      oldList[index].value = e.target.checked;
      return [...oldList];
    });
  };

  useEffect(() => {
    // if (isMounted.current) {
    dispatchChrome({
      type: "UPDATE_SETTING",
      settingId: settingId,
      value: list,
    });
    // } else {
    //   isMounted.current = true;
    // }
  }, [list]);

  const items = list.map((item, index) => {
    return (
      <div key={item.label} className={clsx("row")}>
        <label>{item.label}</label>
        <label className="switch">
          <MiniSwitch
            type={"checkbox"}
            checked={item.value}
            onChange={changeHandler(index)}
          />
          <span className="handle"></span>
        </label>
      </div>
    );
  });

  return (
    <>
      <div className={clsx("switch-list")}>{items}</div>
    </>
  );
};

export default SwitchList;
