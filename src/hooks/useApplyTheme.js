import { useEffect, useState } from "react";

const useApplyTheme = (options, value) => {
  const [hasTheme, setHasTheme] = useState(false);
  /** Apply theme styles on first render */
  useEffect(() => {
    let theme = value ?? options.theme?.value;
    theme ??= "light";
    const html = document.querySelector("html");
    html.dataset.theme = `theme-${theme}`;
    setHasTheme(true);
  }, []);

  /** Apply theme styles when theme value is changed */
  useEffect(() => {
    if (!value) {
      const theme = options.theme?.value.toLowerCase();
      const html = document.querySelector("html");
      html.dataset.theme = `theme-${theme}`;
      setHasTheme(true);
    }
  }, [options.theme]);

  return hasTheme;
};

export default useApplyTheme;
