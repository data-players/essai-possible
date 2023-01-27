import {useSelector} from "react-redux";
import {useNavigate} from "react-router-dom";
import * as React from "react";
import {useEffect} from "react";

import {selectCurrentUser, useLogInMutation, useSignUpMutation} from "../../app/auth-slice.js";
import Stack from "@mui/joy/Stack";
import Button from "@mui/joy/Button";
import {Form} from "../../components/atoms.jsx";
import * as yup from "yup";
import {requiredPhone, requiredString} from "../../app/fieldValidation.js";
import Typography from "@mui/joy/Typography";
import {selectAllMeetings, selectMeetingsReady} from "../offers/book/meetings-slice.js";
import {UserFormElements} from "./UserFormElements.jsx";

/**
 * @param mode logIn | signUp
 */
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
  useEffect(() => {
    if (redirect && currentUser && meetingsReady) {
      navigate(
        currentUser.companies?.length > 0
          ? `/company/${currentUser.companies[0]}`
          : meetings.length > 0
          ? "/account/my-meetings"
          : "/offers"
      );
    }
  }, [redirect, currentUser, meetingsReady]);

  return (
    <>
      <Stack gap={3} alignItems={"center"} mb={6}>
        <Typography level={"h3"}>Fausse authentification</Typography>
        <Button size={"lg"} onClick={mockConnect(1)}>
          Candidat
        </Button>
        <Button size={"lg"} onClick={mockConnect(2)}>
          Professionnel
        </Button>
      </Stack>

      <Form
        initialValues={{
          firstName: "",
          lastName: "",
          phone: "",
        }}
        validationSchema={yup.object({
          firstName: requiredString,
          lastName: requiredString,
          phone: requiredPhone,
        })}
        onSubmit={onSubmit}
        successText={isLoginPage ? "Connexion réussie" : "Compte créé avec succès"}>
        {(register) => (
          <Stack gap={3}>
            <Button size="lg" color="primary">
              S'identifier avec Les Communs
            </Button>

            {!isLoginPage && <UserFormElements register={register} />}

            <Button
              loading={isLoginPage ? isLogInLoading : isSignUpLoading}
              type="submit"
              size="lg"
              color="success">
              {isLoginPage ? "Se connecter" : "Créer mon compte"}
            </Button>
          </Stack>
        )}
      </Form>
    </>
  );
};
