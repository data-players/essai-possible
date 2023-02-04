import Button from "@mui/joy/Button";
import {
  authActions,
  selectCurrentUser,
  useDeleteUserMutation,
  userDefaultValues,
  userValidationSchema,
  useUpdateUserMutation,
} from "../../app/auth-slice.js";
import * as React from "react";
import {useDispatch, useSelector} from "react-redux";
import {Link as ReactRouterLink, useNavigate} from "react-router-dom";
import {ButtonWithConfirmation, ExternalLink, SimpleBanner} from "../../components/atoms";
import {FormStep} from "../../components/forms";
import {PageContent} from "../../components/Layout";
import Typography from "@mui/joy/Typography";
import Card from "@mui/joy/Card";
import Grid from "@mui/joy/Grid";
import Stack from "@mui/joy/Stack";
import {useSnackbar} from "../../components/snackbar.jsx";
import {t} from "i18next";
import {AuthButton} from "../../components/Layout.jsx";
import Divider from "@mui/joy/Divider";
import {UserFormElements} from "./UserFormElements.jsx";
import EditFormComponent from "../../components/EditFormComponent.jsx";
import LaunchRoundedIcon from "@mui/icons-material/LaunchRounded";

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
    currentUser && (
      <>
        <SimpleBanner>Mon compte</SimpleBanner>

        <PageContent gap={3} mt={6} maxWidth={"lg"}>
          <Grid container rowSpacing={3} columnSpacing={6}>
            <Grid xs={12} md={7}>
              <EditFormComponent
                helpBox={
                  <>
                    <Typography fontWeight={"lg"}>
                      Vous êtes identifié·e avec votre compte Les Communs.
                    </Typography>

                    <Typography component={"ul"}>
                      <li>
                        <strong>Nom :</strong> {currentUser.firstName} {currentUser.lastName}
                      </li>
                      <li>
                        <strong>Email :</strong> {currentUser.email}
                      </li>
                      <li>
                        <strong>Mot de passe :</strong> ●●●●●●●●●
                      </li>
                    </Typography>

                    <Typography>
                      Ces informations sont gérées par Les Communs. Pour les modifiez, rendez-vous
                      dans votre espace Les Communs.
                    </Typography>

                    <ExternalLink
                      href={"https://login.lescommuns.org/auth/realms/master/account"}
                      startDecorator={<LaunchRoundedIcon />}>
                      Voir mon espace Les Communs
                    </ExternalLink>
                    <ExternalLink
                      href={"https://lescommuns.org/"}
                      startDecorator={<LaunchRoundedIcon />}>
                      C'est quoi, Les Communs ?
                    </ExternalLink>
                  </>
                }
                component={Stack}
                mt={0}
                validationSchema={userValidationSchema}
                updateLoading={isUpdatingUser}
                initialValues={{...userDefaultValues, ...currentUser}}
                onSubmit={onSubmit}>
                {(register) => (
                  <FormStep showTitle showContent title={"Mes informations personnelles"}>
                    <Stack gap={3}>
                      <UserFormElements register={register} />
                    </Stack>
                  </FormStep>
                )}
              </EditFormComponent>
              <Divider sx={{mt: 4, mb: 1, display: {md: "none"}}} />
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
                      <Typography>
                        Consultez vos rendez-vous en cours sur la page dédiée.
                      </Typography>

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
                        navigate("/login?loggedOut");
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
    )
  );
}
