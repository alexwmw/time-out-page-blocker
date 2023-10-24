import OCSfunctions from "/src/data/functions.json";
import defaultOptions from "/src/data/options.json";
import {get, localizedProviders, replaceObjectInArray, set, sortByPosition,} from "./Utilities";

// Localize strings
const OCSproviders = localizedProviders();

const ChromeDispatcher = (action, callback = () => {}) => {
  switch (action.type) {
    case "SET_PROVIDERS":
      set({
        providers: action.providers,
      });
      break;
    case "RESET_PROVIDERS":
      set({ providers: sortByPosition([...OCSproviders, ...OCSfunctions]) });
      break;
    case "UPDATE_PROVIDER":
      get(["providers"], (result) =>
        set({
          providers: replaceObjectInArray(result.providers, action.provider),
        }),
      );
      break;
    case "ADD_NEW_PROVIDER":
      get(["providers"], (result) =>
        set({
          providers: [...result.providers, action.provider],
        }),
      );
      break;
    case "DELETE_PROVIDER":
      get(["providers"], (result) =>
        set({
          providers: result.providers.filter((p) => {
            console.log(p, action.provider);
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
    case "CLEAR_SETTINGS":
      get(["options"], () => {
        set({ options: defaultOptions });
      });
      break;
  }
  callback();
};

export default ChromeDispatcher;
