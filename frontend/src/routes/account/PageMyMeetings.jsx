import * as React from "react";
import {useSelector} from "react-redux";
import {HeroBanner} from "../../components/Layout.jsx";
import Typography from "@mui/joy/Typography";
import {useTranslation} from "react-i18next";
import Grid from "@mui/joy/Grid";
import Container from "@mui/joy/Container";
import {
  // selectAllMeetings,
  // selectMeetingsReady,
  // useDeleteMeetingMutation,
} from "../offers/book/meetings-slice.js";
import {selectOfferById, selectOffersReady} from "../offers/offers-slice.js";
import OfferListItem from "../offers/OfferListItem.jsx";
import Stack from "@mui/joy/Stack";
import {useTranslationWithDates} from "../../app/i18n.js";
import CalendarMonthRoundedIcon from "@mui/icons-material/CalendarMonthRounded.js";
import Button from "@mui/joy/Button";
import dayjs from "dayjs";
import Link from "@mui/joy/Link";
import {ButtonWithConfirmation, ListPageContent} from "../../components/atoms.jsx";
import {useSnackbar} from "../../components/snackbar.jsx";
import {selectSlotById, selectSlotsForOffer} from "../offers/book/slots-slice.js";

export function MeetingCardContent({meeting, offer}) {
  const {t} = useTranslation();
  const [openSnackbar] = useSnackbar();
  const {tDateTime} = useTranslationWithDates();
  // const [deleteMeeting, {isLoading: isDeletingMeeting}] = useDeleteMeetingMutation();
  const isDeletingMeeting = false;

  const slotsForOffer = useSelector((state) => selectSlotsForOffer(state, offer.id));
  const slot = slotsForOffer?.find((slot) => slot.id === meeting.slot) || {};

  const addToCalendarUrl =
    "https://calendar.google.com/calendar/render?action=TEMPLATE" +
    "&text=" +
    encodeURI(t("meeting.agendaEventTitle", {offer})) +
    "&dates=" +
    dayjs(slot.start).format("YYYYMMDD[T]HHmm[00Z") +
    "%2F" +
    dayjs(slot.start).clone().add(slot.duration, "minutes").format("YYYYMMDD[T]HHmm[00Z");

  return (
    <Stack gap={3}>
      <Typography level="body" sx={{color: "text.tertiary"}}>
        Vous avez réservé le créneau suivant :
      </Typography>
      <Typography level="h3">{tDateTime(slot.start)}</Typography>
      <Typography>{meeting.comments}</Typography>
      <Stack gap={2} onClick={(event) => event.stopPropagation()}>
        <Button
          component={Link}
          size={"lg"}
          sx={{textDecoration: "none"}}
          href={addToCalendarUrl}
          target={"_blank"}
          startDecorator={<CalendarMonthRoundedIcon />}>
          {t("meetings.addToCalendar")}
        </Button>
        <ButtonWithConfirmation
          color={"primary"}
          loading={isDeletingMeeting}
          onClick={async (event) => {
            event.stopPropagation();
            // await deleteMeeting(meeting.id).unwrap();
            openSnackbar("Suppression du rendez-vous réussie");
          }}
          areYouSureText={
            "Êtes vous sûr·e de vouloir supprimer ce rendez-vous ? L'entreprise sera mise au courant."
          }>
          Supprimer
        </ButtonWithConfirmation>
      </Stack>
    </Stack>
  );
}

export default function PageMyMeetings() {
  const {t} = useTranslation();

  const offersReady = useSelector(selectOffersReady);
  // const meetings = useSelector(selectAllMeetings);
  const meetings =[];
  // const meetingsReady = useSelector(selectMeetingsReady);
  const meetingsReady = true;

  function OfferListItemWithMeetingInfo({value: meeting}) {
    const slot = useSelector((state) => selectSlotById(state, meeting.slot));
    const offer = useSelector((state) => selectOfferById(state, slot.offer));
    return (
      <OfferListItem
        value={offer.id}
        sideElement={() => <MeetingCardContent offer={offer} meeting={meeting} />}
      />
    );
  }

  return (
    <>
      <HeroBanner invertedColors={false}>
        <Container mx={2}>
          <Grid container spacing={2}>
            <Grid xs={12} display={"flex"} justifyContent={"center"}>
              <Typography level="h1" color={"white"}>
                {t("account.myMeetings")}
              </Typography>
            </Grid>
          </Grid>
        </Container>
      </HeroBanner>

      <ListPageContent
        ready={offersReady && meetingsReady}
        noResultsContent={t("account.youDontHaveMeetingsYet")}
        values={meetings}
        item={OfferListItemWithMeetingInfo}
        getKey={(value) => value.id}
      />
    </>
  );
}
