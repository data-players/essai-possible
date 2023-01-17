import {useSelector} from "react-redux";
import {useNavigate} from "react-router-dom";
import * as React from "react";

import {selectCurrentUser, useLogInMutation, useSignUpMutation} from "../../app/auth-slice.js";
import Grid from "@mui/joy/Grid";
import TextField from "@mui/joy/TextField";
import Stack from "@mui/joy/Stack";
import Button from "@mui/joy/Button";
import {PageContent} from "../../components/Layout.jsx";
import {Form} from "../../components/atoms.jsx";

export const AuthComponent = ({mode, redirect = false}) => {
  const navigate = useNavigate();

  const currentUser = useSelector(selectCurrentUser);

  // Log in and sign up actions
  const [logIn, {isLoading: isLogInLoading}] = useLogInMutation();
  const [signUp, {isLoading: isSignUpLoading}] = useSignUpMutation();

  const isLoginPage = mode === "logIn";

  async function onSubmit(values) {
    const mutation = isLoginPage ? logIn : signUp;
    await mutation(values).unwrap();
  }

  // Redirect user to home page if it is already connected
  if (redirect && currentUser) {
    navigate("/");
    return;
  }

  return (
    <PageContent mb={0}>
      <Form
        initialValues={{
          ...(!isLoginPage && {
            firstName: "",
            lastName: "",
          }),
          email: "",
          password: "",
        }}
        onSubmit={onSubmit}
        successText={isLoginPage ? "Connexion réussie" : "Compte créé avec succès"}>
        {(register) => (
          <Grid container columnSpacing={4} rowSpacing={3}>
            {!isLoginPage && (
              <>
                <Grid md={6} xs={12}>
                  <TextField label="Prénom" placeholder="prénom" {...register("firstName")} />
                </Grid>
                <Grid md={6} xs={12}>
                  <TextField label="Nom" placeholder="nom" {...register("lastName")} />
                </Grid>
              </>
            )}
            <Grid md={6} xs={12}>
              <TextField label="Email" placeholder="email@example.com" {...register("email")} />
            </Grid>
            <Grid md={6} xs={12}>
              <TextField
                label="Numéro de téléphone"
                placeholder="+33 6 12 34 56 78"
                {...register("phone")}
              />
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
                <Button
                  loading={isLoginPage ? isLogInLoading : isSignUpLoading}
                  type="submit"
                  size="lg"
                  color="success">
                  {isLoginPage ? "Se connecter" : "Créer mon compte"}
                </Button>
              </Stack>
            </Grid>
          </Grid>
        )}
      </Form>
    </PageContent>
  );
};
