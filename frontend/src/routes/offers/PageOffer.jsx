import {Link as ReactRouterLink, useParams} from "react-router-dom";
import {PageContent} from "../../components/Layout";
import Stack from "@mui/joy/Stack";
import Typography from "@mui/joy/Typography";
import Textarea from "@mui/joy/Textarea";
import Button from "@mui/joy/Button";

import CalendarMonthRoundedIcon from "@mui/icons-material/CalendarMonthRounded";
import {useTranslation} from "react-i18next";
import {BasicList, ParagraphWithTitle} from "../../components/atoms.jsx";
import {
  selectAllSkills,
  selectSkillsReady,
  selectAllStatus,
  selectStatusReady
} from "../../app/concepts-slice.js";
import {
  selectCurrentUserStatus,
} from "../../app/auth-slice.js";
import {selectOfferById
} from "./offers-slice.js";
import {
  selectSlotsForOffer
} from "./book/slots-slice.js";
// import {selectMeetingForOffer} from "./book/meetings-slice.js";
import OfferBanner from "./OfferBanner.jsx";
import {useSelector} from "react-redux";
import Grid from "@mui/joy/Grid";
import {MeetingCardContent} from "../account/PageMyMeetings.jsx";
import Card from "@mui/joy/Card";
import React from "react";
import CompanyOfferPreview from "./CompanyOfferPreview.jsx";
import OfferSider from "./OfferSider.jsx";
import {LoadingSpinner} from "../../components/atoms.jsx";

export default function PageOffer() {
  const {t} = useTranslation();
  const {id} = useParams();

  // const status = useSelector(selectAllStatus);
  // const statusReady = useSelector(selectStatusReady)
  const skills = useSelector(selectAllSkills);
  const skillsReady = useSelector(selectSkillsReady)
  const offer = useSelector((state) => selectOfferById(state, encodeURIComponent(id))) || {};
  const currentUserstatus = useSelector(selectCurrentUserStatus);
  // console.log(statusReady,skillsReady)

  const skillsOfferLabels = offer.softSkills?.map(cs=>skills.find(s=>s.id==cs)?.label);
  // const isDraft = offer.status === status.find(s=>s.id.includes('brouillon'))?.id;
  // const isPublished = offer.status === status.find(s=>s.id.includes('publiee'))?.id;
  // const isFulfilled = offer.status === status.find(s=>s.id.includes('pourvue'))?.id;
  // console.log('offer?.slots',offer?.slots)
  const slotFulfilled = offer?.slots?.find(s=> s.user!=undefined && !(Array.isArray(s.user) && s.user.length<1));
  const renderReady =skillsReady && currentUserstatus!='pending'


  function MeetingCard() {
    const status = useSelector(selectAllStatus);
    const isDraft = offer.status === status.find(s=>s.id.includes('brouillon'))?.id;
    const isPublished = offer.status === status.find(s=>s.id.includes('publiee'))?.id;
    const isFulfilled = offer.status === status.find(s=>s.id.includes('pourvue'))?.id;
    return slotFulfilled ? (
      <MeetingCardContent offer={offer} slot={slotFulfilled} />
    ) : (
      <Stack gap={3}>
        <Typography color={"neutral"} level="h3">
          {t("offers.howToApply")}
        </Typography>
        <Typography fontSize="xl" textColor={"neutral.800"}>
          {t("offers.chooseASlotToExchangeWithTheCompany")}
        </Typography>
        <Typography textColor={"text.tertiary"}>
          {t("offers.xMeetingSlotsAvailable", {count: offer?.nextSlots?.length || 0})}
        </Typography>
        {offer?.nextSlots?.length > 0 && (
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
  // console.log('renderReady',renderReady)

  return !renderReady ? (
    <LoadingSpinner />
  ) : (
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
                <Textarea value={offer.description} readOnly variant='plain' sx={{backgroundColor:'transparent'}} disabled color='string'/>
              </ParagraphWithTitle>

              {/* Company card in the text on xs+ screens */}
              <OfferSider offer={offer} display={{xs: "flex", md: "none"}} />

              <ParagraphWithTitle title={t("offers.tasks")}>
                <Textarea value={offer.tasks} readOnly variant='plain' sx={{backgroundColor:'transparent'}} disabled color='string'/>
              </ParagraphWithTitle>

              <ParagraphWithTitle title={t("offers.skills")}>
                <Textarea value={offer.skills} readOnly variant='plain' sx={{backgroundColor:'transparent'}} disabled color='string'/>
              </ParagraphWithTitle>

              <ParagraphWithTitle title={t("offers.softSkills")}>
                <BasicList elements={skillsOfferLabels} />
              </ParagraphWithTitle>

              <ParagraphWithTitle title={t("offers.workEnvironment")}>
                <Textarea value={offer.workEnvironment} readOnly variant='plain' sx={{backgroundColor:'transparent'}} disabled color='string'/>
              </ParagraphWithTitle>

              {offer?.nextSlots?.length > 0 && (
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
  )
  // return (
    
  // );
}
