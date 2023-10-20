const ProviderFormReducer = (state, action) => {
  const formatN = (str) => str.trim();

  const formatHN = (str) =>
    str
      .trim()
      .replace(/^.*:\/\/+/g, "")
      .replace(/\/$/g, "")
      .toLowerCase();

  const formatQP = (str) =>
    str
      .trim()
      .replace(/^\/+|\/+$/g, "")
      .toLowerCase()
      .replaceAll("$text$", "$TEXT$");

  const formatFU = (str) =>
    str
      .trim()
      .replace(/^\/+|\/+$/g, "")
      .toLowerCase();

  switch (action.type) {
    case "SET_NAME":
      return { ...state, name: action.value };
    case "SET_HOSTNAME":
      return { ...state, hostname: action.value };
    case "FORMAT_NAME":
      return { ...state, name: formatN(state.name) };
    case "FORMAT_HOSTNAME":
      return { ...state, hostname: formatHN(state.hostname) };
    case "SET_ALL":
      return {
        ...state,
        name: action.name,
        hostname: action.hostname,
        type: action.type,
      };
    case "FORMAT_ALL":
      return {
        ...state,
        hostname: formatHN(state.hostname),
      };
    case "CLEAR_FORM":
      return action.defaults;
  }
};

export default ProviderFormReducer;
