import clsx from "clsx";
import Icon from "../Icons/Icon";
import "./Button.less";

function Button({ icon, children, classes, tabIndex, ...rest }) {
  return (
    <button {...rest} tabIndex={tabIndex} className={clsx("button", classes)}>
      {icon && <Icon type={icon} />}
      {children}
    </button>
  );
}

export default Button;
