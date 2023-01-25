import {useSelector} from "react-redux";
import {useNavigate} from "react-router-dom";
import * as React from "react";

import {selectCurrentUser, useLogInMutation, useSignUpMutation} from "../../app/auth-slice.js";
import Grid from "@mui/joy/Grid";
import Stack from "@mui/joy/Stack";
import Button from "@mui/joy/Button";
import {PageContent} from "../../components/Layout.jsx";
import {Form, FormInput} from "../../components/atoms.jsx";
import * as yup from "yup";
import {email, firstName, lastName, password, phone} from "../../app/fieldValidation.js";
import Typography from "@mui/joy/Typography";

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

  const mockConnect = (id) => async () => {
    await logIn(id).unwrap();
  };

  // Redirect user to home page if it is already connected
  if (redirect && currentUser) {
    navigate("/offers");
    return;
  }

  return (
    <PageContent mb={0}>
      <Stack gap={3} alignItems={"center"} my={6}>
        <Typography level={"h2"}>Fausse authentification</Typography>
        <Button size={"lg"} onClick={mockConnect(1)}>
          Candidat
        </Button>
        <Button size={"lg"} onClick={mockConnect(2)}>
          Professionnel
        </Button>
      </Stack>
      <Form
        initialValues={{
          ...(!isLoginPage && {
            firstName: "",
            lastName: "",
          }),
          email: "",
          password: "",
        }}
        validationSchema={yup.object({
          ...(!isLoginPage && {
            firstName,
            lastName,
          }),
          email,
          phone,
          password,
        })}
        onSubmit={onSubmit}
        successText={isLoginPage ? "Connexion réussie" : "Compte créé avec succès"}>
        {(register) => (
          <Grid container columnSpacing={4} rowSpacing={3}>
            {!isLoginPage && (
              <>
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
              </>
            )}
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
            <Grid xs={12}>
              <FormInput
                label="Mot de passe"
                name={"password"}
                placeholder="mot de passe"
                type={"password"}
                register={register}
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
