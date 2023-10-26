import { createRoot } from "react-dom/client";
import Header from "./components/Headers/Header";
import "./PageBlock.less";
import "./less/theme.less";
import useGetOptions from "./hooks/useGetOptions";
import useApplyTheme from "./hooks/useApplyTheme";
import Button from "./components/Buttons/Button";
import { useEffect, useRef, useState } from "react";
import useGetProvider from "./hooks/useGetProvider";
import Lottie from "react-lottie";
import animationData from "./lotties/animation_lo5im3zy.json";
import animationSuccess from "./lotties/animation_lo5r2xoe.json";
import { get, replaceObjectInArray, set } from "./modules/Utilities";

const PageBlock = () => {
  const [options] = useGetOptions();
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
  const [lottieSpeed, setLottieSpeed] = useState(1);
  const player = useRef();

  const lottieOpts = {
    animationData,
    loop: false,
    autoplay: false,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  const onMouseDown = (e) => {
    const spacerBarPress = e.key === " " || e.code === "Space";
    if (e.button === 0 || (spacerBarPress && !held)) {
      player.current.play();
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
    setLottieSpeed(5 / seconds);
  }, [seconds]);

  const onMouseUp = () => {
    setRemainingTime(seconds);
    setHeld(false);
    clearInterval(interval.current);
  };

  useEffect(() => {
    document.addEventListener("mouseup", onMouseUp);
    document.addEventListener("keyup", onMouseUp);
  }, [onMouseUp]);

  useEffect(() => {
    if (complete) {
      chrome.runtime.sendMessage({ action: "unblock", id }, () => {
        get(["providers"], ({ providers }) => {
          const arr = replaceObjectInArray(
            providers,
            {
              ...provider,
              unblocked: true,
              lastUnblock: new Date(Date.now()).toLocaleString(),
            },
            "id",
          );
          set({ providers: arr }, () => {
            chrome.runtime.sendMessage({
              log: [
                "page block: unblock set on provider. Redirecting.",
                provider,
              ],
            });
            setTimeout(
              () => window.location.assign(`http://${redirectAddress}`),
              1000,
            );
          });
        });
      });
    }
  }, [complete]);

  return (
    <>
      {/*<img className={"bgImage"} src={bgSrc} />*/}
      <Header />
      <div className={"content"}>
        <h1>{provider.hostname}</h1>
        {redirectAddress !== provider.hostname && (
          <p className={"url"}>{redirectAddress}</p>
        )}
        <h2>This site is blocked</h2>
        <p>This page is being blocked by Time Out : Page Blocker.</p>
        <p>
          You will need to hold the button for {seconds} seconds to view the
          page.
        </p>
        <div className="hold-button-container">
          {!complete && (
            <div className="lottie-container">
              <Lottie
                ref={player}
                options={lottieOpts}
                isStopped={!held}
                speed={lottieSpeed}
              />

              <Button
                onKeyDown={onMouseDown}
                onMouseDown={onMouseDown}
                classes={"hold-button"}
                tabIndex={1}
              >
                {held ? remainingTime : "Hold"}
              </Button>
            </div>
          )}{" "}
          {complete && (
            <div className="lottie-container unlock">
              <div></div>
              <Lottie
                options={{
                  ...lottieOpts,
                  autoplay: true,
                  animationData: animationSuccess,
                }}
              />
            </div>
          )}
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
