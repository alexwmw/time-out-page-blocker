import { useState } from "react";
import useChromeGet from "./useChromeGet";
import { set } from "../modules/Utilities";
import defaultOptions from "../data/options.json";
import useChromeListener from "./useChromeListener";

const useGetOptions = (devOptions, onOptionsChange) => {
  const [options, setOptions] = useState({});

  /** Set options on first render */
  if (devOptions.resetOptions) {
    set({ options: defaultOptions });
  }
  useChromeGet(
    (result) => {
      devOptions.resetOptions = false;
      setOptions(result.options);
    },
    ["options"],
  );

  useChromeListener(
    ({ oldValue, newValue }) => {
      setOptions(newValue);
      onOptionsChange();
    },
    ["options"],
  );

  return [options, setOptions];
};
export default useGetOptions;
