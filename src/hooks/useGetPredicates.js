import { useEffect, useState } from "react";
import useGetOptions from "./useGetOptions";
import { getBlockPredicates } from "../modules/Utilities";

const useGetPredicates = () => {
  const [predicates, setPredicates] = useState({});
  const [options] = useGetOptions();

  useEffect(() => {
    if (Object.keys(options).length) {
      setPredicates(getBlockPredicates(options));
    }
  }, [options]);

  return predicates;
};

export default useGetPredicates;
