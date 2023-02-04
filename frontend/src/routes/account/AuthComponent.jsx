import {useSelector} from "react-redux";
import {useNavigate} from "react-router-dom";
import * as React from "react";
import {useEffect, useState} from "react";

import {
  connectToLesCommuns,
  selectAuthTokenExists,
  selectCurrentUser,
  userDefaultValues,
  userValidationSchema,
  useUpdateUserMutation,
} from "../../app/auth-slice.js";
import Stack from "@mui/joy/Stack";
import {FormInput} from "../../components/forms.jsx";
import * as yup from "yup";
import {requiredString, requiredTrueBoolean} from "../../app/fieldValidation.js";
import Typography from "@mui/joy/Typography";
import {selectAllMeetings, selectMeetingsReady} from "../offers/book/meetings-slice.js";
import {UserFormElements} from "./UserFormElements.jsx";
import LesCommunsLogo from "../../assets/les-communs-logo.png";
import Box from "@mui/joy/Box";
import {
  companyDefaultValues,
  companyValidationSchema,
  selectAllCompanies,
  useAddCompanyMutation,
  useFetchCompaniesQuery,
} from "../offers/companies-slice.js";
import {ButtonWithLoading, HelpBox, LoadingSpinner} from "../../components/atoms";
import Checkbox from "@mui/joy/Checkbox";
import Collapse from "@mui/material/Collapse";
import Autocomplete from "@mui/joy/Autocomplete";
import Link from "@mui/joy/Link";
import {CompanyFormElements} from "../company/CompanyFormElements";
import EditFormComponent from "../../components/EditFormComponent";

/**
 * @param logInMode true = logIn | false = signUp
 * @param redirect true = redirect if logged in and user complete
 */
