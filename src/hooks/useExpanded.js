import { useEffect, useState } from "react";

const useExpanded = (provider, openItem) => {
  const [isExpanded, setIsExpanded] = useState(false);
  useEffect(() => {
    if (document.getElementsByClassName("expanded").length > 0) {
      document.body.classList.add("expanded-open");
    } else {
      document.body.classList.remove("expanded-open");
    }
  }, [isExpanded]);

  useEffect(() => {
    if (openItem !== provider.name) {
      setIsExpanded(false);
    }
  }, [openItem]);

  /** on Unmount  */
  useEffect(() => () => {
    document.body.classList.remove("expanded-open");
  });
  return [isExpanded, setIsExpanded];
};

export default useExpanded;
