import { get, getAsync, replaceObjectInArray, set } from "./Utilities";

export const runtimeStartupListener = () => {
  (async function () {
    let { providers } = getAsync(["providers"]);
    if (Array.isArray(providers)) {
      providers = providers.map((p) => {
        return {
          ...p,
          unblocked: false,
        };
      });
      set({ providers }, () => {});
    }
  })();
};
export const runtimeMessageListener =
  (logger) =>
  ({ action, id, log }) => {
    const blockAfterTimeout = async () => {
      let { providers } = await getAsync(["providers"]);
      const provider = providers.filter((p) => p.id === id)[0];
      if (provider) {
        providers = replaceObjectInArray(
          providers,
          {
            ...provider,
            unblocked: false,
          },
          "id",
        );
        set({ providers }, () => {
          logger("timeout: Blocking provider (removing unblock)", id, provider);
        });
      }
    };

    if (action === "unblock") {
      get(["options"], ({ options }) => {
        const allowRevisits = options.allowRevisits.value;
        const time = !allowRevisits ? 1000 : options.revisitLimit.value * 60000;
        logger(
          "unblock listener: Setting unblock timeout for provider",
          id,
          "in",
          time / 1000,
          "seconds",
        );
        setTimeout(blockAfterTimeout, time);
      });
    }
    if (log) {
      logger(...(Array.isArray(log) ? log : [log]));
    }
  };
