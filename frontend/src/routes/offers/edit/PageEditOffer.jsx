import React, {useState} from "react";
import Stack from "@mui/joy/Stack";
import Typography from "@mui/joy/Typography";
import Button from "@mui/joy/Button";
import {
  CheckboxGroup,
  ExternalLink,
  HelpBox,
  LocationSearchBar,
  RadioGroup,
  SimpleBanner,
} from "../../../components/atoms.jsx";
import {FormInput, FormStep} from "../../../components/forms.jsx";
import Textarea from "@mui/joy/Textarea";
import {
  offerDefaultValues,
  offerValidationSchema,
  selectOfferById,
  selectOfferReady,
  useAddOfferMutation,
  useDeleteOfferMutation,
  useUpdateOfferMutation,
} from "../offers-slice.js";
import OfferBanner from "../OfferBanner.jsx";
import {Link as ReactRouterLink, useNavigate, useParams} from "react-router-dom";
import {useTranslationWithDates} from "../../../app/i18n.js";
import {useSelector} from "react-redux";
import {
  companyDefaultValues,
  companyValidationSchema,
  selectCompanyById,
  selectCompanyReady,
  useUpdateCompanyMutation,
} from "../companies-slice";
import {goalOptions, softSkillsOptions, statusOptions} from "../offers-slice-data.js";
import Box from "@mui/joy/Box";
import * as yup from "yup";
import HelpPdf1 from "../../../assets/Outil 1 : Définition du poste.pdf";
import HelpPdf2 from "../../../assets/Outil 2 : Rédaction de l'offre d'emploi.pdf";
import PageEdit from "../../../components/PageEdit.jsx";
import Link from "@mui/joy/Link";
import {CompanyFormElements} from "../../company/CompanyFormElements.jsx";

const validationSchema = yup.object({
  offer: offerValidationSchema,
  company: companyValidationSchema,
});

export default function PageEditOffer({mode}) {
  const isEditMode = mode === "edit";
  const navigate = useNavigate();
  const {t} = useTranslationWithDates();
  const {id, companyId} = useParams();

  const [openCompanyForm, setOpenCompanyForm] = useState(null);

  const offer = useSelector((state) => (isEditMode ? selectOfferById(state, id) : undefined));
  const company = useSelector((state) =>
    selectCompanyById(state, isEditMode ? offer.company : companyId)
  );

  const companyReady = useSelector(selectCompanyReady);
  const offerReady = useSelector(selectOfferReady);

  const [addOffer, {isLoading: isAddingOffer}] = useAddOfferMutation();
  const [updateOffer, {isLoading: isUpdatingOffer}] = useUpdateOfferMutation();
  const [updateCompany, {isLoading: isUpdatingCompany}] = useUpdateCompanyMutation();
  const [deleteOffer, {isLoading: isDeletingOffer}] = useDeleteOfferMutation();

  const pageTitle = isEditMode ? t("offers.modifyAnOffer") : t("offers.createANewOffer");

  async function onSubmit(values) {
    const method = isEditMode ? updateOffer : addOffer;

    const shouldUpdateCompany = JSON.stringify(values.company) !== JSON.stringify(company);
    if (shouldUpdateCompany) updateCompany(values.company);

    const newOffer = await method({...values.offer, id: offer?.id, company: company.id}).unwrap();
    navigate("/offers/" + newOffer.id);
  }

  async function onDelete() {
    await deleteOffer(id).unwrap();
    navigate("/company/" + company.id);
  }

  return (
    <PageEdit
      ready={companyReady && (offerReady || !isEditMode)}
      pageBanner={
        isEditMode ? (
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
          <SimpleBanner>{pageTitle}</SimpleBanner>
        )
      }
      initialValues={
        isEditMode
          ? {
              offer: {...offerDefaultValues, ...offer},
              company,
            }
          : {
              offer: offerDefaultValues,
              company: {...companyDefaultValues, ...company},
            }
      }
      validationSchema={validationSchema}
      onSubmit={onSubmit}
      isEditMode={isEditMode}
      onDelete={onDelete}
      helpBox={
        <>
          <Typography fontWeight={"lg"} fontSize={"lg"}>
            Voici un peu d'aide !
          </Typography>
          <Typography>
            Rédiger une offre de qualité relève d'un travail d'analyse de besoins et de rédaction.
            Nous avons créé des fiches d'aide pour vous guider.
          </Typography>
          <ExternalLink href={HelpPdf1}>Comment analyser les besoins d'un poste ?</ExternalLink>
          <ExternalLink href={HelpPdf2}>Comment rédiger une fiche de poste ?</ExternalLink>
        </>
      }
      deleteLoading={isDeletingOffer}
      updateLoading={isAddingOffer || isUpdatingOffer || isUpdatingCompany}
      deleteAreYouSureText={
        "Votre offre sera intégralement supprimée et vous ne pourrez pas la récupérer."
      }>
      {(register, {values, setFieldValue, errors, showingErrors}) => (
        <>
          <FormStep
            stepNumber={1}
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

          <FormStep
            stepNumber={2}
            showTitle
            showContent
            title={"Modalités de l'offre"}
            subtitle={"Décrivez comment l'immersion va se dérouler."}>
            <Stack gap={3}>
              <FormInput
                sx={{width: "fit-content"}}
                label={"Durée de l'immersion"}
                endDecorator={"jours ouvrés"}
                slotProps={{input: {min: 1}}}
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

          <FormStep
            stepNumber={3}
            showTitle
            showContent
            title={"Modalités du rendez-vous"}
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

          <FormStep
            stepNumber={4}
            subtitle={
              <Typography>
                Par défaut, votre offre est enregistrée en statut de <strong>Brouillon</strong>.
                Vous pouvez la publier plus tard.
                <br />
                Pour la publier directement, sélectionnez <strong>Publiée</strong>.
                <br />
                Pour indiquer que l'offre est désormais pourvue et la retirer des offres disponibles
                du site et par de nouvelleaux candidat·es, sélectionnez <strong>Pourvue</strong>.
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

          <FormStep
            stepNumber={5}
            currentFormStep={openCompanyForm}
            setCurrentFormStep={setOpenCompanyForm}
            showTitle
            showContent={showingErrors && errors?.company}
            title={"Entreprise"}
            subtitle={
              "Vérifiez que les informations de votre entreprise sont bien à jour, et modifiez-les si nécéssaire."
            }>
            <Stack gap={3}>
              <HelpBox>
                <Typography>
                  Les informations de votre entreprise seront visibles par les candidat·es dans la
                  liste des offres et dans le détail des offres.
                </Typography>
                <Typography>
                  Vous pouvez également modifier votre entreprise sur{" "}
                  <Link
                    to={`/company/${encodeURIComponent(company.id)}/edit`}
                    component={ReactRouterLink}>
                    cette page dédiée
                  </Link>
                  .
                </Typography>
              </HelpBox>

              <CompanyFormElements
                baseFormPath={"company"}
                setFieldValue={setFieldValue}
                register={register}
              />

              <Button
                sx={{mt: 2, width: "fit-content"}}
                variant="soft"
                size={"sm"}
                color="neutral"
                onClick={() => setOpenCompanyForm(false)}>
                Fermer
              </Button>
            </Stack>
          </FormStep>
        </>
      )}
    </PageEdit>
  );
}
