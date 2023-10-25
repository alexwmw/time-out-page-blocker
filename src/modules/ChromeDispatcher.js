import { get, replaceObjectInArray, set } from "./Utilities";

const ChromeDispatcher = (action, callback = () => {}) => {
  switch (action.type) {
    case "UPDATE_PROVIDER":
      get(["providers"], (result) =>
        set({
          providers: replaceObjectInArray(result.providers, action.provider),
        }),
      );
      break;
    case "DELETE_PROVIDER":
      get(["providers"], (result) =>
        set({
          providers: result.providers.filter((p) => {
            return p.id !== action.provider.id;
          }),
        }),
      );
      break;
    case "UPDATE_SETTING":
      get(["options"], (result) => {
        const setting = result.options[action.settingId];
        setting.value = action.value;
        set({ options: result.options });
      });
      break;
  }
  callback();
};

export default ChromeDispatcher;
