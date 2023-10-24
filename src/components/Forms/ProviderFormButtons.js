import FormButton from "./FormButton";

function ProviderFormButtons({
  closeHandler,
  deleteHandler,
  labels = {},
  classes = {},
}) {
  return (
    <>
      {" "}
      {closeHandler && (
        <FormButton
          type={"close"}
          label={labels.close}
          onClick={closeHandler}
          classes={classes.close}
        />
      )}
      {deleteHandler && (
        <FormButton
          type={"delete"}
          label={labels.delete}
          onClick={deleteHandler}
          classes={classes.delete}
        />
      )}
      <FormButton
        type={"submit"}
        label={labels.submit}
        classes={classes.submit}
      />
    </>
  );
}

export default ProviderFormButtons;
