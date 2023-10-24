import FormField from "../../components/Forms/FormField";
import AddNewFormFields from "./AddNewFormFields";

function ProviderFormFields(props) {
  const { dispatch, values, tooltips } = props;

  const { hostname } = values;

  return (
    <>
      <FormField
        label={"Hostname"}
        value={hostname}
        required={true}
        setValue={(value) => dispatch({ type: "SET_HOSTNAME", value: value })}
        formatField={() => dispatch({ type: "FORMAT_HOSTNAME" })}
        tooltipText={"A website address such as www.example.com"}
        showTooltip={tooltips}
      />
    </>
  );
}

export default ProviderFormFields;
