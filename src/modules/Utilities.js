/** Return an array where each item with a 'position' property
 * is at the front according to its position property */
export function sortByPosition(array) {
  const hasPosition = [];
  const noPosition = [];

  array.forEach((element) => {
    if (element.hasOwnProperty("position")) {
      hasPosition.push(element);
    } else {
      noPosition.push(element);
    }
  });
  hasPosition.sort((a, b) => a.position - b.position);
  return [...hasPosition, ...noPosition];
}

/** Helper function */
export const localizedOptions = () => {
  let opts = require("../data/options.json");

  try {
    opts.color.label = `Popup ${chrome.i18n.getMessage("color")}`;
    opts.color.description = `${chrome.i18n.getMessage(
      "ColorCaps",
    )} of the popup`;
  } catch (e) {
    console.log("i18n not supported in this version of chrome", e);
  }

  return opts;
};

/** Helper function */
export const localizedProviders = () => {
  let providers = require("../data/providers.json");
  try {
    providers = replaceObjectInArray(providers, {
      ...getFromArray(providers, "Amazon"),
      hostname: chrome.i18n.getMessage("amazonUrl") ?? "www.amazon.co.uk",
    });
  } catch (e) {
    console.log("i18n not supported in this version of chrome", e);
  }

  return providers;
};

/** Helper function */
export const getFromArray = (array, key, matchKey = "id") => {
  return array.filter((obj) => obj[matchKey] === key)[0];
};

/** Helper function */
export const replaceObjectInArray = (array, newObject, matchKey = "id") => {
  const itemIndex = array.findIndex(
    (object) => object[matchKey] === newObject[matchKey],
  );
  if (itemIndex > -1) {
    array[itemIndex] = newObject;
    return [...array];
  } else {
    throw new ReferenceError("No match not found in array.");
  }
};

export const sanitize = (str) => {
  if (str?.slice(-1) === "/") {
    return str?.slice(0, -1);
  }
  return str;
};

/** Helper function */
export const isValidURL = (url) => {
  let x = false;
  try {
    x = new URL(url);
  } catch (e) {}
  return !x === false;
};

export const isValidText = (text) => {
  const invalidStrings = ["", " "];
  return text && text !== "" && text !== " ";
};

export const visible = (obj) => obj.visibility === "visible";

export const hidden = (obj) => obj.visibility === "hidden";

export const disabled = (obj) => obj.visibility === "disabled";

export const compareObjs = (
  A,
  B,
  options = { type: "same", keysOnly: false },
) => {
  let aKeys = Object.keys(A);
  let bKeys = Object.keys(B);

  if (options.keysOnly) {
    aKeys = aKeys.filter((keyInA) => bKeys.some((keyInB) => keyInB === keyInA));
    bKeys = bKeys.filter((keyInB) => aKeys.some((keyInA) => keyInA === keyInB));
  }

  if (aKeys.length !== bKeys.length) {
    return false;
  }

  const evaluateWith = {
    same: (keys) => keys.every((key) => A[key] === B[key]),
    different: (keys) => keys.some((key) => A[key] !== B[key]),
  }[options.type];

  return evaluateWith(aKeys);
};

export const sortablesFromProviders = (providers) => {
  const sortables = {
    visible: providers.filter((p) => p.type === "Domain"),
    hidden: providers.filter((p) => p.type === "Web page"),
  };

  return sortables;
};

export const arrayFromSortables = (sortables) => {
  return sortByPosition([
    ...sortables.none,
    ...sortables.visible,
    ...sortables.hidden,
    ...sortables.disabled,
  ]);
};

export const createUniqueId = () => "id" + Math.random().toString(16).slice(2);

export const sortIsFinished = (array) => array.every((p) => p.chosen !== true);

export const placesHaveChanged = (array, providers) =>
  array.some(
    (e, i, a) =>
      a[i].id !== providers[i].id ||
      a[i].visibility !== providers[i].visibility,
  );

export const set = (obj, callback) => {
  chrome.storage.sync.set(obj, callback && callback());
};

export const get = (keys, callback) => chrome.storage.sync.get(keys, callback);

export const getAsync = async (keys) => chrome.storage.sync.get(keys);

export const applyTheme = (theme, element = null) => {
  if (element) {
    element.dataset.theme = `theme-${theme}`;
  } else {
    const html = document.querySelector("html");
    html.dataset.theme = `theme-${theme}`;
  }
};

export const clear = () => {
  chrome.storage.sync.clear();
};
