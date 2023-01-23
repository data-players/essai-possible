import React, {useEffect, useState} from "react";
import List from "@mui/joy/List";
import ListItem from "@mui/joy/ListItem";
import Stack from "@mui/joy/Stack";
import Typography from "@mui/joy/Typography";
import Button from "@mui/joy/Button";
import CalendarMonthRoundedIcon from "@mui/icons-material/CalendarMonthRounded";
import {Trans} from "react-i18next";
import {Form, ParagraphWithTitle, RadioChips} from "../../../components/atoms.jsx";
import ListSubheader from "@mui/joy/ListSubheader";
import CheckIcon from "@mui/icons-material/Check";
import {groupBy} from "../../../app/utils.js";
import {PageContent} from "../../../components/Layout.jsx";
import Textarea from "@mui/joy/Textarea";
import FormControl from "@mui/joy/FormControl";
import FormLabel from "@mui/joy/FormLabel";
import Collapse from "@mui/material/Collapse";
import {selectOfferById} from "../offers-slice.js";
import OfferBanner from "../OfferBanner.jsx";
import dayjs from "dayjs";
import {useNavigate, useParams} from "react-router-dom";
import {useTranslationWithDates} from "../../../app/i18n.js";
import {AuthCard} from "../../account/AuthCard.jsx";
import {useDispatch, useSelector} from "react-redux";
import {
  meetingsActions,
  selectMeetingForOffer,
  selectSavedFormData,
  useAddMeetingMutation,
  useUpdateMeetingMutation,
} from "./meetings-slice.js";
import {selectCurrentUser} from "../../../app/auth-slice.js";
import Divider from "@mui/joy/Divider";
import Box from "@mui/joy/Box";

const StepForm = ({
  stepNumber,
  setCurrentFormStep,
  currentFormStep,
  children,
  title,
  subtitle,
  hasData = false,
}) => {
  const showTitle = !!(currentFormStep >= stepNumber || hasData);
  const showContent = currentFormStep === stepNumber;
  const onClickProps = showTitle &&
    !showContent && {
      onClick: () => setCurrentFormStep(stepNumber),
      sx: {cursor: "pointer"},
    };
  return (
    <Stack {...onClickProps}>
      <Collapse in={showTitle}>
        <ParagraphWithTitle title={`${stepNumber + 1}. ${title}`}>{subtitle}</ParagraphWithTitle>
      </Collapse>
      <Collapse in={showContent}>
        <Box mt={2}>{children}</Box>
      </Collapse>
      <Collapse in={showTitle && !showContent}>
        <Button sx={{mt: 2}} variant="soft" size={"sm"} color="neutral">
          Modifier
        </Button>
        <Divider sx={{mt: 2}} />
      </Collapse>
    </Stack>
  );
};

export default function PageBook() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {t, tTime, tDate, tDateTime} = useTranslationWithDates();
  const {id} = useParams();

  const offer = useSelector((state) => selectOfferById(state, id)) || {};

  const meetingForOffer = useSelector((state) => selectMeetingForOffer(state, offer));
  const [addMeeting, {isLoading: isAddingMeeting}] = useAddMeetingMutation();
  const [updateMeeting, {isLoading: isUpdatingMeeting}] = useUpdateMeetingMutation();

  const currentUser = useSelector(selectCurrentUser);
  const {slot: selectedMeetingSlot, comments} =
    useSelector((state) => selectSavedFormData(state, id)) || {};

  useEffect(() => {
    if (meetingForOffer)
      setFormData({
        comments: meetingForOffer.comments,
        slot: meetingForOffer.slot,
      });
  }, [meetingForOffer]);

  const setFormData = (data) =>
    dispatch(
      meetingsActions.saveFormData({
        offerId: id,
        data,
      })
    );

  const [currentFormStep, setCurrentFormStep] = useState(selectedMeetingSlot ? 1 : 0);

  const pageTitle = meetingForOffer
    ? t("offers.modifyAMeetingSlot", {context: "short"})
    : t("offers.bookAMeetingSlot", {context: "short"});

  const sortedSlots = [...offer.slots].sort((a, b) =>
    dayjs(a.start).isAfter(dayjs(b.start)) ? 1 : -1
  );

  const slotsByDate = groupBy(sortedSlots, (slot) => tDate(slot.start));

  /**
   * Steps of the booking form
   */
  const steps = [
    // MEETING SLOT CHOICE
    <StepForm
      key={0}
      stepNumber={0}
      currentFormStep={currentFormStep}
      setCurrentFormStep={setCurrentFormStep}
      title={t("offers.chooseYourMeetingSlot")}
      subtitle={
        <Collapse in={!!selectedMeetingSlot}>
          {selectedMeetingSlot && (
            <Typography fontSize={"lg"} textColor={"text.secondary"}>
              <Trans
                i18nKey="offers.youAreAboutToBookAMeetingOnThe"
                values={{
                  dateTime: tDateTime(
                    sortedSlots.find((slot) => slot.id === selectedMeetingSlot).start
                  ),
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
                value={selectedMeetingSlot}
                setFieldValue={(slot) => setFormData({slot})}
              />
            </ListItem>
          </React.Fragment>
        ))}
      </List>

      <Stack>
        <Button
          size={"lg"}
          disabled={!selectedMeetingSlot}
          color="success"
          onClick={() => setCurrentFormStep(currentFormStep + 1)}
          startDecorator={<CheckIcon />}>
          {t("offers.chooseThisMeetingSlot")}
        </Button>
      </Stack>
    </StepForm>,

    // USER LOGIN/SIGNUP + COMMENTS
    <StepForm
      key={1}
      stepNumber={1}
      currentFormStep={currentFormStep}
      setCurrentFormStep={setCurrentFormStep}
      title={t("offers.myInformation")}
      hasData={meetingForOffer || comments?.length > 0}
      subtitle={<AuthCard />}>
      <Form
        initialValues={{comments: comments || meetingForOffer?.comments}}
        successText={meetingForOffer ? "Rendez-vous modifié" : "Rendez-vous réservé avec succès"}
        onSubmit={async ({comments}) => {
          if (meetingForOffer) {
            await updateMeeting({
              id: meetingForOffer.id,
              slot: selectedMeetingSlot,
              comments,
            }).unwrap();
          } else {
            await addMeeting({
              slot: selectedMeetingSlot,
              comments,
            }).unwrap();
          }

          navigate("/my-meetings");
        }}>
        {(register) => (
          <Stack gap={3}>
            {currentUser && (
              <FormControl>
                <FormLabel htmlFor="comments">
                  Avez-vous des commentaires à partager avec l'entreprise ?
                </FormLabel>
                <Textarea
                  placeholder="conditions particulières, remarques pour l'entreprise..."
                  minRows={3}
                  {...register("comments")}
                />
              </FormControl>
            )}

            <Stack>
              <Button
                type={"submit"}
                size={"lg"}
                loading={isAddingMeeting || isUpdatingMeeting}
                disabled={!currentUser}
                color={"success"}
                sx={{flexGrow: 1}}
                startDecorator={<CheckIcon />}>
                {meetingForOffer
                  ? t("offers.modifyInformation")
                  : t("offers.validateInformationAndBook")}
              </Button>
            </Stack>
          </Stack>
        )}
      </Form>
    </StepForm>,
  ];

  return (
    <>
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
    </>
  );
}
