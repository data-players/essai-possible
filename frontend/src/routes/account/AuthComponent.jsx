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
import {selectAllMeetings, selectMeetingsReady} from "../offers/book/meetings-slice.js";

export const AuthComponent = ({mode, redirect = false}) => {
  const navigate = useNavigate();

  const isLoginPage = mode === "logIn";

  const currentUser = useSelector(selectCurrentUser);
  const meetings = useSelector(selectAllMeetings);
  const meetingsReady = useSelector(selectMeetingsReady);

  // Log in and sign up actions
  const [logIn, {isLoading: isLogInLoading}] = useLogInMutation();
  const [signUp, {isLoading: isSignUpLoading}] = useSignUpMutation();

  async function onSubmit(values) {
    const mutation = isLoginPage ? logIn : signUp;
    await mutation(values).unwrap();
  }

  const mockConnect = (id) => async () => {
    await logIn(id).unwrap();
  };

  // Redirect user to the offers page if it is a basic user, to its meetings
  // if it has already meetings, and to the company offers if it is a pro account
  if (redirect && currentUser && meetingsReady) {
    navigate(
      currentUser.companies?.length > 0
        ? `/company/${currentUser.companies[0]}`
        : meetings.length > 0
        ? "/my-meetings"
        : "/offers"
    );
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
            <Grid md={isLoginPage ? 12 : 6} xs={12}>
              <FormInput
                label="Email"
                name={"email"}
                placeholder="email@example.com"
                type={"email"}
                register={register}
              />
            </Grid>
            {!isLoginPage && (
              <Grid md={6} xs={12}>
                <FormInput
                  label="Numéro de téléphone"
                  name={"phone"}
                  placeholder="+33 6 12 34 56 78"
                  type={"tel"}
                  register={register}
                />
              </Grid>
            )}
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
