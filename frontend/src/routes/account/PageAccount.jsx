import Button from "@mui/joy/Button";
import {
  authActions,
  selectCurrentUser,
  useDeleteUserMutation,
  useUpdateUserMutation,
} from "../../app/auth-slice.js";
import * as React from "react";
import {useDispatch, useSelector} from "react-redux";
import {Link as ReactRouterLink, useNavigate} from "react-router-dom";
import {ButtonWithConfirmation, Form, FormInput} from "../../components/atoms";
import {PageContent} from "../../components/Layout";
import Typography from "@mui/joy/Typography";
import Card from "@mui/joy/Card";
import Grid from "@mui/joy/Grid";
import Stack from "@mui/joy/Stack";
import {useSnackbar} from "../../components/snackbar.jsx";
import * as yup from "yup";
import {
  confirmNewPassword,
  newPassword,
  requiredEmail,
  requiredPhone,
  requiredString,
} from "../../app/fieldValidation.js";
import {t} from "i18next";
import {AuthButton} from "../../components/Layout.jsx";

export default function PageAccount() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [openSnackbar] = useSnackbar();

  const [updateUser, {isLoading: isUpdatingUser}] = useUpdateUserMutation();
  const [deleteUser, {isLoading: isDeletingUser}] = useDeleteUserMutation();

  const currentUser = useSelector(selectCurrentUser);
  async function onSubmit(values) {
    await updateUser(values).unwrap();
  }

  return (
    <PageContent gap={3}>
      <Typography level={"h1"}>Mon compte</Typography>

      <Card variant={"soft"} invertedColors>
        <Form
          validationSchema={yup.object({
            firstName: requiredString,
            lastName: requiredString,
            email: requiredEmail,
            phone: requiredPhone,
            newPassword,
            confirmNewPassword,
          })}
          initialValues={currentUser}
          onSubmit={onSubmit}
          successText={"Modifications enregistrées"}>
          {(register) => (
            <Grid container columnSpacing={4} rowSpacing={3}>
              <Grid xs={12}>
                <Typography level={"h2"}>Informations personnelles</Typography>
              </Grid>
              <Grid md={6} xs={12}>
                <FormInput
                  label="Prénom"
                  name={"firstName"}
                  placeholder="prénom"
                  register={register}
                />
              </Grid>
              <Grid md={6} xs={12}>
                <FormInput label="Nom" name={"lastName"} placeholder="nom" register={register} />
              </Grid>
              <Grid md={6} xs={12}>
                <FormInput
                  label="Email"
                  name={"email"}
                  placeholder="email@example.com"
                  type={"email"}
                  register={register}
                />
              </Grid>
              <Grid md={6} xs={12}>
                <FormInput
                  label="Numéro de téléphone"
                  name={"phone"}
                  placeholder="+33 6 12 34 56 78"
                  type={"tel"}
                  register={register}
                />
              </Grid>
              <Grid md={6} xs={12}>
                <FormInput
                  label="Nouveau mot de passe"
                  name={"newPassword"}
                  placeholder="mot de passe"
                  type={"password"}
                  register={register}
                />
              </Grid>
              <Grid md={6} xs={12}>
                <FormInput
                  label="Confirmez le nouveau mot de passe"
                  name={"confirmNewPassword"}
                  placeholder="mot de passe"
                  type={"password"}
                  register={register}
                />
              </Grid>

              <Grid xs={12}>
                <Stack mt={2}>
                  <Button loading={isUpdatingUser} type="submit" size="lg" color="success">
                    Enregistrer les modifications
                  </Button>
                </Stack>
              </Grid>
            </Grid>
          )}
        </Form>
      </Card>

      <Stack gap={3} direction={{md: "row"}} justifyContent={""}>
        <Card variant={"soft"} sx={{flexGrow: 1, flexBasis: 1}}>
          {currentUser?.companies?.length > 0 ? (
            <Stack gap={2}>
              <Typography level={"h2"}>
                {t("company.myCompany", {count: currentUser?.companies?.length})}
              </Typography>
              <Typography>Consultez vos offres en cours en cliquant ci-dessous.</Typography>

              <AuthButton.CompanyOffersList currentUser={currentUser} />
            </Stack>
          ) : (
            <Stack gap={2}>
              <Typography level={"h2"}>Mes rendez-vous</Typography>
              <Typography>Consultez vos rendez-vous en cours sur la page dédiée.</Typography>

              <Button component={ReactRouterLink} to={"/my-meetings"}>
                Voir mes rendez-vous en cours
              </Button>
            </Stack>
          )}
        </Card>

        <Card variant={"soft"} sx={{flexGrow: 1, flexBasis: 1}}>
          <Stack gap={2}>
            <Typography level={"h2"}>Gestion du compte</Typography>

            <Button
              color={"danger"}
              onClick={async () => {
                await dispatch(authActions.logOut());
                openSnackbar("Déconnexion réussie", {color: "success"});
                navigate("/login");
              }}>
              Se déconnecter
            </Button>

            <ButtonWithConfirmation
              color={"danger"}
              loading={isDeletingUser}
              onClick={async () => {
                await deleteUser().unwrap();
                openSnackbar("Suppression du compte réussie");
                navigate("/");
              }}
              areYouSureText={
                "Toutes les données de votre compte seront supprimées, y compris vos réservations de rendez-vous."
              }>
              Supprimer mon compte
            </ButtonWithConfirmation>
          </Stack>
        </Card>
      </Stack>
    </PageContent>
  );
}
