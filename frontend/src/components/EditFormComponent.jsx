import React, {useState} from "react";
import Button from "@mui/joy/Button";
import {ButtonWithConfirmation, HelpBox, LoadingSpinner} from "./atoms.jsx";
import {Form} from "./forms.jsx";
import CheckIcon from "@mui/icons-material/Check";
import {PageContent} from "./Layout.jsx";
import Collapse from "@mui/material/Collapse";
import Divider from "@mui/joy/Divider";
import Card from "@mui/joy/Card";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded.js";
import {useSnackbar} from "./snackbar.jsx";

export default function EditFormComponent({
  component: Component = PageContent,
  ready = true,
  onSubmit,
  onDelete,
  pageBanner,
  initialValues,
  validationSchema,
  isEditMode = true,
  updateLoading,
  deleteLoading,
  helpBox,
  deleteAreYouSureText,
  deleteButtonText,
  validationButtonText,
  successText,
  children,
  ...props
}) {
  const [openSnackbar] = useSnackbar();

  const [showingErrors, setShowingErrors] = useState(false);

  async function handleDelete() {
    await onDelete();
    openSnackbar("Suppression réussie");
  }

  if (!ready) return <LoadingSpinner />;

  return (
    <>
      {pageBanner}

      <Form
        initialValues={initialValues||{}}
        validationSchema={validationSchema}
        successText={successText || (isEditMode ? "Modifications réussies" : "Création réussie")}
        onSubmit={onSubmit}>
        {(register, {values, setFieldValue, errors, dirty}) => (
          <Component gap={3} mt={6} maxWidth={"lg"} {...props}>
            {helpBox && (
              <>
                <HelpBox>{helpBox}</HelpBox>
                <Divider sx={{my: 2}} />
              </>
            )}

            {children(register, {values, setFieldValue, errors, dirty, showingErrors})}

            <Collapse in={showingErrors} sx={{mb: -2}}>
              {console.log(errors)}
              {Object.keys(errors)?.length > 0 ? (
                <Card variant="soft" color="danger" sx={{mb: 3}}>
                  Oups ! votre formulaire comporte des erreurs. Remontez la page pour corrigez vos
                  informations.
                </Card>
              ) : (
                dirty && (
                  <Card variant="soft" color="success" sx={{mb: 3}}>
                    C'est tout bon !
                  </Card>
                )
              )}
            </Collapse>

            <Button
              size={"lg"}
              type="submit"
              color="success"
              disabled={!dirty}
              loading={updateLoading}
              onClick={() => setShowingErrors(Object.keys(errors)?.length > 0)}
              startDecorator={<CheckIcon />}>
              {validationButtonText ||
                (isEditMode ? "Valider les modifications" : "Valider la création")}
            </Button>

            {deleteButtonText && deleteAreYouSureText && onDelete && isEditMode && (
              <ButtonWithConfirmation
                areYouSureText={deleteAreYouSureText}
                loading={deleteLoading}
                onClick={handleDelete}
                color="danger"
                startDecorator={<DeleteOutlineRoundedIcon />}>
                {deleteButtonText}
              </ButtonWithConfirmation>
            )}
          </Component>
        )}
      </Form>
    </>
  );
}
