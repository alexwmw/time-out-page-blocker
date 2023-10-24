import { useState } from "react";
import useChromeGet from "./useChromeGet";
import useChromeListener from "./useChromeListener";

const useGetOptions = (onOptionsChange = () => {}) => {
  const [options, setOptions] = useState({});

  useChromeGet(
    (result) => {
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
