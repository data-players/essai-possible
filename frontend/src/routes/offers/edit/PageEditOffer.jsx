import React, {useState} from "react";
import Stack from "@mui/joy/Stack";
import Typography from "@mui/joy/Typography";
import Button from "@mui/joy/Button";
import Card from "@mui/joy/Card";
import {
  CheckboxGroupSemantic,
  ExternalLink,
  HelpBox,
  LocationSearchBar,
  RadioGroupSemantic,
  SimpleBanner,
  PhoneInput
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

import {
  selectAllSkills,
  selectAllStatus,
  selectAllGoals,
} from "../../../app/concepts-slice.js";
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
import Box from "@mui/joy/Box";
import * as yup from "yup";
import HelpPdf1 from "../../../assets/Outil 1 : Définition du poste.pdf";
import HelpPdf2 from "../../../assets/Outil 2 : Rédaction de l'offre d'emploi.pdf";
import EditFormComponent from "../../../components/EditFormComponent.jsx";
import Link from "@mui/joy/Link";
import {CompanyFormElements} from "../../company/CompanyFormElements.jsx";
import MeetingSlotsGenerator from "./MeetingSlotsGenerator.jsx";
import deepEqual from 'deep-equal';

const validationSchema = yup.object({
  offer: offerValidationSchema,
  company: companyValidationSchema,
});

export default function PageEditOffer({mode, isCopying}) {

  const isEditMode = mode === "edit";
  const navigate = useNavigate();
  const {t} = useTranslationWithDates();
  const {id, companyId} = useParams();

  const [openCompanyForm, setOpenCompanyForm] = useState(null);
  const [openSlotsGenerator, setOpenSlotsGenerator] = useState(null);

  const offer = useSelector((state) => (isEditMode ? selectOfferById(state, encodeURIComponent(id)) : undefined));
  // console.log("offer Edit",offer)
  const company = useSelector((state) =>
    selectCompanyById(state, isEditMode ? offer.company : encodeURIComponent(companyId))
  );
  // const slots = useSelector((state) => (isEditMode ? selectSlotsForOffer(state, encodeURIComponent(id)) : []));

  const companyReady = useSelector(selectCompanyReady);
  const offerReady = useSelector(selectOfferReady);
  // const slotsReady = useSelector(selectSlotsReady);

  // const skillsStatus = useSelector(selectSkillsStatus);
  // const statusStatus = useSelector(selectStatusStatus);
  // const goalsStatus = useSelector(selectGoalsStatus);

  const goals = useSelector(selectAllGoals);
  const status = useSelector(selectAllStatus);
  const skills = useSelector(selectAllSkills);

  const draftStatus = status.find(s=>s.id.includes('brouillon'))?.id;

  const [addOffer, {isLoading: isAddingOffer}] = useAddOfferMutation();
  const [updateOffer, {isLoading: isUpdatingOffer}] = useUpdateOfferMutation();
  const [updateCompany, {isLoading: isUpdatingCompany}] = useUpdateCompanyMutation();
  // TODO Update slots for offer
  // const [updateSlotsForOffer, {isLoading: isUpdatingSlotsForOffer}] = useUpdateSlotsForOfferMutation();
  const [deleteOffer, {isLoading: isDeletingOffer}] = useDeleteOfferMutation();


  // if (skillsStatus==undefined){
  //   useFetchSkillsQuery();
  // }
  // if (statusStatus==undefined){
  //   useFetchStatusQuery();
  // }

  // if (goalsStatus==undefined){
  //   useFetchGoalsQuery();
  // }

  


  const pageTitle = isEditMode
    ? isCopying
      ? t("offers.copyAnOffer")
      : t("offers.modifyAnOffer")
    : t("offers.createANewOffer");

  async function onSubmit(values) {
    const method = isEditMode && !isCopying ? updateOffer : addOffer;

    const offerPayload = {...values.offer, id: offer?.id, company: company.id};
    if (isCopying) delete offerPayload.id; // Delete id if we are copying from an existing offer

    const manipulatedOffer = await method({
      ...values.offer,
      id: offer?.id,
      company: company.id,
      slots:values.slots
    }).unwrap();


    const shouldUpdateCompany =!(deepEqual(values.company,company));
    if (shouldUpdateCompany) updateCompany(values.company);

    navigate(`/offers/${encodeURIComponent(manipulatedOffer.id)}`);
  }

  async function onDelete() {
    await deleteOffer(id).unwrap();
    navigate(`/company/${encodeURIComponent(company.id)}`);
  }

  // console.log('-- READY?',companyReady, isEditMode,offerReady)

  return (
    <EditFormComponent
      // ready when the company is ready + if edit mode, the offer and the slots are ready
      ready={companyReady && (!isEditMode || offerReady)}
      pageBanner={
        isEditMode && !isCopying ? (
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
              slots:offer?.slots,
            }
          : {
              offer: {...offerDefaultValues,status: draftStatus},
              company: {...companyDefaultValues, ...company},
              slots:[],
            }
      }
      validationSchema={validationSchema}
      allowUndirtySubmit
      onSubmit={onSubmit}
      isEditMode={isEditMode && !isCopying}
      onDelete={onDelete}
      helpBox={
        <>
          <Typography fontWeight={"lg"} fontSize={"lg"}>
            {isCopying
              ? `Vous êtes en train de créer une nouvelle offre à partir de "${offer.title}".`
              : "Voici un peu d'aide !"}
          </Typography>
          <Typography>
            {isCopying ? (
              <>
                Modifiez les données du formulaire ci dessous, et cliquez sur "Valider la création"
                pour créer une nouvelle offre à partir de l'offre pré-existante.
              </>
            ) : (
              <>
                Rédiger une offre de qualité relève d'un travail d'analyse de besoins et de
                rédaction. Nous avons créé des fiches d'aide pour vous guider.
              </>
            )}
          </Typography>
          <ExternalLink href={HelpPdf1}>Comment analyser les besoins d'un poste ?</ExternalLink>
          <ExternalLink href={HelpPdf2}>Comment rédiger une fiche de poste ?</ExternalLink>
        </>
      }
      deleteLoading={isDeletingOffer}
      updateLoading={isAddingOffer || isUpdatingOffer || isUpdatingCompany}
      deleteAreYouSureText={
        "Votre offre sera intégralement supprimée et vous ne pourrez pas la récupérer."
      }
      deleteButtonText={"Supprimer l'offre"}>
      {(register, {values, setFieldValue, errors, showingErrors,pendingmutation}) => (
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
                pendingmutation={pendingmutation}
              />
              <FormInput
                label={"Objectif"}
                component={RadioGroupSemantic}
                name={"offer.goal"}
                options={goals}
                register={register}
                pendingmutation={pendingmutation}
              />
              <FormInput
                component={Textarea}
                label={"Description"}
                placeholder={"description"}
                help={"Décrivez votre structure de manière brève (2 à 3 phrases par message)."}
                register={register}
                name={"offer.description"}
                pendingmutation={pendingmutation}
              />
              <FormInput
                component={Textarea}
                label={"Tâches quotidiennes"}
                placeholder={"tâches"}
                register={register}
                name={"offer.tasks"}
                help={<Stack><span>Décrivez les tâches du poste avec des verbes d'actions et sans vocabulaire technique</span><span>Exemple, remplacez : « Coliser et panacher les marchandises» par : «Mettre en colis les marchandises »</span><span>5 recommandées</span></Stack>}
                pendingmutation={pendingmutation}
              />
              <FormInput
                component={Textarea}
                label={"Savoir-faire"}
                placeholder={"savoir-faire"}
                register={register}
                name={"offer.skills"}
                help={<Stack><span>Axez vos exigences sur des résultats et donnez des détails.</span><span>Exemple, remplacez : “Au moins 5 années d’expérience en tant qu’assistant.e de direction” par : “Expérience de travail dans l’accueil de clientèle, la prise de rendez-vous, la gestion des plannings et l’organisation de réunions.”</span><span>4 recommandées</span></Stack>}
                pendingmutation={pendingmutation}
              />
              <FormInput
                component={CheckboxGroupSemantic}
                wrapperComponent={Box}
                label={"Savoir-être"}
                name={"offer.softSkills"}
                register={register}
                onChange={(value) => setFieldValue("offer.softSkills", value)}
                options={skills}
                help={"3 recommandées"}
                pendingmutation={pendingmutation}
              />
              <FormInput
                label={"Environnement de travail"}
                help={<Stack><span>Montrez votre engagement. Exemple : Notre entreprise souhaite valoriser un milieu de travail où les différences individuelles sont appréciées et reconnues sans distinctions d’origine, de genre, de handicap, d’orientation sexuelle, d’âge, de milieu social, de croyances etc.</span><span>Donnez le maximum d’informations liées aux conditions de travail. Exemple - travail en extérieur par tout temps, lieu de travail bruyant, déplacements fréquents. Vous pouvez également indiquer que vous êtes prêt/e à discuter d’aménagement de poste ou de conditions de travail si la personne en exprime le besoin.</span></Stack>}
                placeholder={"environnement de travail"}
                register={register}
                name={"offer.workEnvironment"}
                pendingmutation={pendingmutation}
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
                pendingmutation={pendingmutation}
              />

              <FormInput
                label={"Horaires de travail"}
                placeholder={"horaires"}
                register={register}
                name={"offer.timeSchedule"}
                pendingmutation={pendingmutation}
              />

              <FormInput
                label={"Lieu / Site"}
                component={LocationSearchBar}
                placeholder={"lieu de l'offre"}
                register={register}
                onChange={(event, value) => setFieldValue("offer.location", value)}
                name={"offer.location"}
                pendingmutation={pendingmutation}
              />

              <FormInput
                label={"Conditions particulières"}
                placeholder={"conditions"}
                register={register}
                name={"offer.particularConditions"}
                pendingmutation={pendingmutation}
              />

              <FormInput
                label={"Amménagements possibles"}
                placeholder={"amménagements"}
                register={register}
                name={"offer.possibleArrangements"}
                pendingmutation={pendingmutation}
              />
            </Stack>
          </FormStep>

          <FormStep
            stepNumber={3}
            showTitle
            showContent
            title={"Modalités du rendez-vous"}
            subtitle={
              "Renseignez les modalités de la première rencontre (Date, horaires, adresse, contact de la personne qui accueille des candidat·es."
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
                pendingmutation={pendingmutation}
              />

              <FormInput
                label="Email du contact référent"
                name={"offer.mentorEmail"}
                placeholder="email@mon-entreprise.com"
                type={"email"}
                register={register}
                pendingmutation={pendingmutation}
              />
              <FormInput
                component={PhoneInput}
                label="Numéro de téléphone du contact référent"
                name={"offer.mentorPhone"}
                placeholder="+33 6 12 34 56 78"
                type={"tel"}
                onChange={(value) => setFieldValue("offer.mentorPhone", value)}
                register={register}
                pendingmutation={pendingmutation}
              />
            </Stack>
          </FormStep>

          <FormStep
            stepNumber={4}
            currentFormStep={openSlotsGenerator}
            setCurrentFormStep={setOpenSlotsGenerator}
            showTitle
            showContent={false/*!isEditMode || values.slots?.length === 0*/}
            title={"Créneaux de rendez-vous"}
            subtitle={
              <>
                <Typography fontSize={"lg"}>
                  Listez tous les créneaux de rendez-vous possibles pour rencontrer vos candidat·es.
                </Typography>
                <Typography fontSize={"lg"}>
                  {t("offers.xMeetingSlotsAvailable", {count:1 /*values.slots?.length*/})}
                </Typography>
              </>
            }>
            <Stack gap={3}>
              <HelpBox>
                <Typography fontWeight={"lg"}>
                  Vous pouvez renseigner des créneaux de rendez-vous en utilisant le générateur
                  ci-dessous.
                </Typography>
                <Typography>
                  Vous pouvez lancer le générateur plusieurs fois avec des paramètres différents, et
                  les créneaux générés s'additionneront. Cela vous permet de générer facilement des
                  créneaux, même avec un emploi du temps complexe.
                </Typography>
                <Box>
                  <Typography>
                    <u>Exemple :</u> vous êtes disponible de la date A à la date B, tous les jours
                    de la semaine de 13h à 17h <em>sauf le lundi</em>. En effet, le lundi, vous
                    n'êtes disponible qu'en matinée, de 10 à 12h. Dans ce cas, vous pouvez lancer
                    deux générations différentes :
                  </Typography>
                  <ul>
                    <li>
                      Une première tous les jours de la semaine sauf samedi et dimanche, entre 13 et
                      17h, de la date A à la date B,
                    </li>
                    <li>
                      Une seconde le lundi seulement, entre 10 et 12h, de la date A à la date B.
                    </li>
                  </ul>
                </Box>
              </HelpBox>

              <MeetingSlotsGenerator
                offerId={encodeURIComponent(id)}
                values={values}
                register={register}
                slots={offer?.slots}
                setFieldValue={setFieldValue}
              />

              {isEditMode && (
                <Button
                  sx={{mt: 2, width: "fit-content"}}
                  variant="soft"
                  size={"sm"}
                  color="neutral"
                  onClick={() => setOpenSlotsGenerator(false)}>
                  Fermer
                </Button>
              )}
            </Stack>
          </FormStep>

          <FormStep
            stepNumber={5}
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
                component={RadioGroupSemantic}
                options={status}
                register={register}
                pendingmutation={pendingmutation}
              />
            </Stack>
          </FormStep>

          <FormStep
            stepNumber={6}
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
                <Typography fontWeight={"lg"}>
                  Les modifications de votre entreprise sont visibles pour toutes vos offres.
                </Typography>
                <Typography>
                  Les informations de votre entreprise seront visibles par les candidat·es dans la
                  liste des offres et dans le détail des offres. Vous pouvez également modifier
                  votre entreprise sur{" "}
                  <Link
                    to={`/company/${encodeURIComponent(company?.id)}/edit`}
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
          {(isAddingOffer || isUpdatingOffer||isDeletingOffer)?
            <Card variant="solid" color="warning">
              <Stack gap={1}>
                <Typography>L'enregistrement d'une offre necessite un temps de traitement qui depend du nombre de rdv à créer, modifier ou supprimer. Cela peut prendre plusieurs minutes</Typography>
              </Stack>
            </Card>
          :<></>}
          
        </>
      )}
    </EditFormComponent>
  );
}
