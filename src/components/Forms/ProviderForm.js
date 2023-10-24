import { useContext, useEffect, useReducer, useState } from "react";
import ProviderFormButtons from "./ProviderFormButtons";
import ProviderFormReducer from "/src/reducers/ProviderFormReducer";
import ProviderFormFields from "./ProviderFormFields";
import ChromeContext from "../../contexts/ChromeContext";
import AlertsContext from "../../contexts/AlertsContext";
import ProviderValidator from "../../modules/ProviderValidator";
import { compareObjs } from "../../modules/Utilities";

function ProviderForm({ provider, closeForm }) {
  const { dispatchChrome } = useContext(ChromeContext);
  const alertHandler = useContext(AlertsContext);
  const [hasChanges, setHasChanges] = useState(false);
  const [formValues, dispatchFormValues] = useReducer(
    ProviderFormReducer,
    provider,
  );

  /** Event handlers */
  const submitHandler = (e) => {
    e.preventDefault();
    const newProvider = {
      ...provider,
      ...formValues,
    };
    const validator = ProviderValidator(newProvider);
    if (validator.decision) {
      dispatchChrome({
        type: "UPDATE_PROVIDER",
        provider: newProvider,
      });
      closeForm();
    } else {
      alertHandler.invalidProviderError({ messages: validator.messages });
    }
  };

  const deleteHandler = (e) => {
    e.preventDefault();

    alertHandler.confirm({
      title: "Confirm delete",
      question: `Are you sure you want to delete \"${provider.hostname}\"?`,
      onProceed: () =>
        dispatchChrome({
          type: "DELETE_PROVIDER",
          provider: provider,
        }),
    });
  };

  useEffect(() => {
    const areDifferent = compareObjs(provider, formValues, {
      type: "different",
      keysOnly: true,
    });
    setHasChanges(areDifferent);
  }, [formValues]);

  return (
    <form onClick={(e) => e.stopPropagation()} onSubmit={submitHandler}>
      <ProviderFormFields dispatch={dispatchFormValues} values={formValues} />
      <div className={"flex-container row width-100 right"}>
        <div className="btn-area flex-container row right">
          <ProviderFormButtons
            classes={{ submit: [hasChanges ? "hasChanges" : ""] }}
            labels={{ submit: "Save" }}
            deleteHandler={deleteHandler}
          />
        </div>
      </div>
    </form>
  );
}

export default ProviderForm;
