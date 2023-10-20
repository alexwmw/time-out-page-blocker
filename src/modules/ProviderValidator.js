import isValidHostname from "is-valid-hostname";
import { isValidURL } from "./Utilities";
import schema from "../schemas/providersSchema.json";

const ProviderValidator = (provider, providers = null) => {
  /** Validate each of the providers properties */

  const nameExists =
    providers &&
    providers.some((p) => p.name.toLowerCase() == provider.name.toLowerCase());

  const validName =
    !nameExists && RegExp(schema.properties.name.pattern).test(provider.name);

  const validHostname =
    isValidHostname(provider.hostname) && provider.hostname.indexOf(".") > -1;

  const validVisibility = schema.properties.visibility.enum.some(
    (value) => value == provider.visibility,
  );

  /** report: object values set to 'true' or error message for each property */
  const report = {};

  report.name =
    validName ||
    (provider.name === ""
      ? "Name cannot be blank."
      : `\"${provider.name}\" is not a valid name.${
          nameExists && ` Name already exists. Please use a unique name.`
        }`);

  report.hostname =
    validHostname ||
    (provider.hostname === ""
      ? "Hostname cannot be blank."
      : `\"${provider.hostname}\" is not a valid hostname.`);

  report.visibility =
    validVisibility || `\"${provider.visibility}\" is not a valid visibility.`;

  const decision = Object.values(report).every((value) => value === true);

  const messages = Object.values(report).filter((value) => value !== true);

  return {
    report,
    decision,
    messages,
  };
};

export default ProviderValidator;
