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

export default function PageEdit({
  ready = true,
  onSubmit,
  onDelete,
  pageBanner,
  initialValues,
  validationSchema,
  isEditMode,
  updateLoading,
  deleteLoading,
  helpBox,
  deleteAreYouSureText,
  children,
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
        initialValues={initialValues}
        validationSchema={validationSchema}
        successText={isEditMode ? "Modifications réussies" : "Création réussie"}
        onSubmit={onSubmit}>
        {(register, {values, setFieldValue, errors, dirty}) => (
          <PageContent gap={3} mt={6} maxWidth={"lg"}>
            {helpBox && (
              <>
                <HelpBox>{helpBox}</HelpBox>
                <Divider sx={{my: 2}} />
              </>
            )}

            {children(register, {values, setFieldValue, errors, dirty, showingErrors})}

            <Collapse in={showingErrors && Object.keys(errors).length > 0} sx={{mb: -2}}>
              <Card variant="soft" color="danger" sx={{mb: 3}}>
                Oups ! votre formulaire comporte des erreurs. Remontez la page pour corrigez vos
                informations.
              </Card>
            </Collapse>

            <Button
              size={"lg"}
              type="submit"
              color="success"
              disabled={!dirty}
              loading={updateLoading}
              onClick={() => setShowingErrors(true)}
              startDecorator={<CheckIcon />}>
              {isEditMode ? "Valider les modifications" : "Valider la création"}
            </Button>

            {onDelete && isEditMode && (
              <ButtonWithConfirmation
                areYouSureText={deleteAreYouSureText}
                loading={deleteLoading}
                onClick={handleDelete}
                color="danger"
                startDecorator={<DeleteOutlineRoundedIcon />}>
                Supprimer l'offre
              </ButtonWithConfirmation>
            )}
          </PageContent>
        )}
      </Form>
    </>
  );
}