export const AuthComponent = ({logInMode, redirect = false, companyMode}) => {
  const navigate = useNavigate();
  const [siretNumbersVisible, setSiretNumbersVisible] = useState(false);
  const [newCompanyMode, setNewCompanyMode] = useState(false);

  useFetchCompaniesQuery();
  const [updateUser, {isLoading: isUpdatingUser}] = useUpdateUserMutation();
  const [addCompany, {isLoading: isAddingCompany}] = useAddCompanyMutation();

  const currentUser = useSelector(selectCurrentUser);
  const companies = useSelector(selectAllCompanies);
  const authTokenExists = useSelector(selectAuthTokenExists);
  const meetings = useSelector(selectAllMeetings);
  const meetingsReady = useSelector(selectMeetingsReady);

  const currentUserIsComplete = currentUser && userValidationSchema.isValidSync(currentUser);

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
  }, [currentUserIsComplete, currentUser, redirect, meetingsReady, meetings]);

  async function onSubmit(values) {
    if (companyMode) {
      if (newCompanyMode) {
        // Create the new company
        const newCompany = await addCompany(values.newCompany).unwrap();
        // Add the new created company to the user's companies
        values.user.companies = [...(values.user.companies || []), newCompany.id];
      } else {
        // Add the selected company to the user's companies asked for affiliation
        values.user.askedCompanies = [
          ...(values.user.askedCompanies || []),
          values.askedCompany.id,
        ];
      }
    }
    await updateUser(values.user).unwrap();
  }

  console.log(currentUserIsComplete, currentUser);

  // If we are waiting for the user to be loaded, show loading
  if (authTokenExists && !currentUser) return <LoadingSpinner />;

  return (
    <>
      {/* WELCOME MESSAGE TOP*/}
      {currentUser ? (
        <HelpBox color={"success"}>
          <Typography>
            <strong>Bonjour {currentUser.firstName} !</strong> Vous êtes identifié avec Les Communs.
          </Typography>
        </HelpBox>
      ) : (
        <>
          <Typography textAlign={"center"} fontWeight={"lg"}>
            {logInMode
              ? "Connectez-vous à Essai Possible en vous identifiant sur le portail des Communs."
              : "Créez-vous un compte sur Essai Possible en vous identifiant sur le portail des Communs."}
          </Typography>
          {companyMode && (
            <Typography textAlign={"center"} mt={-2}>
              Vous pourrez ensuite renseigner votre entreprise.
            </Typography>
          )}
        </>
      )}
      {/* LOGO LES COMMUNS */}
      <Box component={"img"} src={LesCommunsLogo} height={50} alignSelf={"center"} />

      {/* USER INFORMATION FORM */}
      {currentUser && !currentUserIsComplete ? (
        <EditFormComponent
          component={Stack}
          m={0}
          validationButtonText={logInMode ? "Se connecter" : "Créer mon compte"}
          isEditMode={false}
          updateLoading={isUpdatingUser || isAddingCompany}
          initialValues={{
            user: {...userDefaultValues, ...currentUser},
            askedCompany: null,
            newCompany: companyDefaultValues,
            confirmAskedCompany: false,
          }}
          validationSchema={yup.object({
            user: userValidationSchema,
            ...(companyMode &&
              (newCompanyMode
                ? // If creating a new company, we ask for all the company schema
                  {newCompany: companyValidationSchema}
                : // If selecting a company, we just ask for the id that's enough
                  {
                    askedCompany: yup.object({id: requiredString}),
                    confirmAskedCompany: requiredTrueBoolean,
                  })),
          })}
          onSubmit={onSubmit}
          successText={logInMode ? "Connexion réussie" : "Compte créé avec succès"}>
          {(register, {values, setFieldValue, errors}) => (
            <Stack gap={3}>
              {/* USER IS IDENTIFIED WITH LES COMMUNS --> Ask for missing info before creating account */}
              <HelpBox>
                <Typography fontWeight={"lg"}>
                  Complétez vos informations personnelles pour finaliser votre inscription sur Essai
                  Possible.
                </Typography>
              </HelpBox>

              <UserFormElements
                register={register}
                companyMode={companyMode}
                baseFormPath={"user"}
              />

              {companyMode && (
                <>
                  {/* COMPANY MODE IS ON --> Ask for the company information */}

                  <Typography textAlign={"center"} color={"primary"} level={"h5"} mt={2}>
                    {newCompanyMode ? "Inscrivez votre entreprise" : "Trouvez votre entreprise"}
                  </Typography>

                  {newCompanyMode ? (
                    // New company --> Fill new company info
                    <>
                      <Typography textAlign={"center"} mt={-2}>
                        Vous pourrez modifier les informations de votre entreprise ultérieurement.
                      </Typography>
                      <CompanyFormElements
                        register={register}
                        setFieldValue={setFieldValue}
                        baseFormPath={"newCompany"}
                      />
                    </>
                  ) : (
                    // Existing company --> Select in the list + check verify SIRET
                    <>
                      <FormInput
                        component={Autocomplete}
                        name={"askedCompany"}
                        label={"Votre entreprise"}
                        placeholder={"sélectionnez votre entreprise"}
                        getOptionLabel={(company) =>
                          company.name + (siretNumbersVisible ? ` - ${company?.siret}` : "")
                        }
                        options={companies}
                        register={register}
                        onChange={(_, value) => setFieldValue("askedCompany", value)}
                        help={
                          <Checkbox
                            size={"sm"}
                            onChange={(event) => setSiretNumbersVisible(event.target.checked)}
                            label={"Afficher les numéros de  SIRET"}
                          />
                        }
                        errors={
                          errors.askedCompany?.length > 0 && "Veuillez renseigner une entreprise"
                        }
                        deps={siretNumbersVisible}
                      />

                      <Collapse in={!!values.askedCompany} sx={{my: -1.5}}>
                        <Stack gap={1} my={1.5}>
                          <Typography>
                            Le numéro de SIRET de cette entreprise est le{" "}
                            <strong>{values.askedCompany?.siret}</strong>. Confirmez-vous que c'est
                            bien votre entreprise ?
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
                            name={"confirmAskedCompany"}
                          />
                        </Stack>
                      </Collapse>
                    </>
                  )}

                  {/* Switch between new or existing company */}
                  <Stack textAlign={"center"} alignItems={"center"}>
                    <Typography sx={{opacity: 0.7}}>
                      {!newCompanyMode
                        ? "Vous ne trouvez pas votre entreprise ?"
                        : "Votre entreprise est déjà référencée ?"}
                    </Typography>
                    <Link onClick={() => setNewCompanyMode(!newCompanyMode)}>
                      {newCompanyMode ? "Revenir aux entreprises existantes" : "Ajoutez la vôtre !"}
                    </Link>
                  </Stack>
                </>
              )}
            </Stack>
          )}
        </EditFormComponent>
      ) : (
        // USER NOT IDENTIFIED --> Ask for identification with Les Communs
        <ButtonWithLoading size="lg" color="primary" onClick={connectToLesCommuns}>
          S'identifier avec Les Communs
        </ButtonWithLoading>
      )}
    </>
  );
};
