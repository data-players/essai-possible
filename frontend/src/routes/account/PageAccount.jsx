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
import {ButtonWithConfirmation, SimpleBanner} from "../../components/atoms";
import {Form, FormInput, FormStep} from "../../components/forms";
import {PageContent} from "../../components/Layout";
import Typography from "@mui/joy/Typography";
import Card from "@mui/joy/Card";
import Grid from "@mui/joy/Grid";
import Stack from "@mui/joy/Stack";
import {useSnackbar} from "../../components/snackbar.jsx";
import * as yup from "yup";
import {confirmNewPassword, requiredPhone, requiredString} from "../../app/fieldValidation.js";
import {t} from "i18next";
import {AuthButton} from "../../components/Layout.jsx";
import Divider from "@mui/joy/Divider";
import {UserFormElements} from "./UserFormElements.jsx";

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
    <>
      <SimpleBanner>Mon compte</SimpleBanner>

      <PageContent gap={3} mt={6} maxWidth={"lg"}>
        <Grid container rowSpacing={3} columnSpacing={6}>
          <Grid xs={12} md={7}>
            <FormStep showTitle showContent title={"Mes informations personnelles"} noDivider>
              <Form
                validationSchema={yup.object({
                  firstName: requiredString,
                  lastName: requiredString,
                  phone: requiredPhone,
                })}
                initialValues={currentUser}
                onSubmit={onSubmit}
                successText={"Modifications enregistrées"}>
                {(register) => (
                  <Stack gap={3}>
                    <UserFormElements register={register} />

                    <FormInput
                      label="Email"
                      name={"email"}
                      placeholder="email@example.com"
                      type={"email"}
                      register={register}
                    />

                    <FormInput
                      label="Nouveau mot de passe"
                      name={"newPassword"}
                      placeholder="mot de passe"
                      type={"password"}
                      register={register}
                    />

                    <FormInput
                      label="Confirmez le nouveau mot de passe"
                      name={"confirmNewPassword"}
                      placeholder="mot de passe"
                      type={"password"}
                      register={register}
                    />

                    <Button loading={isUpdatingUser} type="submit" size="lg" color="success">
                      Enregistrer les modifications
                    </Button>
                  </Stack>
                )}
              </Form>
              <Divider sx={{mt: 4, mb: 1, display: {md: "none"}}} />
            </FormStep>
          </Grid>

          <Grid xs={12} md={5}>
            <Stack gap={3}>
              <Card variant={"soft"}>
                {currentUser?.companies?.length > 0 ? (
                  <Stack gap={2}>
                    <Typography level={"h3"}>
                      {t("company.myCompany", {count: currentUser?.companies?.length})}
                    </Typography>
                    <Typography>Consultez vos offres en cours en cliquant ci-dessous.</Typography>

                    <AuthButton.CompanyOffersList currentUser={currentUser} />
                  </Stack>
                ) : (
                  <Stack gap={2}>
                    <Typography level={"h3"}>Mes rendez-vous</Typography>
                    <Typography>Consultez vos rendez-vous en cours sur la page dédiée.</Typography>

                    <Button component={ReactRouterLink} to={"/account/my-meetings"}>
                      Voir mes rendez-vous en cours
                    </Button>
                  </Stack>
                )}
              </Card>

              <Card variant={"soft"}>
                <Stack gap={2}>
                  <Typography level={"h3"}>Gestion du compte</Typography>

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
          </Grid>
        </Grid>
      </PageContent>
    </>
  );
}
