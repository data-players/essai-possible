import Button from "@mui/joy/Button";
import {
  authActions,
  selectCurrentUser,
  useDeleteUserMutation,
  userDefaultValues,
  userValidationSchema,
  useUpdateUserMutation,
} from "../../app/auth-slice.js";
import {
  selectAllCompanies,
  useAddCompanyMutation,
  selectCompanyById,
} from "../offers/companies-slice.js";
import * as React from "react";
import {useDispatch, useSelector} from "react-redux";
import {Link as ReactRouterLink, useNavigate} from "react-router-dom";
import {ButtonWithConfirmation, ExternalLink, SimpleBanner} from "../../components/atoms";
import {FormStep,FormInput} from "../../components/forms";
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
import Autocomplete from "@mui/joy/Autocomplete";
import Link from "@mui/joy/Link";
import Chip from "@mui/joy/Link";
import Collapse from "@mui/material/Collapse";
import {useEffect, useState} from "react";
import {CompanyFormElements} from "../company/CompanyFormElements";


export default function PageAccount() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [openSnackbar] = useSnackbar();
  const [askAfilitionMode,setAskAfilitionMode] = useState(false);
  const [newCompanyMode, setNewCompanyMode] = useState(false);

  const [updateUser, {isLoading: isUpdatingUser}] = useUpdateUserMutation();
  const [addCompany, {isLoading: isAddingCompany}] = useAddCompanyMutation();
  const [deleteUser, {isLoading: isDeletingUser}] = useDeleteUserMutation();

  const currentUser = useSelector(selectCurrentUser);
  const companies = useSelector(selectAllCompanies);
  const eligibleCompanies = companies.filter(c=>!currentUser?.askedCompanies?.includes(c.id) && !currentUser?.companies?.includes(c.id));


  const ItemAskedAffiliations = ({companyId}) => {
    const company = useSelector((state) => selectCompanyById(state, companyId));
    return (
      // <Chip variant="solid" m={1} onClick={(e)=>{
      //   navigate(`/company/${company.id}`)
      // }}>
      <Chip variant="solid" m={1}  style={{ pointerEvents: 'none' }}>
        {company?.name}
      </Chip>
    );
  };

  async function onSubmit(values) {
    await updateUser(values).unwrap();
  }

  async function onSubmitAffiliation(values) {
    let updatedValues = {...currentUser};
    // Add the selected company to the user's companies asked for affiliation
    updatedValues.askedCompanies = [
      ...(updatedValues.askedCompanies || []),
      values.askedCompany.id,
    ];
    await updateUser(updatedValues).unwrap();
    setAskAfilitionMode(false);
  }

  async function onSubmitAffiliationNewCompany(values) {
    let updatedValues = {...currentUser};
    // Create the new company
    const newCompany = await addCompany(values).unwrap();
    // Add the new created company to the user's companies
    updatedValues.companies = [...(updatedValues.companies || []), newCompany.id];
    await updateUser(updatedValues).unwrap();
    setAskAfilitionMode(false);
    setNewCompanyMode(false);
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
                {(register, {values, setFieldValue, errors}) => (
                  <>
                    <FormStep showTitle showContent title={"Mes informations personnelles"}>
                      <Stack gap={3}>
                        <UserFormElements register={register} />
                      </Stack>
                    </FormStep>
                  </>
                )}
                </EditFormComponent>
              <Divider sx={{mt: 4, mb: 1, display: {md: "none"}}} />
            </Grid>

            <Grid xs={12} md={5}>
              <Stack gap={5}>
                { currentUser?.companies?.length > 0 &&
                  (
                    <Stack gap={2}>
                      <Typography level={"h3"}>
                        {t("company.myCompany", {count: currentUser?.companies?.length})}
                      </Typography>
                      <Typography>Publier des offres et modifier votre entreprise.</Typography>

                      <AuthButton.CompanyOffersList currentUser={currentUser} />
                    </Stack>
                  )
                }
                { currentUser?.slots?.length > 0 &&
                  <Stack gap={2}>
                    <Typography level={"h3"}>Mes rendez-vous</Typography>
                    <Typography>
                      Consultez vos rendez-vous en cours sur la page dédiée.
                    </Typography>
                    <Button component={ReactRouterLink} to={"/account/my-meetings"}>
                      Voir mes rendez-vous en cours
                    </Button>
                  </Stack>
                }

              <Card variant={"soft"}>
                <Stack gap={2}>
                  <Typography level={"h3"}>Gestion du compte</Typography>
                  <Button
                    color={"danger"}
                    onClick={async () => {
                      navigate("/login?loggedOut");
                      await dispatch(authActions.logOut());
                      openSnackbar("Déconnexion réussie", {color: "success"});
                    }}>
                    Se déconnecter
                  </Button>
               </Stack>
              </Card>
              <Card variant={"soft"}>
                  <Stack gap={2}>
                    <Typography level={"h3"}>{t("company.askAffiliation.title")}</Typography>
                    <Typography>{t("company.askAffiliation.button")} {t("company.askAffiliation.more")}</Typography>
                    {!askAfilitionMode &&
                      <Button onClick={(e)=>{
                        e.preventDefault();
                        setAskAfilitionMode(true);
                        }}>
                        {t("company.askAffiliation.button")}
                      </Button>
                    }

                    <Collapse in={askAfilitionMode}>
                      <Stack gap={0}>
                      { currentUser.askedCompanies && 
                        <>
                          {(currentUser.askedCompanies||[]).length>0 &&
                            <Typography level={"h4"}>{"Vous avez déjà demandé à etre rattaché à ces entreprises"}</Typography>
                          }
                          {(currentUser.askedCompanies||[]).map((askedAffiliation,index)=>(
                            <ItemAskedAffiliations companyId={askedAffiliation} key={index}></ItemAskedAffiliations>
                          ))}
                        </>
                      }
                      

                      </Stack>
                      { newCompanyMode ? (
                        <EditFormComponent
                        component={Stack}
                        bgcolor="white"
                        p={2}
                        mt={1}
                        borderRadius={2}
                        onSubmit={onSubmitAffiliationNewCompany}
                        validationButtonText= "initiliser votre entreprise">
                        {(register, {values, setFieldValue, errors}) => (

                          <>
                            <Typography  mt={-2}>
                              Vous pourrez modifier les informations de votre entreprise ultérieurement.
                            </Typography>
                            <CompanyFormElements
                              register={register}
                              setFieldValue={setFieldValue}
                            />
                          </>                          
                        )}
                        </EditFormComponent>
                      ) : (
                        <EditFormComponent
                        component={Stack}
                        bgcolor="white"
                        p={2}
                        mt={1}
                        borderRadius={2}
                        onSubmit={onSubmitAffiliation}
                        validationButtonText= {t("company.askAffiliation.button")}>
                      {(register, {values, setFieldValue, errors}) => (
                        <>
                            <FormInput
                            component={Autocomplete}
                            name={"askedCompany"}
                            label={t("company.askAffiliation.button")}
                            placeholder={"sélectionnez votre entreprise"}
                            getOptionLabel={(company) => `${company.name} - ${company?.siret}`}
                            options={eligibleCompanies}
                            register={register}
                            onChange={(_, value) => setFieldValue("askedCompany", value)}
                            errors={errors.askedCompany?.length > 0 ? "Veuillez renseigner une entreprise" : ""} />
                        </>                          
                        )}
                        </EditFormComponent>

                      )}

                        <Stack textAlign={"center"} alignItems={"center"}>
                          <Typography sx={{ opacity: 0.7 }}>
                            {!newCompanyMode
                              ? "Vous ne trouvez pas votre entreprise ?"
                              : "Votre entreprise est déjà référencée ?"}
                          </Typography>
                          <Link onClick={(e) => {
                              e.preventDefault();
                              setNewCompanyMode(!newCompanyMode);
                            }}>
                            {!newCompanyMode ? "Ajoutez la vôtre !": "Revenir aux entreprises existantes"}
                          </Link>
                        </Stack>          
                    </Collapse>
                  </Stack>
                </Card>

                {/* <Stack gap={2}>
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
                */}
              </Stack>
            </Grid>
          </Grid>
        </PageContent>
      </>
    )
  );
}
