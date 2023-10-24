import { useContext, useEffect, useRef, useState } from "react";
import ChromeContext from "../../contexts/ChromeContext";
import "./Switch.less";
import clsx from "clsx";

const Switch = ({ settingId }) => {
  const { options, dispatchChrome } = useContext(ChromeContext);
  const [value, setValue] = useState(options[settingId].value);
  const isMounted = useRef(false);
  const changeHandler = (e) => {
    setValue(e.target.checked);
  };

  useEffect(() => {
    if (isMounted.current) {
      dispatchChrome({
        type: "UPDATE_SETTING",
        settingId: settingId,
        value: value,
      });
    } else {
      isMounted.current = true;
    }
  }, [value]);

  return (
    <>
      <label className={clsx("switch")}>
        <input type={"checkbox"} checked={value} onChange={changeHandler} />
        <span className="handle" />
      </label>
      <p className={`indicator${value ? " on" : " off"}`}>
        {value ? "ON" : "OFF"}
      </p>
    </>
  );
};

export default Switch;
