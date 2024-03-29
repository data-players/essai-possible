import React, {useEffect, useState} from "react";
import Stack from "@mui/joy/Stack";
import Typography from "@mui/joy/Typography";
import Button from "@mui/joy/Button";
import {Trans} from "react-i18next";
import {SlotsList} from "../../../components/atoms.jsx";
import {Form, FormInput, FormStep} from "../../../components/forms.jsx";
import CheckIcon from "@mui/icons-material/Check";
import {groupBy} from "../../../app/utils.js";
import {PageContent} from "../../../components/Layout.jsx";
import Textarea from "@mui/joy/Textarea";
import Collapse from "@mui/material/Collapse";
import {selectOfferById} from "../offers-slice.js";
import OfferBanner from "../OfferBanner.jsx";
import {useNavigate, useParams} from "react-router-dom";
import {useTranslationWithDates} from "../../../app/i18n.js";
import {AuthCard} from "../../account/AuthCard.jsx";
import {useDispatch, useSelector} from "react-redux";
import {
  meetingsActions,
  // selectMeetingForOffer,
  selectSavedFormData,
  // useAddMeetingMutation,
} from "./meetings-slice.js";
import {selectCurrentUser} from "../../../app/auth-slice.js";
import {selectSlotsForOffer,useUpdateSlotMutation} from "./slots-slice.js";
import CompanyOfferPreview from "../CompanyOfferPreview.jsx";
import queryString from "query-string";

