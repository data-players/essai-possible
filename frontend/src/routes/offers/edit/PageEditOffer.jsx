import React, {useState} from "react";
import Stack from "@mui/joy/Stack";
import Typography from "@mui/joy/Typography";
import Button from "@mui/joy/Button";
import {
  ButtonWithConfirmation,
  CheckboxGroup,
  ExternalLink,
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
  required,
  requiredArray,
  requiredEmail,
  requiredNumber,
  requiredPhone,
  requiredString,
  requiredUrl,
} from "../../../app/fieldValidation.js";
import * as yup from "yup";
import Card from "@mui/joy/Card";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded.js";
import {useSnackbar} from "../../../components/snackbar.jsx";
import HelpPdf1 from "../../../assets/Outil 1 : Définition du poste.pdf";
import HelpPdf2 from "../../../assets/Outil 2 : Rédaction de l'offre d'emploi.pdf";

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
  location: required,

  // Mentor contact
  meetingDetails: requiredString,
  mentorPhone: requiredPhone,
  mentorEmail: requiredEmail,

  // Status
  status: requiredString,
});

const companyValidationSchema = yup.object({
  // Job description
  name: requiredString,
  description: requiredString,
  sectors: requiredArray,
  website: requiredUrl,
});

const validationSchema = yup.object({
  offer: offerValidationSchema,
  company: companyValidationSchema,
});

export default function PageEditOffer({mode}) {
  const [openSnackbar] = useSnackbar();
  const isEditMode = mode === "edit";
  const navigate = useNavigate();
  const {t} = useTranslationWithDates();
  const {id, companyId} = useParams();

  const [showErrors, setShowErrors] = useState(false);

  const offer = useSelector((state) => (isEditMode ? selectOfferById(state, id) : undefined));
  const company = useSelector((state) =>
    selectCompanyById(state, isEditMode ? offer.company : companyId)
  );

  const companyReady = useSelector(selectCompanyReady);
  const offerReady = useSelector(selectOfferReady);

  const [addOffer, {isLoading: isAddingOffer}] = useAddOfferMutation();
  const [updateOffer, {isLoading: isUpdatingOffer}] = useUpdateOfferMutation();
  const [deleteOffer, {isLoading: isDeletingOffer}] = useDeleteOfferMutation();

  const pageTitle = isEditMode ? t("offers.modifyAnOffer") : t("offers.createANewOffer");

  async function onSubmit(values) {
    const method = isEditMode ? updateOffer : addOffer;
    const newOffer = await method({...values.offer, id: offer?.id, company: company.id}).unwrap();
    navigate("/offers/" + newOffer.id);
  }

  async function handleDeleteOffer() {
    await deleteOffer(id).unwrap();
    openSnackbar("Suppression réussie");
    navigate("/company/" + company.id);
  }

  return (
    companyReady &&
    (offerReady || !isEditMode) && (
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
          successText={isEditMode ? "Modifications réussies" : "Création réussie"}
          onSubmit={onSubmit}>
          {(register, {values, setFieldValue, errors, dirty}) => (
            <PageContent gap={3} mt={6}>
              <Card variant="soft" color={"warning"} size={"lg"}>
                <Stack gap={1}>
                  <Typography fontWeight={"lg"} fontSize={"lg"}>
                    Voici un peu d'aide !
                  </Typography>
                  <Typography>
                    Rédiger une offre de qualité relève d'un travail d'analyse de besoins et de
                    rédaction. Nous avons créé des fiches d'aide pour vous guider.
                  </Typography>
                  <ExternalLink href={HelpPdf1}>
                    Comment analyser les besoins d'un poste ?
                  </ExternalLink>
                  <ExternalLink href={HelpPdf2}>Comment rédiger une fiche de poste ?</ExternalLink>
                </Stack>
              </Card>
              <Divider sx={{my: 2}} />

              <FormStep
                stepNumber={1}
                showTitle
                showContent
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
                    onChange={(value) => setFieldValue("company.sectors", value)}
                    options={sectorsOptions}
                  />
                </Stack>
              </FormStep>
              <Divider sx={{my: 2}} />

              <FormStep
                stepNumber={2}
                showTitle
                showContent
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
                    onChange={(value) => setFieldValue("offer.softSkills", value)}
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
                stepNumber={3}
                showTitle
                showContent
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
                    onChange={(event, value) => setFieldValue("offer.location", value)}
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
                stepNumber={4}
                showTitle
                showContent
                title={"Modalites du rendez-vous"}
                subtitle={
                  "Ajoutez des détails sur le rendez-vous ainsi que le contact du ou de la mentor, maître de stage, qui sera en charge des candidat·es."
                }>
                <Stack gap={3}>
                  <FormInput
                    component={Textarea}
                    label="Détails sur le rendez-vous"
                    name={"offer.meetingDetails"}
                    placeholder="détails"
                    register={register}
                    help={
                      "Combien de temps dure un rendez-vous en moyenne, préférences sur les horaires, déroulé, etc."
                    }
                  />

                  <FormInput
                    label="Email du mentor"
                    name={"offer.mentorEmail"}
                    placeholder="email@mon-entreprise.com"
                    type={"email"}
                    register={register}
                  />
                  <FormInput
                    label="Numéro de téléphone du mentor"
                    name={"offer.mentorPhone"}
                    placeholder="+33 6 12 34 56 78"
                    type={"tel"}
                    register={register}
                  />
                </Stack>
              </FormStep>

              <Divider sx={{my: 2}} />

              <FormStep
                stepNumber={5}
                subtitle={
                  <Typography>
                    Par défaut, votre offre est enregistrée en statut de <strong>Brouillon</strong>.
                    Vous pouvez la publier plus tard.
                    <br />
                    Pour la publier directement, sélectionnez <strong>Publiée</strong>.
                    <br />
                    Pour indiquer que l'offre est désormais pourvue et la retirer des offres
                    disponibles du site et par de nouvelleaux candidat·es, sélectionnez{" "}
                    <strong>Pourvue</strong>.
                  </Typography>
                }
                showTitle
                showContent
                title={"Statut de l'offre"}>
                <Stack gap={3}>
                  <FormInput
                    name={"offer.status"}
                    component={RadioGroup}
                    options={statusOptions}
                    register={register}
                  />
                </Stack>
              </FormStep>

              <Divider sx={{my: 2}} />

              <Collapse in={showErrors && Object.keys(errors).length > 0} sx={{mb: -2}}>
                <Card variant="soft" color="danger" sx={{mb: 2}}>
                  Oups ! votre formulaire comporte des erreurs. Remontez la page pour corrigez vos
                  informations.
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

              {isEditMode && (
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
              )}
            </PageContent>
          )}
        </Form>
      </>
    )
  );
}
