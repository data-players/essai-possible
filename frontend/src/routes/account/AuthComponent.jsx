import {useSelector} from "react-redux";
import {useNavigate} from "react-router-dom";
import * as React from "react";
import {useEffect} from "react";

import {
  connectToLesCommunsFn,
  selectCurrentUser,
  userDefaultValues,
  userValidationSchema,
  useUpdateUserMutation,
} from "../../app/auth-slice.js";
import Stack from "@mui/joy/Stack";
import Button from "@mui/joy/Button";
import {Form, FormInput} from "../../components/forms.jsx";
import * as yup from "yup";
import {requiredPhone, requiredString, requiredTrueBoolean} from "../../app/fieldValidation.js";
import Typography from "@mui/joy/Typography";
import {selectAllMeetings, selectMeetingsReady} from "../offers/book/meetings-slice.js";
import {UserFormElements} from "./UserFormElements.jsx";
import LesCommunsLogo from "../../assets/les-communs-logo.png";
import Box from "@mui/joy/Box";
import {selectAllCompanies, useFetchCompaniesQuery} from "../offers/companies-slice.js";
import {HelpBox} from "../../components/atoms";
import Option from "@mui/joy/Option";
import Select from "@mui/joy/Select";
import Checkbox from "@mui/joy/Checkbox";
import Collapse from "@mui/material/Collapse";

/**
 * @param logInMode true = logIn | false = signUp
 * @param redirect true = redirect if logged in and user complete
 */
export const AuthComponent = ({logInMode, redirect = false, companyMode}) => {
  const navigate = useNavigate();

  useFetchCompaniesQuery();

  const currentUser = useSelector(selectCurrentUser);
  const currentUserIsComplete = currentUser && userValidationSchema.isValidSync(currentUser);
  const meetings = useSelector(selectAllMeetings);
  const meetingsReady = useSelector(selectMeetingsReady);
  const companies = useSelector(selectAllCompanies);

  const [updateUser] = useUpdateUserMutation();

  // Redirect user to the offers page if it is a basic user, to its meetings
  // if it has already meetings, and to the company offers if it is a pro account
  useEffect(() => {
    if (currentUserIsComplete && redirect && meetingsReady) {
      navigate(
        currentUser.companies?.length > 0
          ? `/company/${encodeURIComponent(currentUser.companies[0])}`
          : meetings.length > 0
          ? "/account/my-meetings"
          : "/offers"
      );
    }
  }, [currentUserIsComplete, redirect, meetingsReady]);

  async function onSubmit(values) {
    if (values.company) {
      values.companies = [values.company];
      delete values.company;
    }
    await updateUser(values).unwrap();
  }

  return (
    <Form
      initialValues={{
        ...userDefaultValues,
        ...currentUser,
        ...(companyMode && {company: null}),
      }}
      validationSchema={yup.object({
        phone: requiredPhone,
        company: requiredString.nullable(),
        confirmCompany: requiredTrueBoolean,
      })}
      onSubmit={onSubmit}
      successText={logInMode ? "Connexion réussie" : "Compte créé avec succès"}>
      {(register, {values, setFieldValue}) => (
        <Stack gap={3}>
          <>
            {/* WELCOME MESSAGE */}
            {currentUser ? (
              <HelpBox color={"success"}>
                <Typography>
                  <strong>Bonjour {currentUser.firstName} !</strong> Vous êtes identifié avec Les
                  Communs.
                </Typography>
              </HelpBox>
            ) : (
              <Typography textAlign={"center"} fontWeight={"lg"}>
                {logInMode
                  ? "Connectez-vous à Essai Possible en vous identifiant sur le portail des Communs."
                  : "Créez-vous un compte sur Essai Possible en vous identifiant sur le portail des Communs."}
              </Typography>
            )}

            {/* LOGO LES COMMUNS */}
            <Box component={"img"} src={LesCommunsLogo} height={50} alignSelf={"center"} />

            {/* USER INFORMATION */}
            {currentUser && !currentUserIsComplete ? (
              <>
                <HelpBox>
                  <Typography fontWeight={"lg"}>
                    Complétez vos informations personnelles pour finaliser votre inscription sur
                    Essai Possible.
                  </Typography>
                </HelpBox>
                <UserFormElements register={register} companyMode={companyMode} />

                {companyMode && (
                  <>
                    <FormInput
                      label={"Votre entreprise"}
                      placeholder={"sélectionnez votre entreprise"}
                      component={(props) => (
                        <Select
                          {...props}
                          variant={"soft"}
                          onChange={(_, value) => {
                            setFieldValue("company", value);
                          }}>
                          {companies.map((company) => (
                            <Option value={company.id}>{company.name}</Option>
                          ))}
                        </Select>
                      )}
                    />

                    <Collapse in={!!values.company}>
                      <Stack gap={2}>
                        <Typography>
                          Le numéro de SIRET de cette entreprise est le{" "}
                          <strong>{values.company}</strong>. Confirmez-vous que c'est bien votre
                          entreprise ?
                        </Typography>

                        <FormInput
                          component={({value, ...props}) => (
                            <Stack direction={"row"}>
                              <Checkbox
                                {...props}
                                checked={value}
                                sx={{fontWeight: "lg"}}
                                label={`Je confirme que j'ai bien vérifié le numéro de SIRET.`}
                              />
                            </Stack>
                          )}
                          register={register}
                          name={"confirmCompany"}
                        />
                      </Stack>
                    </Collapse>
                  </>
                )}

                <Button loading={false} type="submit" size="lg" color="success">
                  {logInMode ? "Se connecter" : "Créer mon compte"}
                </Button>
              </>
            ) : (
              <Button size="lg" color="primary" onClick={connectToLesCommunsFn()}>
                S'identifier avec Les Communs
              </Button>
            )}
          </>
        </Stack>
      )}
    </Form>
  );
};
