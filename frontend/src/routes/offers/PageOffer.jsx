import {Link as ReactRouterLink, useParams} from "react-router-dom";
import {PageContent} from "../../components/Layout";
import Stack from "@mui/joy/Stack";
import Typography from "@mui/joy/Typography";
import Button from "@mui/joy/Button";
import CalendarMonthRoundedIcon from "@mui/icons-material/CalendarMonthRounded";
import {useTranslation} from "react-i18next";
import {BasicList} from "../../components/atoms.jsx";
import {selectOfferById} from "./offers-slice.js";
import OfferBanner from "./OfferBanner.jsx";
import {useSelector} from "react-redux";
import Grid from "@mui/joy/Grid";
import CompanySider from "./CompanySider";

function BookMeetingButton(props) {
  const {t} = useTranslation();
  return (
    <Button
      variant={"solid"}
      color="primary"
      size={"lg"}
      component={ReactRouterLink}
      to={"book"}
      startDecorator={<CalendarMonthRoundedIcon />}
      {...props}>
      {t("offers.bookAMeetingSlot", {context: "short"})}
    </Button>
  );
}

export default function PageOffer() {
  const {t} = useTranslation();
  const {id} = useParams();

  const offer = useSelector((state) => selectOfferById(state, id)) || {};

  const ParagraphWithTitle = ({title, children}) => (
    <Stack gap={2}>
      <Typography level="h3" color="primary" fontWeight={"lg"}>
        {title}
      </Typography>
      {children}
    </Stack>
  );

  return (
    <>
      <OfferBanner
        offer={offer}
        breadcrumbs={[
          {label: t("offers.backToOffers"), to: "/offers"},
          {label: offer.title, to: "."},
        ]}
        cardContent={
          <>
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
              {offer.slots?.length > 0 && <BookMeetingButton />}
            </Stack>
          </>
        }
      />

      <PageContent mt={4}>
        <Grid container columnSpacing={4}>
          <Grid xs={8}>
            <Stack gap={2}>
              <ParagraphWithTitle title={t("offers.description")}>
                <Typography>{offer.description}</Typography>
              </ParagraphWithTitle>
              <ParagraphWithTitle title={t("offers.tasks")}>
                <Typography>{offer.tasks}</Typography>
              </ParagraphWithTitle>
              <ParagraphWithTitle title={t("offers.skills")}>
                <BasicList elements={offer.skills} />
              </ParagraphWithTitle>
              {offer.slots?.length > 0 && <BookMeetingButton />}
            </Stack>
          </Grid>

          <Grid xs={4} sx={{alignSelf: "start", position: "sticky", top: 0}}>
            <CompanySider offer={offer} />
          </Grid>
        </Grid>
      </PageContent>
    </>
  );
}
