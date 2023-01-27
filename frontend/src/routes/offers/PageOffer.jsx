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
import {MeetingCardContent} from "../account/PageMyMeetings.jsx";
import {selectMeetingForOffer} from "./book/meetings-slice.js";
import Card from "@mui/joy/Card";
import React from "react";
import CompanyOfferPreview from "./CompanyOfferPreview.jsx";
import OfferSider from "./OfferSider.jsx";

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
          {t("offers.chooseASlotToExchangeWithTheCompany")}
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
    <CompanyOfferPreview offer={offer}>
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
              <OfferSider offer={offer} display={{xs: "flex", md: "none"}} />

              <ParagraphWithTitle title={t("offers.tasks")}>
                <Typography textAlign={"justify"}>{offer.tasks}</Typography>
              </ParagraphWithTitle>

              <ParagraphWithTitle title={t("offers.skills")}>
                <Typography textAlign={"justify"}>{offer.skills}</Typography>
              </ParagraphWithTitle>

              <ParagraphWithTitle title={t("offers.softSkills")}>
                <BasicList elements={offer.softSkills} />
              </ParagraphWithTitle>

              <ParagraphWithTitle title={t("offers.workEnvironment")}>
                <Typography textAlign={"justify"}>{offer.workEnvironment}</Typography>
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
            <OfferSider offer={offer} display={{xs: "none", md: "flex"}} />
          </Grid>
        </Grid>
      </PageContent>
    </CompanyOfferPreview>
  );
}
