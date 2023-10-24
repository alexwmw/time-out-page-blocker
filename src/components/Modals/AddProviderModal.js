import { useContext, useMemo, useReducer, useState } from "react";
import ProviderFormReducer from "../../reducers/ProviderFormReducer";
import Modal from "./Modal";
import useAlerts from "../../hooks/useAlerts";
import ProviderValidator from "../../modules/ProviderValidator";
import ChromeDispatcher from "../../modules/ChromeDispatcher";
import { ToastsContext } from "../../reducers/ToastsReducer";
import { get } from "../../modules/Utilities";
import "./AddProviderModal.less";

function AddProviderModal({ isOpen, setIsOpen }) {
  const [isVisible, setIsVisible] = useState(true);
  const { dispatchToasts } = useContext(ToastsContext);
  const { alertHandler, AlertProvider } = useAlerts();
  const defaults = useMemo(() => ({
    id: "",
    hostname: "",
    visibility: "hidden",
  }));

  const [formValues, dispatchFormValues] = useReducer(
    ProviderFormReducer,
    defaults,
  );

  const dispatchChrome = ChromeDispatcher;

  const onSubmit = (e) => {
    e.preventDefault();
    get(["providers"], (result) => {
      const validator = ProviderValidator(formValues, result.providers);
      if (validator.decision) {
        dispatchChrome({
          type: "ADD_NEW_PROVIDER",
          provider: formValues,
        });
        dispatchFormValues({ type: "CLEAR_FORM", defaults: defaults });
        dispatchToasts({ type: "PROVIDER_ADDED" });
        setIsOpen(false);
      } else {
        setIsVisible(false);
        alertHandler.invalidProviderError({
          messages: validator.messages,
          onClick: () => setIsVisible(true),
        });
      }
    });
  };

  const onClose = (e) => {
    setIsOpen(false);
    dispatchFormValues({ type: "CLEAR_FORM", defaults: defaults });
  };

  return (
    <Modal
      classes={["new-provider-modal", !isVisible && "hidden"]}
      title={"Add to block list"}
      hasTitleBar={true}
      onClose={onClose}
      onProceed={onSubmit}
      isOpen={isOpen}
    >
      <AlertProvider />
      // See ProviderForm
    </Modal>
  );
}

export default AddProviderModal;
