import { useContext, useState, useEffect, useRef } from "react";
import ChromeContext from "../../contexts/ChromeContext";
import "./Switch.less";
import clsx from "clsx";
import Button from "../Buttons/Button";

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

const TimeLimit = ({ settingId }) => {
  const { options, dispatchChrome } = useContext(ChromeContext);
  const [object, setObject] = useState(options[settingId].value);
  const [startTime, setStartTime] = useState(object.start.value ?? "00:00");
  const [endTime, setEndTime] = useState(object.end.value ?? "00:00");
  const allDay = object.allDay;
  const formRef = useRef();
  const disabledByToggle = allDay.value === true;
  const disabledByLogic =
    startTime === options[settingId].value.start.value &&
    endTime === options[settingId].value.end.value;

  const switchHandler = (e) => {
    setObject((oldObj) => {
      oldObj.allDay.value = e.target.checked;
      return { ...oldObj };
    });
  };
  const onClickSet = (e) => {
    e.preventDefault();
    const isValid = formRef.current.reportValidity();
    if (isValid) {
      setObject((obj) => {
        obj.start.value = startTime;
        obj.end.value = endTime;
        return { ...obj };
      });
    }
  };

  useEffect(() => {
    setStartTime(object.start.value);
    setEndTime(object.end.value);
    dispatchChrome({
      type: "UPDATE_SETTING",
      settingId: settingId,
      value: object,
    });
  }, [object]);

  const switchItem = (
    <div key={allDay.label} className={clsx("row", "time-row")}>
      <label>{allDay.label}</label>
      <label className={"switch"}>
        <MiniSwitch
          type={"checkbox"}
          checked={allDay.value}
          value={allDay.value}
          onChange={switchHandler}
        />
        <span className="handle" />
      </label>
    </div>
  );

  return (
    <>
      {switchItem}
      <form className={clsx("row", disabledByToggle && "disabled")}>
        <label>{object.start.label}</label>
        <label>{object.end.label}</label>
      </form>
      <form
        ref={formRef}
        className={clsx("row", "time-row", disabledByToggle && "disabled")}
      >
        <div>
          <label>{startTime.label}</label>
          <input
            className={"time"}
            type={"time"}
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            disabled={disabledByToggle}
            required={true}
            name={"time"}
          />
        </div>
        <div>
          <label>{endTime.label}</label>
          <input
            className={"time"}
            type={"time"}
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            disabled={disabledByToggle}
            required={true}
            name={"time"}
          />
        </div>
        <Button
          type={"submit"}
          disabled={disabledByToggle}
          classes={clsx((disabledByToggle || disabledByLogic) && "disabled")}
          onClick={onClickSet}
        >
          Set
        </Button>
      </form>
    </>
  );
};

export default TimeLimit;
