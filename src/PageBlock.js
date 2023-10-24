import {createRoot} from "react-dom/client";
import Header from "./components/Headers/Header";
import "./PageBlock.less";
import "./less/theme.less";
import useGetOptions from "./hooks/useGetOptions";
import useApplyTheme from "./hooks/useApplyTheme";
import Button from "./components/Buttons/Button";
import {useEffect, useRef, useState} from "react";
import useGetProvider from "./hooks/useGetProvider";
import {get, replaceObjectInArray, set} from "./modules/Utilities";
import bgSrc from "./images/abstract6.jpg";

/** Define root */
const rootElement = document.getElementById("time-out");
const root = createRoot(rootElement);

const PageBlock = () => {
  const [options, setOptions] = useGetOptions();
  useApplyTheme(options, "dark");
  const queryParameters = new URLSearchParams(window.location.search);
  const id = queryParameters.get("id");
  const redirectAddress = queryParameters.get("redirect");
  const redirectName = redirectAddress.split("/")[0];
  const [provider] = useGetProvider((p) => p.id === id);
  const seconds = options?.unblockTimeout?.value;
  const [remainingTime, setRemainingTime] = useState(0);
  const [held, setHeld] = useState(false);
  const interval = useRef();
  const [complete, setComplete] = useState(false);

  const onMouseDown = (e) => {
    if (e.button === 0) {
      setHeld(true);
      interval.current = setInterval(() => {
        setRemainingTime((t) => {
          if (t === 1) {
            setComplete(true);
          }
          return t > 0 ? t - 1 : 0;
        });
      }, 1000);
    }
  };

  useEffect(() => {
    setRemainingTime(seconds);
  }, [seconds]);

  const onMouseUp = () => {
    setRemainingTime(seconds);
    setHeld(false);
    clearInterval(interval.current);
  };

  useEffect(() => {
    document.addEventListener("mouseup", onMouseUp);
  }, [onMouseUp]);

  useEffect(() => {
    if (complete) {
      chrome.runtime.sendMessage({ action: "unblock", id });
      get(["providers"], ({ providers }) => {
        const arr = replaceObjectInArray(
          providers,
          { ...provider, unblocked: true },
          "id",
        );
        set({ providers: arr }, () => {
          window.location.assign(`http://${redirectAddress}`);
        });
      });
    }
  }, [complete]);

  return (
    <>
      <img className={"bgImage"} src={bgSrc} />
      <Header />
      <div className={"content"}>
        <h1>{redirectName}</h1>
        <h2>This site is blocked</h2>
        <p>This page is being blocked by Time Out : Page Blocker.</p>
        <p>
          You will need to hold the button for {seconds} seconds to view the
          page.
        </p>
        {!complete && (
          <Button onMouseDown={onMouseDown} classes={"hold-button"}>
            {held ? remainingTime : "Hold"}
          </Button>
        )}
      </div>
    </>
  );
};

//** Render options page */
root.render(<PageBlock />);
