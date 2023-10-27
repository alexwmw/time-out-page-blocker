import Lottie from "react-lottie";
import Button from "../Buttons/Button";
import animationSuccess from "../../lotties/animation_lo5r2xoe.json";
import {
  getAsync,
  replaceObjectInArray,
  setAsync,
} from "../../modules/Utilities";
import { useRef } from "react";
import animationData from "../../lotties/animation_lo5im3zy.json";

const lottieOpts = {
  animationData,
  loop: false,
  autoplay: false,
  rendererSettings: {
    preserveAspectRatio: "xMidYMid slice",
  },
};

export const HoldButton = ({ player, speed, remainingTime, onHold, held }) => {
  return (
    <div className="lottie-container">
      <Lottie
        ref={player}
        options={lottieOpts}
        isStopped={!held}
        speed={speed}
      />

      <Button
        onKeyDown={onHold}
        onMouseDown={onHold}
        classes={"hold-button"}
        tabIndex={1}
      >
        {held ? remainingTime : "Hold"}
      </Button>
    </div>
  );
};

export const CompleteLottie = ({}) => {
  return (
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
  );
};

export const useMouseEvents = ({
  player,
  setRemainingTime,
  setComplete,
  seconds,
  held,
  setHeld,
}) => {
  const interval = useRef();

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
  const onMouseUp = () => {
    setRemainingTime(seconds);
    setHeld(false);
    clearInterval(interval.current);
  };

  return [onMouseUp, onMouseDown];
};

export const getSetUnblock = (provider, redirectAddress) => {
  return async function () {
    const { providers } = await getAsync(["providers"]);
    const unblockProps = {
      unblocked: true,
      lastUnblock: new Date(Date.now()).toLocaleString(),
    };
    const updatedProviders = replaceObjectInArray(
      providers,
      { ...provider, ...unblockProps },
      "id",
    );
    await setAsync({ providers: updatedProviders });
    await chrome.runtime.sendMessage({
      log: ["page block: unblock set on provider. Redirecting.", provider],
    });
    setTimeout(() => window.location.assign(`http://${redirectAddress}`), 1000);
  };
};
