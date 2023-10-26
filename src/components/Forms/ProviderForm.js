import { useContext } from "react";
import ChromeContext from "../../contexts/ChromeContext";
import AlertsContext from "../../contexts/AlertsContext";

function ProviderForm({ provider, closeForm }) {
  const { dispatchChrome } = useContext(ChromeContext);
  const alertHandler = useContext(AlertsContext);

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

  return <form onClick={(e) => e.stopPropagation()}></form>;
}

export default ProviderForm;
