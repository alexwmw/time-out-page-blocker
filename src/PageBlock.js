import { createRoot } from "react-dom/client";
import { useEffect, useRef, useState } from "react";
import "./PageBlock.less";
import "./less/theme.less";
import useGetOptions from "./hooks/useGetOptions";
import useApplyTheme from "./hooks/useApplyTheme";
import useGetProvider from "./hooks/useGetProvider";
import {
  CompleteLottie,
  getSetUnblock,
  HoldButton,
  useMouseEvents,
} from "./components/PageBlock";
import Header from "./components/Headers/Header";
import { Favicon } from "./components/ProvidersSorter/SortableItem";
import { set } from "./modules/Utilities";

const PageBlock = () => {
  const [held, setHeld] = useState(false);
  const [remainingTime, setRemainingTime] = useState(0);
  const [complete, setComplete] = useState(false);
  const [lottieSpeed, setLottieSpeed] = useState(1);
  const player = useRef();

  const [options] = useGetOptions();
  const [provider] = useGetProvider((p) => p.id === id);
  useApplyTheme(options, "dark");
  const seconds = options?.unblockTimeout?.value;

  const queryParameters = new URLSearchParams(window.location.search);
  const id = queryParameters.get("id");
  const redirectAddress = queryParameters.get("redirect");
  const notHostname = redirectAddress !== provider.hostname;
  const webStoreUrl =
    "https://chrome.google.com/webstore/detail/time-out-page-blocker/hoeinipdpcnbifnmdkfbgmpaccbjpinl";

  const [onMouseUp, onMouseDown] = useMouseEvents({
    player,
    setRemainingTime,
    setComplete,
    seconds,
    held,
    setHeld,
  });

  useEffect(() => {
    setRemainingTime(seconds);
    setLottieSpeed(5 / seconds);
  }, [seconds]);

  useEffect(() => {
    document.addEventListener("mouseup", onMouseUp);
    document.addEventListener("keyup", onMouseUp);
  }, [onMouseUp]);

  useEffect(() => {
    if (!complete) return;
    const setUnblock = getSetUnblock(provider, redirectAddress);
    chrome.runtime.sendMessage({ action: "unblock", id }, setUnblock);
  }, [complete]);

  const setRated = () => {
    set({
      options: {
        ...options,
        isRated: { value: true },
      },
    });
  };

  const rateMe = options.isRated !== undefined && !options.isRated?.value && (
    <div className={"rate-me"}>
      <h1>Got feedback?</h1>
      <p>
        Rate us on the{" "}
        <a onClick={setRated} target="_blank" href={webStoreUrl}>
          <Favicon url={webStoreUrl} />
          Chrome Web Store
        </a>
      </p>
    </div>
  );

  return (
    <>
      <Header></Header> {rateMe}
      <div className={"content"}>
        <h1>{provider.hostname}</h1>
        {notHostname && <p className={"url"}>{redirectAddress}</p>}
        <h2>This site is blocked</h2>
        <p>This page is being blocked by Time Out : Page Blocker.</p>
        <p>
          You will need to hold the button for {seconds} seconds to view the
          page.
        </p>
        <div className="hold-button-container">
          {!complete && (
            <HoldButton
              speed={lottieSpeed}
              remainingTime={remainingTime}
              player={player}
              onHold={onMouseDown}
              held={held}
            />
          )}
          {complete && <CompleteLottie />}
        </div>
      </div>
    </>
  );
};

/** Define root */
const rootElement = document.getElementById("time-out");
const root = createRoot(rootElement);
/** Render options page */
root.render(<PageBlock />);
