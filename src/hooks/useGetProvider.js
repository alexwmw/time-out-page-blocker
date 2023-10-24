import { useState } from "react";
import useChromeGet from "./useChromeGet";

const useGetProvider = (condition = (provider) => provider) => {
  const [provider, setProvider] = useState({});

  useChromeGet(
    (result) => {
      setProvider(result.providers.filter(condition)[0]);
    },
    ["providers"],
  );

  return [provider, setProvider];
};
export default useGetProvider;
