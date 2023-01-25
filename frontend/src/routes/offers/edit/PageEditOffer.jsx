import React, {useState} from "react";
import Stack from "@mui/joy/Stack";
import Typography from "@mui/joy/Typography";
import Button from "@mui/joy/Button";
import {
  ButtonWithConfirmation,
  CheckboxGroup,
  Form,
  FormInput,
  FormStep,
  LocationSearchBar,
  RadioGroup,
} from "../../../components/atoms.jsx";
import CheckIcon from "@mui/icons-material/Check";
import {HeroBanner, PageContent} from "../../../components/Layout.jsx";
import Textarea from "@mui/joy/Textarea";
import Collapse from "@mui/material/Collapse";
import {
  selectOfferById,
  selectOfferReady,
  useAddOfferMutation,
  useDeleteOfferMutation,
  useUpdateOfferMutation,
} from "../offers-slice.js";
import OfferBanner from "../OfferBanner.jsx";
import {useNavigate, useParams} from "react-router-dom";
import {useTranslationWithDates} from "../../../app/i18n.js";
import {useSelector} from "react-redux";
import Grid from "@mui/joy/Grid";
import Container from "@mui/joy/Container";
import {selectCompanyById, selectCompanyReady} from "../companies-slice";
import {sectorsOptions} from "../companies-slice-data.js";
import {
  goalOptions,
  offerDefaultValues,
  softSkillsOptions,
  statusOptions,
} from "../offers-slice-data.js";
import Box from "@mui/joy/Box";
import Divider from "@mui/joy/Divider";
import {
  email,
  location,
  phone,
  requiredArray,
  requiredNumber,
  requiredString,
  requiredUrl,
} from "../../../app/fieldValidation.js";
import * as yup from "yup";
import Card from "@mui/joy/Card";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded.js";
import {selectCurrentUser} from "../../../app/auth-slice.js";

const offerValidationSchema = yup.object({
  // Job description
  title: requiredString,
  goal: requiredString,
  description: requiredString,
  tasks: requiredString,
  skills: requiredString,
  softSkills: requiredArray,
  workEnvironment: requiredString,

  //Modalities
  duration: requiredNumber,
  timeSchedule: requiredString,
  location: location,

  // Mentor contact
  mentorPhone: phone,
  mentorEmail: email,

  // Status
  status: requiredString,
});

const companyValidationSchema = yup.object({
  // Job description
  name: requiredString,
  decription: requiredString,
  sectors: requiredArray,
  website: requiredUrl,
});

const validationSchema = yup.object({
  offer: offerValidationSchema,
});

