import {Link as ReactRouterLink, useParams} from "react-router-dom";
import {PageContent} from "../../components/Layout";
import {LoadingSpinner} from "./../../components/atoms.jsx";
import Stack from "@mui/joy/Stack";
import Typography from "@mui/joy/Typography";
import Button from "@mui/joy/Button";
import CalendarMonthRoundedIcon from "@mui/icons-material/CalendarMonthRounded";
import {useTranslation} from "react-i18next";
import {BasicList} from "../../components/atoms.jsx";
import {selectOfferById, useFetchOfferQuery} from "./offers-slice.js";
import {OfferBanner} from "./OfferBanner.jsx";
import {useSelector} from "react-redux";

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
      {t("offer.bookAMeetingSlot", {context: "short"})}
    </Button>
  );
}

export default function PageOffer() {
  const {t} = useTranslation();
  const {id} = useParams();

  const {isLoading} = useFetchOfferQuery(id);
  const offer = useSelector((state) => selectOfferById(state, id));

  if (isLoading) return <LoadingSpinner />;

  console.log(isLoading, offer);

  const {title, description, tasks, skills, slots} = offer;

  return (
    <>
      <OfferBanner
        offer={offer}
        breadcrumbs={[
          {label: t("offer.backToOffers"), to: "/offers"},
          {label: title, to: "."},
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

      <PageContent gap={2}>
        <Typography level="h3" color="primary" fontWeight={"lg"} mt={2}>
          {t("offer.description")}
        </Typography>
        <Typography>{description}</Typography>

        <Typography level="h3" color="primary" fontWeight={"lg"} mt={2}>
          {t("offer.tasks")}
        </Typography>
        <Typography>{tasks}</Typography>

        <Typography level="h3" color="primary" fontWeight={"lg"} mt={2}>
          {t("offer.skills")}
        </Typography>
        <BasicList elements={skills} />

        {slots?.length > 0 && <BookMeetingButton sx={{mt: 2}} />}
      </PageContent>
    </>
  );
}
