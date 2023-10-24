import useGetOptions from "./useGetOptions";
import { useEffect, useState } from "react";

const useGetOptionValue = (opt) => {
  const [options] = useGetOptions();
  const [isOpt, setIsOpt] = useState(options[opt]?.value ?? false);
  useEffect(() => {
    setIsOpt(options[opt]?.value);
  }, [options]);
  return [isOpt, setIsOpt];
};

export default useGetOptionValue;