export default function PageEditOffer({mode}) {
  const isEditMode = mode === "edit";
  const navigate = useNavigate();
  const {t} = useTranslationWithDates();
  const {id} = useParams();
  const companyId = !isEditMode && new URLSearchParams(window.location.search).get("company");

  const currentUser = useSelector(selectCurrentUser);

  const offer = useSelector((state) => (isEditMode ? selectOfferById(state, id) : undefined));
  const company = useSelector((state) =>
    selectCompanyById(state, isEditMode ? offer.company : companyId)
  );
  const companyReady = useSelector(selectCompanyReady);
  const offerReady = useSelector(selectOfferReady);
  const [addOffer, {isLoading: isAddingOffer}] = useAddOfferMutation();
  const [updateOffer, {isLoading: isUpdatingOffer}] = useUpdateOfferMutation();
  const [deleteOffer, {isLoading: isDeletingOffer}] = useDeleteOfferMutation();

  async function handleDeleteOffer() {
    await deleteOffer(id).unwrap();
  }

  const [showErrors, setShowErrors] = useState(false);

  const [currentFormStep, setCurrentFormStep] = useState(0);

  const pageTitle = isEditMode ? t("offers.modifyAnOffer") : t("offers.createANewOffer");

  return (
    companyReady &&
    offerReady && (
      <>
        {isEditMode ? (
          <OfferBanner
            showPills={false}
            pageTitle={pageTitle}
            offer={offer}
            breadcrumbs={[
              {label: t("offers.backToOffers"), to: "/offers"},
              {label: offer.title, to: "./.."},
              {label: pageTitle, to: "."},
            ]}
          />
        ) : (
          <HeroBanner invertedColors={false}>
            <Container mx={2}>
              <Grid container spacing={2}>
                <Grid xs={12} display={"flex"} justifyContent={"center"}>
                  <Typography level="h1" color={"white"}>
                    {pageTitle}
                  </Typography>
                </Grid>
              </Grid>
            </Container>
          </HeroBanner>
        )}

        <Form
          initialValues={
            isEditMode
              ? {offer: Object.assign({}, offerDefaultValues, offer), company}
              : {
                  offer: offerDefaultValues,
                  company: {name: "", description: "", website: "", sectors: [], ...company},
                }
          }
          validationSchema={validationSchema}
          successText={"Rendez-vous réservé avec succès"}
          onSubmit={async (values) => {
            const method = isEditMode ? updateOffer : addOffer;
            const newOffer = await method({...values.offer, id: offer.id}).unwrap();
            console.log(method, values.offer, newOffer);
            navigate("/offers/" + offer.id);
          }}>
          {(register, {values, setFieldValue, errors, dirty}) => (
            <PageContent gap={3} mt={6}>
              <FormStep
                stepNumber={0}
                showTitle
                showContent
                currentFormStep={currentFormStep}
                setCurrentFormStep={setCurrentFormStep}
                title={"Entreprise"}
                subtitle={
                  "Attention, lorsque vous modifiez les informations de l'entreprise, elles seront automatiquement modifiées sur toutes vos offres."
                }>
                <Stack gap={3}>
                  <FormInput
                    label={"Nom de l'entreprise"}
                    placeholder={"nom"}
                    register={register}
                    name={"company.name"}
                  />

                  <FormInput
                    component={Textarea}
                    label={"Description de l'entreprise"}
                    placeholder={"description"}
                    register={register}
                    name={"company.description"}
                  />
                  <FormInput
                    label={"Site internet de l'entreprise"}
                    placeholder={"https://mon-entreprise.com"}
                    register={register}
                    type={"url"}
                    name={"company.website"}
                  />
                  <FormInput
                    component={CheckboxGroup}
                    wrapperComponent={Box}
                    label={"Secteurs"}
                    name={"company.sectors"}
                    register={register}
                    setFieldValue={(val) => setFieldValue("company.sectors", val)}
                    options={sectorsOptions}
                  />
                </Stack>
              </FormStep>
              <Divider sx={{my: 2}} />

              <FormStep
                stepNumber={1}
                showTitle
                showContent
                currentFormStep={currentFormStep}
                setCurrentFormStep={setCurrentFormStep}
                title={"Poste"}
                subtitle={"Les informations à propos du poste proposé."}>
                <Stack gap={3}>
                  <FormInput
                    label={"Titre du poste"}
                    placeholder={"titre"}
                    register={register}
                    name={"offer.title"}
                  />
                  <FormInput
                    label={"Objectif"}
                    component={RadioGroup}
                    name={"offer.goal"}
                    value={values.offer.goal}
                    register={register}
                    options={goalOptions}
                  />
                  <FormInput
                    component={Textarea}
                    label={"Description du poste"}
                    placeholder={"description"}
                    register={register}
                    name={"offer.description"}
                  />
                  <FormInput
                    component={Textarea}
                    label={"Tâches quotidiennes"}
                    placeholder={"tâches"}
                    register={register}
                    name={"offer.tasks"}
                    help={"5 recommandées"}
                  />
                  <FormInput
                    component={Textarea}
                    label={"Savoir-faire"}
                    placeholder={"savoir-faire"}
                    register={register}
                    name={"offer.skills"}
                    help={"4 recommandées"}
                  />
                  <FormInput
                    component={CheckboxGroup}
                    wrapperComponent={Box}
                    label={"Savoir-être"}
                    name={"offer.softSkills"}
                    register={register}
                    setFieldValue={(val) => setFieldValue("offer.softSkills", val)}
                    options={softSkillsOptions}
                    help={"3 recommandées"}
                  />
                  <FormInput
                    label={"Environnement de travail"}
                    help={
                      "Ce qui donne envie aux candidats de vous rejoindre: identité, culture, ambiance.."
                    }
                    placeholder={"environnement de travail"}
                    register={register}
                    name={"offer.workEnvironment"}
                  />
                </Stack>
              </FormStep>
              <Divider sx={{my: 2}} />

              <FormStep
                stepNumber={2}
                showTitle
                showContent
                currentFormStep={currentFormStep}
                setCurrentFormStep={setCurrentFormStep}
                title={"Modalités"}
                subtitle={"Décrivez comment l'immersion va se dérouler."}>
                <Stack gap={3}>
                  <FormInput
                    sx={{width: "fit-content"}}
                    label={"Durée de l'immersion"}
                    endDecorator={"jours ouvrés"}
                    type={"number"}
                    placeholder={"durée"}
                    register={register}
                    name={"offer.duration"}
                  />

                  <FormInput
                    label={"Horaires de travail"}
                    placeholder={"horaires"}
                    register={register}
                    name={"offer.timeSchedule"}
                  />

                  <FormInput
                    label={"Lieu / Site"}
                    component={LocationSearchBar}
                    placeholder={"lieu de l'offre"}
                    register={register}
                    name={"offer.location"}
                  />

                  <FormInput
                    label={"Conditions particulières"}
                    placeholder={"conditions"}
                    register={register}
                    name={"offer.particularConditions"}
                  />

                  <FormInput
                    label={"Amménagements possibles"}
                    placeholder={"amménagements"}
                    register={register}
                    name={"offer.possibleArrangements"}
                  />
                </Stack>
              </FormStep>
              <Divider sx={{my: 2}} />

              <FormStep
                stepNumber={3}
                showTitle
                showContent
                currentFormStep={currentFormStep}
                setCurrentFormStep={setCurrentFormStep}
                title={"Mentor"}
                subtitle={
                  "Ajoutez le contact du mentor, maître de stage, qui sera en charge du candidat."
                }>
                <Stack gap={3}>
                  <FormInput
                    label="Email"
                    name={"offer.mentorEmail"}
                    placeholder="email@example.com"
                    type={"email"}
                    register={register}
                  />
                  <FormInput
                    label="Numéro de téléphone"
                    name={"offer.mentorPhone"}
                    placeholder="+33 6 12 34 56 78"
                    type={"tel"}
                    register={register}
                  />
                </Stack>
              </FormStep>

              <Divider sx={{my: 2}} />

              <FormStep
                stepNumber={4}
                showTitle
                showContent
                currentFormStep={currentFormStep}
                setCurrentFormStep={setCurrentFormStep}
                title={"Statut de l'offre"}>
                <Stack gap={3}>
                  <FormInput
                    label="Statut de l'offre"
                    name={"offer.status"}
                    component={RadioGroup}
                    options={statusOptions}
                    register={register}
                    help={
                      <span>
                        Par défaut, votre offre est enregistrée en statut de{" "}
                        <strong>Brouillon</strong>. Vous pouvez la publier plus tard.
                        <br />
                        Pour la publier directement, sélectionner <strong>Publiée</strong>.
                        <br />
                        Pour indiquer que l'offre est désormais pourvue et la retirer des offres
                        disponibles du site et par de nouvelleaux candidat·es, sélectionnez{" "}
                        <strong>Pourvue</strong>.
                      </span>
                    }
                  />
                </Stack>
              </FormStep>

              <Divider sx={{my: 2}} />

              <Collapse in={showErrors && Object.keys(errors).length > 0}>
                <Card variant="soft" color="danger">
                  Oups ! votre formulaire comporte des erreurs. Remontez la page pour corrigez vos
                  informations.
                  {errors?.offer && Object.entries(errors?.offer)?.join("\n")}
                </Card>
              </Collapse>

              <Button
                size={"lg"}
                type="submit"
                color="success"
                disabled={!dirty}
                loading={isAddingOffer || isUpdatingOffer}
                onClick={() => setShowErrors(true)}
                startDecorator={<CheckIcon />}>
                {isEditMode ? "Valider les modifications" : "Valider la création"}
              </Button>

              <ButtonWithConfirmation
                areYouSureText={
                  "Votre offre sera intégralement supprimée et vous ne pourrez pas la récupérer."
                }
                loading={isDeletingOffer}
                onClick={handleDeleteOffer}
                color="danger"
                startDecorator={<DeleteOutlineRoundedIcon />}>
                Supprimer l'offre
              </ButtonWithConfirmation>
            </PageContent>
          )}
        </Form>
      </>
    )
  );
}
