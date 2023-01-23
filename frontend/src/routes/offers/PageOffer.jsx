import {Link as ReactRouterLink, useParams} from "react-router-dom";
import {PageContent} from "../../components/Layout";
import Stack from "@mui/joy/Stack";
import Typography from "@mui/joy/Typography";
import Button from "@mui/joy/Button";
import CalendarMonthRoundedIcon from "@mui/icons-material/CalendarMonthRounded";
import {useTranslation} from "react-i18next";
import {BasicList, ParagraphWithTitle} from "../../components/atoms.jsx";
import {selectOfferById} from "./offers-slice.js";
import OfferBanner from "./OfferBanner.jsx";
import {useSelector} from "react-redux";
import Grid from "@mui/joy/Grid";
import CompanyCard from "./CompanyCard.jsx";
import Box from "@mui/joy/Box";
import {MeetingCardContent} from "../account/PageMyMeetings.jsx";
import {selectMeetingForOffer} from "./book/meetings-slice.js";
import Card from "@mui/joy/Card";

export default function PageOffer() {
  const {t} = useTranslation();
  const {id} = useParams();

  const offer = useSelector((state) => selectOfferById(state, id)) || {};
  const meetingForOffer = useSelector((state) => selectMeetingForOffer(state, offer.id));

  function MeetingCard() {
    return meetingForOffer ? (
      <MeetingCardContent offer={offer} meeting={meetingForOffer} />
    ) : (
      <Stack gap={3}>
        <Typography color={"neutral"} level="h3">
          {t("offers.howToApply")}
        </Typography>
        <Typography fontSize="xl" textColor={"neutral.800"}>
          {t("offers.theCompanyProposesBookingAMeetingSlot")}
        </Typography>
        <Typography textColor={"text.tertiary"}>
          {t("offers.xMeetingSlotsAvailable", {count: offer.slots?.length || 0})}
        </Typography>
        {offer.slots?.length > 0 && (
          <Button
            variant={"solid"}
            color="primary"
            size={"lg"}
            component={ReactRouterLink}
            to={"book"}
            startDecorator={<CalendarMonthRoundedIcon />}>
            {t("offers.bookAMeetingSlot", {context: "short"})}
          </Button>
        )}
      </Stack>
    );
  }

  return (
    <>
      <OfferBanner
        offer={offer}
        breadcrumbs={[
          {label: t("offers.backToOffers"), to: "/offers"},
          {label: offer.title, to: "."},
        ]}
        cardContent={<MeetingCard />}
      />

      <PageContent mt={6}>
        <Grid container columnSpacing={8}>
          <Grid xs={12} md={8}>
            <Stack gap={4}>
              <ParagraphWithTitle title={t("offers.description")}>
                <Typography textAlign={"justify"}>{offer.description}</Typography>
              </ParagraphWithTitle>

              {/* Company card in the text on xs+ screens */}
              <Box my={2} display={{xs: "block", md: "none"}}>
                <CompanyCard offer={offer} />
              </Box>

              <ParagraphWithTitle title={t("offers.tasks")}>
                <Typography textAlign={"justify"}>{offer.tasks}</Typography>
              </ParagraphWithTitle>

              <ParagraphWithTitle title={t("offers.skills")}>
                <BasicList elements={offer.skills} />
              </ParagraphWithTitle>

              {offer.slots?.length > 0 && (
                <Card variant={"soft"}>
                  <MeetingCard />
                </Card>
              )}
            </Stack>
          </Grid>

          {/* Company card on the side in md+ screens */}
          <Grid xs={0} md={4}>
            <Stack gap={3} display={{xs: "none", md: "flex"}}>
              <CompanyCard offer={offer} />
            </Stack>
          </Grid>
        </Grid>
      </PageContent>
    </>
  );
}
