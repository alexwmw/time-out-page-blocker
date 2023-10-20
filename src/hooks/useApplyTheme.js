import { useEffect, useState } from "react";
import { applyTheme } from "../modules/Utilities";

const useApplyTheme = (options) => {
  const [hasTheme, setHasTheme] = useState(false);
  /** Apply theme styles on first render */
  useEffect(() => {
    let theme = options.theme?.value;
    theme ??= "light";
    const html = document.querySelector("html");
    html.dataset.theme = `theme-${theme}`;
    setHasTheme(true);
  }, []);

  /** Apply theme styles when theme value is changed */
  useEffect(() => {
    const theme = options.theme?.value.toLowerCase();
    const html = document.querySelector("html");
    html.dataset.theme = `theme-${theme}`;
    setHasTheme(true);
  }, [options.theme]);

  return hasTheme;
};

export default useApplyTheme;
