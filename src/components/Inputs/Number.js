import { useContext, useRef, useState } from "react";
import ChromeContext from "../../contexts/ChromeContext";
import Button from "../Buttons/Button";
import "./Number.less";

const Number = ({ settingId }) => {
  const { options, dispatchChrome } = useContext(ChromeContext);
  const { min, max, unit } = options[settingId];
  const [value, setValue] = useState(options[settingId].value);

  const ref = useRef();
  const changeHandler = (e) => {
    setValue(e.target.value);
  };

  const onSet = () => {
    if (ref.current.reportValidity())
      dispatchChrome({
        type: "UPDATE_SETTING",
        settingId: settingId,
        value: value,
      });
  };

  return (
    <>
      <>
        <input
          ref={ref}
          type={"number"}
          className={"number"}
          value={value}
          onChange={changeHandler}
          min={min}
          max={max}
        ></input>
        {unit ?? ""}
      </>
      <Button
        classes={value === options[settingId].value && "disabled"}
        onClick={onSet}
      >
        Set
      </Button>
    </>
  );
};

export default Number;
