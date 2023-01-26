import React, {useEffect, useState} from "react";
import List from "@mui/joy/List";
import ListItem from "@mui/joy/ListItem";
import Stack from "@mui/joy/Stack";
import Typography from "@mui/joy/Typography";
import Button from "@mui/joy/Button";
import CalendarMonthRoundedIcon from "@mui/icons-material/CalendarMonthRounded";
import {Trans} from "react-i18next";
import {Form, FormInput, FormStep, RadioChips} from "../../../components/atoms.jsx";
import ListSubheader from "@mui/joy/ListSubheader";
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
  selectMeetingForOffer,
  selectSavedFormData,
  useAddMeetingMutation,
} from "./meetings-slice.js";
import {selectCurrentUser} from "../../../app/auth-slice.js";
import {selectSlotsForOffer} from "./slots-slice.js";
import CompanyOfferPreview from "../CompanyOfferPreview.jsx";

export default function PageBook() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {t, tTime, tDate, tDateTime} = useTranslationWithDates();
  const {id} = useParams();

  const offer = useSelector((state) => selectOfferById(state, id)) || {};

  const slotsForOffer = useSelector((state) => selectSlotsForOffer(state, offer.id));
  const meetingForOffer = useSelector((state) => selectMeetingForOffer(state, offer.id));
  const [addMeeting, {isLoading: isAddingMeeting}] = useAddMeetingMutation();

  const currentUser = useSelector(selectCurrentUser);
  const {selectedSlot, comments} = useSelector((state) => selectSavedFormData(state, id)) || {};

  // If a meeting is already booked for the offer, go back to the offer page
  useEffect(() => {
    if (meetingForOffer) navigate("..");
  }, [meetingForOffer]);

  const setFormData = (data) =>
    dispatch(
      meetingsActions.saveFormData({
        offerId: id,
        data,
      })
    );

  const [currentFormStep, setCurrentFormStep] = useState(selectedSlot ? 1 : 0);

  const pageTitle = meetingForOffer
    ? t("offers.modifyAMeetingSlot", {context: "short"})
    : t("offers.bookAMeetingSlot", {context: "short"});

  const slotsByDate = groupBy(slotsForOffer, (slot) => tDate(slot.start));

  /**
   * Steps of the booking form
   */
  const steps = [
    // MEETING SLOT CHOICE
    <FormStep
      key={0}
      stepNumber={0}
      currentFormStep={currentFormStep}
      setCurrentFormStep={setCurrentFormStep}
      title={t("offers.chooseYourMeetingSlot")}
      subtitle={
        <Collapse in={!!selectedSlot}>
          {selectedSlot && (
            <Typography fontSize={"lg"} textColor={"text.secondary"}>
              <Trans
                i18nKey="offers.youAreAboutToBookAMeetingOnThe"
                values={{
                  dateTime: tDateTime(slotsForOffer.find((slot) => slot.id === selectedSlot).start),
                }}
              />
            </Typography>
          )}
        </Collapse>
      }>
      <List>
        {Object.entries(slotsByDate).map(([date, slots]) => (
          <React.Fragment key={date}>
            <ListSubheader sx={{fontSize: "md"}}>{date}</ListSubheader>
            <ListItem sx={{mb: 3}}>
              <RadioChips
                options={slots.map((slot) => ({
                  label: tTime(slot.start),
                  icon: CalendarMonthRoundedIcon,
                  key: slot.id,
                }))}
                value={selectedSlot}
                setFieldValue={(selectedSlot) => setFormData({selectedSlot})}
              />
            </ListItem>
          </React.Fragment>
        ))}
      </List>

      <Stack>
        <Button
          size={"lg"}
          disabled={!selectedSlot}
          color="success"
          onClick={() => setCurrentFormStep(currentFormStep + 1)}
          startDecorator={<CheckIcon />}>
          {t("offers.chooseThisMeetingSlot")}
        </Button>
      </Stack>
    </FormStep>,

    // USER LOGIN/SIGNUP + COMMENTS
    <FormStep
      key={1}
      stepNumber={1}
      currentFormStep={currentFormStep}
      setCurrentFormStep={setCurrentFormStep}
      title={t("offers.myInformation")}
      showTitle={meetingForOffer || comments?.length > 0}
      subtitle={<AuthCard />}>
      <Form
        initialValues={{comments}}
        successText={"Rendez-vous réservé avec succès"}
        onSubmit={async ({comments}) => {
          await addMeeting({
            slot: selectedSlot,
            comments,
          }).unwrap();
          navigate("/my-meetings");
        }}>
        {(register) => (
          <Stack gap={3}>
            {currentUser && (
              <FormInput
                component={Textarea}
                label="Avez-vous des commentaires à partager avec l'entreprise ?"
                name={"comments"}
                placeholder="conditions particulières, remarques pour l'entreprise..."
                minRows={3}
                register={register}
              />
            )}

            <Stack>
              <Button
                type={"submit"}
                size={"lg"}
                loading={isAddingMeeting}
                disabled={!currentUser}
                color={"success"}
                sx={{flexGrow: 1}}
                startDecorator={<CheckIcon />}>
                {t("offers.validateInformationAndBook")}
              </Button>
            </Stack>
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
          {label: pageTitle, to: ".", onClick: () => setCurrentFormStep(0)},
          currentFormStep >= 1 && {
            label: t("offers.myInformation"),
            to: ".",
            onClick: () => setCurrentFormStep(1),
          },
        ]}
      />

      <PageContent gap={4} mt={6}>
        {slotsByDate ? (
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
