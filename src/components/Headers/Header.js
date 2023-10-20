import "./Header.less";

function Header(props) {
  return (
    <div className="ocs-header">
      <img src={"/icons/icon_high-res.png"}></img>
      <h1>
        Time Out : <span>Page Blocker</span>
      </h1>
      {props.children}
    </div>
  );
}

export default Header;
