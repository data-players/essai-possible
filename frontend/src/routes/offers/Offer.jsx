import {useLoaderData, Link as ReactRouterLink} from "react-router-dom";
import {offers} from "./Offers.jsx";
import {HeroBanner, PageContent} from "../../components/Layout";
import {Breadcrumbs} from "./../../components/atoms.jsx";
import Card from "@mui/joy/Card";
import Chip from "@mui/joy/Chip";
import Container from "@mui/joy/Container";
import Grid from "@mui/joy/Grid";
import Stack from "@mui/joy/Stack";
import Typography from "@mui/joy/Typography";
import Button from "@mui/joy/Button";
import LocalOfferRoundedIcon from "@mui/icons-material/LocalOfferRounded";
import CalendarMonthRoundedIcon from "@mui/icons-material/CalendarMonthRounded";
import FlagRoundedIcon from "@mui/icons-material/FlagRounded";
import Box from "@mui/joy/Box";
import {useTranslation} from "react-i18next";
import {BasicList} from "../../components/atoms.jsx";

function getOffer(id) {
  return offers.find((offer) => offer.id === id);
}
export async function loader({params}) {
  const offer = getOffer(params.id);
  return {offer};
}

export function SectorsGoalsDatePills({sectors, goals, startDate}) {
  const {t} = useTranslation();
  return (
    <Grid container columnSpacing={3} rowSpacing={3} p={0}>
      <Grid xs={12} sm={6} md={4}>
        <Chip color={"primary"} startDecorator={<LocalOfferRoundedIcon />}>
          {t("offer.sector", {count: sectors?.length})}
        </Chip>
        <BasicList elements={sectors} />
      </Grid>
      <Grid xs={12} sm={6} md={4}>
        <Chip color={"primary"} startDecorator={<FlagRoundedIcon />}>
          {t("offer.goal", {count: goals?.length})}
        </Chip>
        <BasicList elements={goals} />
      </Grid>
      <Grid xs={12} sm={12} md={4}>
        <Chip color={"primary"} startDecorator={<CalendarMonthRoundedIcon />}>
          {t("offer.startDate")}
        </Chip>
        <Box sx={{mt: 1, ml: 2}}>{t("intlDate", {val: startDate})}</Box>
      </Grid>
    </Grid>
  );
}

export function OfferBanner({
  breadcrumbs,
  offer: {title, company, sectors, goals, startDate},
  cardContent,
}) {
  return (
    <>
      <Breadcrumbs breadcrumbs={breadcrumbs} />
      <HeroBanner
        component={(props) => (
          <Container>
            <Card {...props} />
          </Container>
        )}
        // Make the card go out a little bit on mobile view
        sx={{boxShadow: "lg", mx: -5, py: 6}}>
        <Grid container spacing={8} position={"relative"}>
          <Grid xs={12} md={8}>
            <Stack gap={4}>
              <Typography component="h1" level="h2">
                {title}
              </Typography>

              <Typography component="h2" level="h4">
                {company}
              </Typography>

              <SectorsGoalsDatePills sectors={sectors} goals={goals} startDate={startDate} />
            </Stack>
          </Grid>

          {cardContent && (
            <Grid xs={12} md={4}>
              <Card variant={"solid"} size={"lg"}>
                {cardContent}
              </Card>
            </Grid>
          )}
        </Grid>
      </HeroBanner>
    </>
  );
}

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
      {t("offer.bookAMeetingSlot")}
    </Button>
  );
}

export default function Offer() {
  const {t} = useTranslation();
  const {description, tasks, skills, slots, ...offer} = useLoaderData().offer;

  return (
    <>
      <OfferBanner
        offer={offer}
        breadcrumbs={[
          {label: t("offer.backToOffers"), to: "/offers"},
          {label: offer.title, to: "."},
        ]}
        cardContent={
          <>
            <Stack gap={3}>
              <Typography color={"neutral"} level="h3">
                {t("offer.howToApply")}
              </Typography>
              <Typography fontSize="xl" textColor={"neutral.800"}>
                {t("offer.theCompanyProposesBookingAMeetingSlot")}
              </Typography>
              <Typography textColor={"text.tertiary"}>
                {t("offer.xMeetingSlotsAvailable", {count: slots?.length || 0})}
              </Typography>
              {slots?.length > 0 && <BookMeetingButton />}
            </Stack>
          </>
        }
      />

      <PageContent>
        <Box>
          <Typography level="h3" color="primary" fontWeight={"lg"} mb={2} mt={4}>
            {t("offer.description")}
          </Typography>
          <Typography>{description}</Typography>

          <Typography level="h3" color="primary" fontWeight={"lg"} mb={2} mt={4}>
            {t("offer.tasks")}
          </Typography>
          <Typography>{tasks}</Typography>

          <Typography level="h3" color="primary" fontWeight={"lg"} mb={2} mt={4}>
            {t("offer.skills")}
          </Typography>
          <BasicList elements={skills} />
        </Box>
        {slots?.length > 0 && <BookMeetingButton sx={{mt: 4}} />}
      </PageContent>
    </>
  );
}