// TODO not tested at all @Simon
// Système pour aller chercher le selectedSlotId dans l'URl qui n'a pas été testé du tout
export default function PageBook() {
  // console.log('PageBook')
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {t, tDate, tDateTime} = useTranslationWithDates();
  const {id,slotId} = useParams();

  const currentUser = useSelector(selectCurrentUser);

  const {selectedSlotId, comments} = useSelector((state) => selectSavedFormData(state, encodeURIComponent(id))) || {};
  // const comments=[];
  // console.log('PageBook selectSavedFormData',selectedSlotId, comments)

  const [currentFormStep, setCurrentFormStep] = useState(
    selectedSlotId ? 2 : 1
  );
  // console.log('currentFormStep',currentFormStep)

  const offer = useSelector((state) => selectOfferById(state, encodeURIComponent(id))) || {};
  const [updateSlot, {isLoading: isUpdatingSlotx}] = useUpdateSlotMutation();
  // const slotsForOffer = useSelector((state) => selectSlotsForOffer(state, offer.id));
  const slotsForOffer = offer?.nextSlots||[];
  const slotsForUser = currentUser?.slots||[];
  const meetingForOffer = slotsForOffer.map(so=>so.id).filter(soId=>slotsForUser.map(su=>su.id).includes(soId)).legth>0

  // const meetingForOffer = useSelector((state) => selectMeetingForOffer(state, offer.id));
  // const meetingForOffer =[];
  // const [addMeeting, {isLoading: isAddingMeeting}] = useAddMeetingMutation();
  const isAddingMeeting = false;

  // If a meeting is already booked for the offer, go back to the offer page
  // useEffect(() => {
  //   if (slotsForOffer) navigate("..");
  // }, [slotsForOffer]);

  const setFormData = (data) => {
    // navigate(`./${encodeURIComponent(id)}`);
    
    dispatch(
      meetingsActions.saveFormData({
        offerId: encodeURIComponent(id),
        data,
      })
    );
  }

  // TODO not tested at all @Simon
  // If a selectedSlotFormQueryParams is found in the query params, reselect it
  useEffect(() => {
    if (slotId){
      setFormData({selectedSlotId: encodeURIComponent(slotId)});
      setCurrentFormStep(2);
      // navigate('../book')
    }
  }, [slotId]);

  const selectedSlot = slotsForOffer.find((slot) => slot.id === selectedSlotId);

  const pageTitle = meetingForOffer
    ? t("offers.modifyAMeetingSlot", {context: "short"})
    : t("offers.bookAMeetingSlot", {context: "short"});

  // const pageTitle = t("offers.bookAMeetingSlot", {context: "short"})

  const slotsByDate = groupBy(slotsForOffer, (slot) => tDate(slot.start));


  // console.log('selectedSlotId',selectedSlotId,slotsForOffer)
  /**
   * Steps of the booking form
   */
  const steps = [
    // MEETING SLOT CHOICE
    <FormStep
      key={1}
      stepNumber={1}
      currentFormStep={currentFormStep}
      setCurrentFormStep={setCurrentFormStep}
      title={t("offers.chooseYourMeetingSlot")}
      noDivider
      subtitle={
        <>
          <Typography fontSize={"lg"}>{offer.meetingDetails}</Typography>
          <Collapse in={!!selectedSlotId}>
            {selectedSlotId && (
              <Typography fontSize={"lg"} textColor={"text.secondary"}>
                <Trans
                  i18nKey="offers.youAreAboutToBookAMeetingOnThe"
                  values={{
                    dateTime: tDateTime(selectedSlot?.start),
                  }}
                />
              </Typography>
            )}
          </Collapse>
        </>
      }>
      <SlotsList
        selectedSlot={selectedSlotId}
        onChange={(key, checked) => setFormData({selectedSlotId: checked ? key : undefined})}
        slots={slotsForOffer}
      />

      <Stack>
        <Button
          size={"lg"}
          disabled={!selectedSlotId}
          color="success"
          onClick={() => setCurrentFormStep(currentFormStep + 1)}
          startDecorator={<CheckIcon />}>
          {t("offers.chooseThisMeetingSlot")}
        </Button>
      </Stack>
    </FormStep>,

    // USER LOGIN/SIGNUP + COMMENTS
    <FormStep
      key={2}
      stepNumber={2}
      currentFormStep={currentFormStep}
      setCurrentFormStep={setCurrentFormStep}
      title={t("offers.myInformation")}
      showTitle={meetingForOffer || comments?.length > 0}
      noDivider
      subtitle={
          <AuthCard
          redirectUrl={`${window.location.href}/${selectedSlotId}`}
          helpBoxConnected={(<>Ces informations sont celle de votre profil. Vous pouvez le modifier ici ou sur votre profil</>)}
          />
        }>
      <Form
        initialValues={{comments}}
        successText={"Rendez-vous réservé avec succès"}
        onSubmit={async ({comments}) => {
          if (currentUser.phone==undefined){
            throw new Error('numero de telephone requis');
          } else {
            const slotToUpdate = {...selectedSlot};
            slotToUpdate.user = currentUser.id;
            slotToUpdate.comments = comments;
            navigate(`/offers/${encodeURIComponent(id)}`);
            const newSlot = await updateSlot(slotToUpdate).unwrap();

          }

        }}>
        {(register) => (
          <Stack gap={3}>
            {currentUser && (
              <FormInput
                component={Textarea}
                label="Avez-vous des commentaires à partager avec l'entreprise ?"
                name={"comments"}
                placeholder="conditions particulières, remarques pour l'entreprise..."
                help="si vous avez une question ou besoin de préciser quelque chose à l'employeur, faites-le ici. Il ne s'agit pas de préciser ici vos compétences ou les éléments de votre motivation, que vous pourrez démontrer lors de votre immersion"
                minRows={3}
                register={register}
              />
            )}

            <Button
              type={"submit"}
              size={"lg"}
              loading={isAddingMeeting}
              disabled={!(currentUser&&currentUser.phone)}
              color={"success"}
              startDecorator={<CheckIcon />}>
              {t("offers.validateInformationAndBook")}
            </Button>
          </Stack>
        )}
      </Form>
    </FormStep>,
  ];

  return (
    <CompanyOfferPreview offer={offer}>
      <OfferBanner
        showPills={false}
        pageTitle={pageTitle}
        offer={offer}
        breadcrumbs={[
          {label: t("offers.backToOffers"), to: "/offers"},
          {label: offer.title, to: "./.."},
          {label: pageTitle, to: ".", onClick: () => setCurrentFormStep(1)},
          currentFormStep >= 2 && {
            label: t("offers.myInformation"),
            to: ".",
            onClick: () => setCurrentFormStep(2),
          },
        ]}
      />

      <PageContent gap={4} mt={6}>
        {slotsForOffer?.length > 0 ? (
          steps
        ) : (
          <Typography mt={4} textColor={"text.tertiary"}>
            {t("offers.ohOhNoMeetings")}
          </Typography>
        )}
      </PageContent>
    </CompanyOfferPreview>
  );
}
