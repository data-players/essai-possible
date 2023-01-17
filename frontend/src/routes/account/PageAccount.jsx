import Button from "@mui/joy/Button";
import {
  authActions,
  selectCurrentUser,
  selectCurrentUserReady,
  useDeleteUserMutation,
  useFetchUserQuery,
  useUpdateUserMutation,
} from "../../app/auth-slice.js";
import * as React from "react";
import {useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {useNavigate} from "react-router-dom";
import {Form, LoadingSpinner} from "../../components/atoms";
import {PageContent} from "../../components/Layout";
import Typography from "@mui/joy/Typography";
import Card from "@mui/joy/Card";
import Grid from "@mui/joy/Grid";
import TextField from "@mui/joy/TextField";
import Stack from "@mui/joy/Stack";
import {useSnackbar} from "../../components/snackbar.jsx";

export default function PageAccount() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [openSnackbar] = useSnackbar();
  const [deleteAreYouSure, setDeleteAreYouSure] = useState(false);

  useFetchUserQuery();
  const [updateUser, {isLoading: isUpdatingUser}] = useUpdateUserMutation();
  const [deleteUser, {isLoading: isDeletingUser}] = useDeleteUserMutation();

  const currentUser = useSelector(selectCurrentUser);
  const currentUserReady = useSelector(selectCurrentUserReady);

  async function onSubmit(values) {
    await updateUser(values).unwrap();
  }

  if (!currentUserReady) return <LoadingSpinner />;

  return (
    <PageContent gap={3}>
      <Typography level={"h1"}>Mon compte</Typography>
      <Card variant={"soft"} invertedColors>
        <Form
          initialValues={currentUser}
          onSubmit={onSubmit}
          successText={"Modifications enregistrées"}>
          {(register) => (
            <Grid container columnSpacing={4} rowSpacing={3}>
              <Grid xs={12}>
                <Typography level={"h2"}>Informations personnelles</Typography>
              </Grid>
              <Grid md={6} xs={12}>
                <TextField label="Prénom" placeholder="prénom" {...register("firstName")} />
              </Grid>
              <Grid md={6} xs={12}>
                <TextField label="Nom" placeholder="nom" {...register("lastName")} />
              </Grid>
              <Grid xs={12}>
                <TextField label="Email" placeholder="email@example.com" {...register("email")} />
              </Grid>
              <Grid xs={12}>
                <TextField
                  label="Mot de passe"
                  placeholder="mot de passe"
                  {...register("password")}
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
      <Card variant={"soft"}>
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
          {!deleteAreYouSure ? (
            <Button color={"danger"} variant={"soft"} onClick={() => setDeleteAreYouSure(true)}>
              Supprimer mon compte
            </Button>
          ) : (
            <Card color={"danger"} variant={"solid"} invertedColors>
              <Stack gap={2}>
                <Typography>
                  Toutes les données de votre compte seront supprimées, y compris vos réservations
                  de rendez-vous.
                </Typography>
                <Button
                  loading={isDeletingUser}
                  onClick={async () => {
                    await deleteUser().unwrap();
                    openSnackbar("Suppression du compte réussie");
                    navigate("/");
                  }}>
                  Supprimer mon compte
                </Button>
              </Stack>
            </Card>
          )}
        </Stack>
      </Card>
    </PageContent>
  );
}
