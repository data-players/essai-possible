import {useDispatch, useSelector} from "react-redux";
import {useNavigate} from "react-router-dom";
import * as React from "react";
import {useFormik} from "formik";

import {
  authActions,
  selectCurrentUser,
  useLogInMutation,
  useSignUpMutation,
} from "../../app/auth-slice.js";
import Grid from "@mui/joy/Grid";
import TextField from "@mui/joy/TextField";
import Stack from "@mui/joy/Stack";
import Button from "@mui/joy/Button";

export const AuthComponent = ({mode, redirect = false}) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const currentUser = useSelector(selectCurrentUser());

  // Redirect user to home page if it is already connected
  if (redirect && currentUser) navigate("/");

  const isLoginPage = mode === "logIn";

  // Log in and sign up actions
  const [logIn, {isLoading: isLogInLoading}] = useLogInMutation();
  const [signUp, {isLoading: isSignUpLoading}] = useSignUpMutation();

  // Form setup
  // https://formik.org/docs/examples/with-material-ui
  const {handleSubmit, handleChange, values} = useFormik({
    initialValues: {
      email: "",
      password: "",
      ...(!isLoginPage && {
        firstName: "",
        lastName: "",
      }),
    },
    onSubmit: async (values) => {
      try {
        const mutation = isLoginPage ? logIn : signUp;
        const {token, user} = await mutation(values).unwrap();
        dispatch(authActions.setUser(user));
        dispatch(authActions.setToken(token));
      } catch (err) {
        console.error(err);
      }
    },
  });

  return (
    // <PageContent>
    <form onSubmit={handleSubmit}>
      <Grid container columnSpacing={4} rowSpacing={3}>
        {!isLoginPage && (
          <>
            <Grid md={6} xs={12}>
              <TextField
                label="Prénom"
                placeholder="prénom"
                name="firstName"
                value={values.firstName}
                onChange={handleChange}
              />
            </Grid>
            <Grid md={6} xs={12}>
              <TextField
                label="Nom"
                name="lastName"
                value={values.lastName}
                onChange={handleChange}
                placeholder="nom"
              />
            </Grid>
          </>
        )}
        <Grid xs={12}>
          <TextField
            label="Email"
            placeholder="email@example.com"
            name="email"
            value={values.email}
            onChange={handleChange}
          />
        </Grid>
        <Grid xs={12}>
          <TextField
            label="Mot de passe"
            name="password"
            value={values.password}
            onChange={handleChange}
            placeholder="mot de passe"
          />
        </Grid>
        <Grid xs={12}>
          <Stack mt={2}>
            <Button
              loading={isLoginPage ? isLogInLoading : isSignUpLoading}
              type="submit"
              size="lg"
              color="primary">
              {isLoginPage ? "Se connecter" : "Créer mon compte"}
            </Button>
          </Stack>
        </Grid>
      </Grid>
    </form>
    // </PageContent>
  );
};
