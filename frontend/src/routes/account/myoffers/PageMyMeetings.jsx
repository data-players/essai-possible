import * as React from "react";
import {useSelector} from "react-redux";
import {HeroBanner} from "../../../components/Layout";
import Typography from "@mui/joy/Typography";
import {useTranslation} from "react-i18next";
import Grid from "@mui/joy/Grid";
import Container from "@mui/joy/Container";
import {
  selectAllMeetings,
  selectMeetingsReady,
  useDeleteMeetingMutation,
} from "../../offers/book/meetings-slice.js";
import {selectAllOffers, selectOffersReady} from "../../offers/offers-slice.js";
import OfferListItem from "../../offers/OfferListItem.jsx";
import Stack from "@mui/joy/Stack";
import {useTranslationWithDates} from "../../../app/i18n.js";
import CalendarMonthRoundedIcon from "@mui/icons-material/CalendarMonthRounded.js";
import Button from "@mui/joy/Button";
import dayjs from "dayjs";
import {Link as ReactRouterLink} from "react-router-dom";
import Link from "@mui/joy/Link";
import CreateRoundedIcon from "@mui/icons-material/CreateRounded.js";
import {ButtonWithConfirmation, ListPageContent} from "../../../components/atoms.jsx";
import {useSnackbar} from "../../../components/snackbar.jsx";

export function MeetingCardContent({meeting, offer}) {
  const {t} = useTranslation();
  const [openSnackbar] = useSnackbar();
  const {tDateTime} = useTranslationWithDates();
  const [deleteMeeting, {isLoading: isDeletingMeeting}] = useDeleteMeetingMutation();

  const slot = offer.slots?.find((slot) => meeting.slot === slot.id);
  const addToCalendarUrl =
    "https://calendar.google.com/calendar/render?action=TEMPLATE" +
    "&text=" +
    encodeURI(t("meeting.agendaEventTitle", {offer, meeting})) +
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
          component={ReactRouterLink}
          sx={{mt: 2}}
          variant={"solid"}
          size={"lg"}
          to={`/offers/${offer.id}/book`}
          startDecorator={<CreateRoundedIcon />}>
          {t("edit")}
        </Button>
        <ButtonWithConfirmation
          color={"primary"}
          loading={isDeletingMeeting}
          onClick={async (event) => {
            event.stopPropagation();
            await deleteMeeting(meeting.id).unwrap();
            openSnackbar("Suppression du rendez-vous réussie");
          }}
          areYouSureText={"Êtes vous sûr·e de supprimer ce rendez-vous ?"}>
          Supprimer
        </ButtonWithConfirmation>
        <Button
          component={Link}
          sx={{textDecoration: "none"}}
          href={addToCalendarUrl}
          variant={"plain"}
          target={"_blank"}
          startDecorator={<CalendarMonthRoundedIcon />}>
          {t("meetings.addToCalendar")}
        </Button>
      </Stack>
    </Stack>
  );
}

export default function PageMyMeetings() {
  const {t} = useTranslation();

  const offers = useSelector(selectAllOffers);
  const meetings = useSelector(selectAllMeetings);
  const meetingsReady = useSelector(selectMeetingsReady);
  const offersReady = useSelector(selectOffersReady);

  function OfferListItemWithMeetingInfo({value: meeting}) {
    const offer = offers.find((offer) => offer.slots?.find((slot) => meeting.slot === slot.id));
    return (
      <OfferListItem
        offerId={offer.id}
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
        noResultsText={t("account.youDontHaveMeetingsYet")}
        values={meetings}
        item={OfferListItemWithMeetingInfo}
        getKey={(value) => value.id}
      />
    </>
  );
}
