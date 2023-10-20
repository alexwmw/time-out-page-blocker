import clsx from "clsx";
import Icon from "../Icons/Icon";
import "./Button.less";

function Button({ icon, children, onClick, classes, type, disabled }) {
  return (
    <button
      disabled={disabled}
      type={type}
      onClick={onClick}
      className={clsx("button", classes)}
    >
      {icon && <Icon type={icon} />}
      {children}
    </button>
  );
}

export default Button;
