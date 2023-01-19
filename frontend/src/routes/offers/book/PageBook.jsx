import React, {useState} from "react";
import List from "@mui/joy/List";
import ListItem from "@mui/joy/ListItem";
import Stack from "@mui/joy/Stack";
import Typography from "@mui/joy/Typography";
import Button from "@mui/joy/Button";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import CalendarMonthRoundedIcon from "@mui/icons-material/CalendarMonthRounded";
import {Trans} from "react-i18next";
import {Form, RadioChips} from "../../../components/atoms.jsx";
import ListSubheader from "@mui/joy/ListSubheader";
import CheckIcon from "@mui/icons-material/Check";
import {groupBy} from "../../../app/utils.js";
import {PageContent} from "../../../components/Layout.jsx";
import Textarea from "@mui/joy/Textarea";
import FormControl from "@mui/joy/FormControl";
import FormLabel from "@mui/joy/FormLabel";
import Collapse from "@mui/material/Collapse";
import Sheet from "@mui/joy/Sheet";
import {selectOfferById} from "../offers-slice.js";
import OfferBanner from "../OfferBanner.jsx";
import dayjs from "dayjs";
import {useParams} from "react-router-dom";
import {useTranslationWithDates} from "../../../app/i18n.js";
import {AuthCard} from "../../account/AuthCard.jsx";
import {useDispatch, useSelector} from "react-redux";
import {meetingsActions, selectSavedFormData} from "./meetings-slice.js";
import {selectCurrentUser} from "../../../app/auth-slice.js";

export default function PageBook() {
  const dispatch = useDispatch();
  const {t, tTime, tDate, tDateTime} = useTranslationWithDates();
  const {id} = useParams();

  const offer = useSelector((state) => selectOfferById(state, id)) || {};

  const currentUser = useSelector(selectCurrentUser);
  const {selectedMeetingSlot, comments} =
    useSelector((state) => selectSavedFormData(state, id)) || {};

  const setFormData = (data) =>
    dispatch(
      meetingsActions.saveFormData({
        offerId: id,
        data,
      })
    );

  const [formStep, setFormStep] = useState(selectedMeetingSlot ? 1 : 0);
  const nextStep = () => setFormStep(formStep + 1);
  const lastStep = () => setFormStep(formStep - 1);

  const sortedSlots = [...offer.slots].sort((a, b) =>
    dayjs(a.start).isAfter(dayjs(b.start)) ? 1 : -1
  );

  const slotsByDate = groupBy(sortedSlots, (slot) => tDate(slot.start));

  const StepTitle = ({children}) => (
    <Typography mt={4} mb={1} level={"h2"} color={"primary"}>
      {children}
    </Typography>
  );

  function BackValidationButton(props) {
    return (
      <Button
        size={"sm"}
        variant={"soft"}
        color="danger"
        onClick={lastStep}
        startDecorator={<ChevronLeftIcon />}
        {...props}
      />
    );
  }

  /**
   * Steps of the booking form
   */
  const steps = [
    // MEETING SLOT CHOICE
    <>
      <StepTitle> {t("offers.chooseYourMeetingSlot")}</StepTitle>

      <List>
        {Object.entries(slotsByDate).map(([date, slots]) => (
          <React.Fragment key={date}>
            <ListSubheader sx={{fontSize: "md"}}>{date}</ListSubheader>
            <ListItem sx={{mb: 3}}>
              <RadioChips
                options={slots.map((slot) => ({
                  label: tTime(slot.start),
                  icon: CalendarMonthRoundedIcon,
                  key: slot.start.toString(),
                }))}
                value={selectedMeetingSlot}
                setFieldValue={(slot) => setFormData({selectedMeetingSlot: slot})}
              />
            </ListItem>
          </React.Fragment>
        ))}
      </List>

      <Button
        size={"lg"}
        disabled={!selectedMeetingSlot}
        color="success"
        onClick={nextStep}
        startDecorator={<CheckIcon />}>
        {t("offers.chooseThisMeetingSlot")}
      </Button>
    </>,

    // USER LOGIN/SIGNUP + COMMENTS
    <>
      <StepTitle>{t("offers.myInformation")}</StepTitle>

      <Stack gap={3}>
        <AuthCard />

        {currentUser && (
          <Form
            initialValues={{comments}}
            successText={"Rendez-vous réservé avec succès"}
            onSubmit={(values) => dispatch(meetingsActions.saveFormData)}>
            {(register) => (
              <Stack gap={3}>
                <FormControl>
                  <FormLabel htmlFor="comments">
                    Avez-vous des commentaires à partager avec l'entreprise ?
                  </FormLabel>
                  <Textarea
                    placeholder="commentaires, remarques..."
                    minRows={3}
                    {...register("comments")}
                  />
                </FormControl>

                <Stack
                  direction={{xs: "column-reverse", sm: "row"}}
                  rowGap={2}
                  columnGap={3}
                  mt={2}>
                  <BackValidationButton onClick={lastStep} sx={{flexGrow: 0}}>
                    {t("goBack")}
                  </BackValidationButton>
                  <Button
                    type={"submit"}
                    size={"lg"}
                    disabled={!selectedMeetingSlot}
                    color={"success"}
                    sx={{flexGrow: 1}}
                    startDecorator={<CheckIcon />}>
                    {t("offers.validateInformation")}
                  </Button>
                </Stack>
              </Stack>
            )}
          </Form>
        )}
      </Stack>
    </>,
  ];

  return (
    <>
      <OfferBanner
        pageTitle={t("offers.bookAMeetingSlot", {context: "short"})}
        offer={offer}
        breadcrumbs={[
          {label: t("offers.backToOffers"), to: "/offers"},
          {label: offer.title, to: "./.."},
          {label: t("offers.bookAMeetingSlot"), to: ".", onClick: () => setFormStep(0)},
          formStep >= 1 && {
            label: t("offers.myInformation"),
            to: ".",
            onClick: () => setFormStep(1),
          },
        ]}
      />

      <PageContent gap={2}>
        {slotsByDate ? (
          <>
            {steps[formStep]}

            <Sheet>
              <Collapse in={selectedMeetingSlot}>
                {selectedMeetingSlot && (
                  <Typography sx={{alignSelf: "center"}} textColor={"text.tertiary"}>
                    <Trans
                      i18nKey="offers.youAreAboutToBookAMeetingOnThe"
                      values={{
                        dateTime: tDateTime(
                          sortedSlots.find((slot) => slot.start.toString() === selectedMeetingSlot)
                            .start
                        ),
                      }}
                    />
                  </Typography>
                )}
              </Collapse>
            </Sheet>
          </>
        ) : (
          <Typography mt={4} textColor={"text.tertiary"}>
            {t("offers.ohOhNoMeetings")}
          </Typography>
        )}
      </PageContent>
    </>
  );
}
