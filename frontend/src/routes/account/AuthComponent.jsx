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
// import {selectAllMeetings, selectMeetingsReady} from "../offers/book/meetings-slice.js";
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
export const AuthComponent = ({logInMode, redirectUrl, redirectComplete, welcomeInfo,redirect = false, companyMode}) => {
  const navigate = useNavigate();
  const [siretNumbersVisible, setSiretNumbersVisible] = useState(false);
  const [newCompanyMode, setNewCompanyMode] = useState(false);

  // useFetchCompaniesQuery();
  const [updateUser, {isLoading: isUpdatingUser}] = useUpdateUserMutation();
  const [addCompany, {isLoading: isAddingCompany}] = useAddCompanyMutation();
  // const isUpdatingUser = false;
  // const isAddingCompany = false;

  const currentUser = useSelector(selectCurrentUser);
  const companies = useSelector(selectAllCompanies);
  const authTokenExists = useSelector(selectAuthTokenExists);
  // const meetings = useSelector(selectAllMeetings);
  // const meetingsReady = useSelector(selectMeetingsReady);

  const currentUserIsComplete = currentUser && userValidationSchema.isValidSync(currentUser);

  useEffect(()=>{
    if(currentUserIsComplete && redirectComplete){
      navigate(redirectComplete);
    }
  })


  // const specificRedirections= [
  //   {
  //     source : 'login',
  //     target : 'account'
  //   }
  // ]
  // // let pathName = window.location.host+window.location.pathname;
  // let pathName = window.location.href;
  // for (const specificRedirection of specificRedirections) {

  //   if (pathName.includes(specificRedirection.source)){
  //     pathName = pathName.replace(specificRedirection.source,specificRedirection.target);
  //   }
  // }
  // redirectUrl = redirectUrl||window.location
  // console.log('pathName',pathName)

  // const currentUserIsComplete = false;

  // Redirect user to the offers page if it is a basic user, to its meetings
  // if it has already meetings, and to the company offers if it is a pro account
  // useEffect(() => {
  //   if (currentUserIsComplete && redirect && meetingsReady) {
  //     navigate(
  //       currentUser.companies?.length > 0
  //         ? `/company/${encodeURIComponent(currentUser.companies[0])}`
  //         : meetings.length > 0
  //           ? "/account/my-meetings"
  //           : "/offers"
  //     );
  //   }
  // }, [currentUserIsComplete, currentUser, redirect, meetingsReady, meetings]);


  async function onSubmit(values) {
    console.log('UPDATE')
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

  // If we are waiting for the user to be loaded, show loading
  if (authTokenExists && !currentUser) return <LoadingSpinner />;
  console.log('companyMode',companyMode)

  return (
    <>
      {/* WELCOME MESSAGE TOP*/}
      {currentUser ? (
        <>
         {welcomeInfo &&
                 <HelpBox color={"success"}>
                 <Box component={"img"} src={LesCommunsLogo} height={50} alignSelf={"center"} />
                 <Typography>
                   <strong>Bonjour {currentUser.firstName} !</strong> Vous êtes identifié avec Les Communs.
                 </Typography>
               </HelpBox>
         }
        </>
      ) : (
        <>
          <Box component={"img"} src={LesCommunsLogo} height={50} alignSelf={"center"} />
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

      {/* USER INFORMATION FORM */}
      {currentUser ? (
        <EditFormComponent
          component={Stack}
          m={0}
          validationButtonText={logInMode ? "Se connecter" : "Mettre à jour"}
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
          successText={logInMode ? "Connexion réussie" : "Compte mis à jour avec succès"}
          >
          {(register, {values, setFieldValue, errors}) => (

              <UserFormElements
                register={register}
                companyMode={companyMode}
                baseFormPath={"user"}
              />

          )}
        </EditFormComponent>
      ) : (
        // USER NOT IDENTIFIED --> Ask for identification with Les Communs
        <ButtonWithLoading size="lg" color="primary" onClick={(e)=>{connectToLesCommuns(redirectUrl)}}>
          S'identifier avec Les Communs
        </ButtonWithLoading>
      )}
    </>
  );
};
