import Button from "@mui/joy/Button";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import CreateRoundedIcon from "@mui/icons-material/CreateRounded";
import BookTwoTone from "@mui/icons-material/BookTwoTone";
import {HeroBanner, PageContent} from "../components/Layout.jsx";
import {Link as ReactRouterLink} from "react-router-dom";
import {Trans, useTranslation} from "react-i18next";
import * as React from "react";
import Box from "@mui/joy/Box";
import Container from "@mui/joy/Container";
import PartnersImage from "../assets/partners.png";
import ImplantationsImage from "../assets/implantations.png";
import Grid from "@mui/joy/Grid";
import Stack from "@mui/joy/Stack";
import Typography from "@mui/joy/Typography";
import Card from "@mui/joy/Card";
import Link from "@mui/joy/Link";
import {ExternalLink} from "../components/atoms";
import MailOutlineRoundedIcon from "@mui/icons-material/MailOutlineRounded";
import {useSelector} from "react-redux";
import {selectCurrentUser} from "../app/auth-slice.js";

export default function HomePage() {
  const {t} = useTranslation();
  const currentUser = useSelector(selectCurrentUser);
  const isACompanyAccount = currentUser?.companies?.length > 0;

  const companyActionUrl =
    currentUser && isACompanyAccount
      ? `/company/${encodeURIComponent(currentUser.companies[0])}`
      : "/company/signup";

  return (
    <>
      {/* HERO HEADER */}
      <HeroBanner>
        <Stack gap={6} position={"relative"} p={2}>
          <Box mb={{md: 2}}>
            <Typography level="h1" component={"h2"} mb={{xs: 2, md: 4}}>
              {t("homePage.heroHeadline")}
            </Typography>
            <Typography level="h4" component={"h3"} mb={{xs: 4, md: 6}}>
              {t("homePage.heroSubtitle")}
            </Typography>
            <Typography fontSize={"lg"} component={"h4"} textColor={"text.tertiary"}>
              {t("homePage.heroCreatedBy")}
              <Link
                variant={"soft"}
                href={"https://www.toustespossibles.fr"}
                target="_blank"
                textColor={"text.tertiary"}
                rel="noreferrer">
                {t("tousTesPossibles")}
              </Link>
            </Typography>
          </Box>
          <Stack
            direction={{md: "row"}}
            rowGap={5}
            columnGap={{md: 7, lg: 10}}
            justifyContent={"space-between"}>
            <Card
              invertedColors
              color={"primary"}
              variant={"solid"}
              size={"lg"}
              sx={{flexBasis: "50%"}}>
              <Stack gap={4} m={1}>
                <Typography level="h2">{t("homePage.candidates")}</Typography>
                <Typography level="h4">
                  <Trans i18nKey="homePage.heroExplanationCandidates" />
                </Typography>
                <Button
                  component={ReactRouterLink}
                  to={"/offers"}
                  size={"lg"}
                  startDecorator={<SearchRoundedIcon />}>
                  {t("offers.seeOffers")}
                </Button>
              </Stack>
            </Card>

            <Card variant={"soft"} size={"lg"} sx={{flexBasis: "50%"}}>
              <Stack gap={4} m={1}>
                <Typography level="h2">{t("homePage.companies")}</Typography>
                <Typography level="h4">
                  <Trans i18nKey="homePage.heroExplanationHiringManagers" />
                </Typography>
                <Button
                  component={ReactRouterLink}
                  variant={"soft"}
                  to={companyActionUrl}
                  size={"lg"}
                  startDecorator={<AddRoundedIcon />}>
                  {t("offers.proposeAnOffer")}
                </Button>
              </Stack>
            </Card>
          </Stack>
        </Stack>
      </HeroBanner>

      <Stack mt={6} gap={6}>
        {/* VIDEO EXPLANATION TOUS TES POSSIBLES CARD */}
        <PageContent>
          <Card variant={"soft"} size={"lg"}>
            <Grid container spacing={4} alignItems="center">
              <Grid xs={12} md={4} sx={{alignItems: "stretch"}}>
                <Stack gap={4} m={1}>
                  <Typography level="h2">
                    {t("homePage.whatIfWeProposeYouAnotherWayOfPassingJobInterviews")}
                  </Typography>
                  <Typography level={"h4"} component={"p"}>
                    {t("homePage.videoExplanation")}
                  </Typography>
                  <Button
                    component={ReactRouterLink}
                    color={"neutral"}
                    to={"offers"}
                    size={"lg"}
                    startDecorator={<SearchRoundedIcon />}>
                    {t("homePage.iJumpIn")}
                  </Button>
                </Stack>
              </Grid>
              <Grid xs={12} md={8} sx={{alignItems: "stretch"}}>
                <Box
                  component={"iframe"}
                  width="100%"
                  sx={{aspectRatio: "16 / 9", borderRadius: 4, borderWidth: 0, boxShadow: "md"}}
                  src="https://www.youtube-nocookie.com/embed/m4uD5NxzYoA"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen></Box>
              </Grid>
            </Grid>
          </Card>
        </PageContent>

        {/* CALL TO ACTION HIRING MANAGERS */}
        <HeroBanner noBackground color={"primary"} sx={{mt: -3}}>
          <Container maxWidth={"lg"}>
            <Stack gap={4}>
              <Typography level="h2">
                {t("homePage.youreACompanyAndYouWantToProposeAnOffer")}
              </Typography>
              <Typography level="h4" component={"p"}>
                {t("homePage.dontHesitateAndFillTheInformation")}
              </Typography>
              <Grid container spacing={10}>
                <Grid xs={6}>
                  <Button sx={{ width: "100%" }}
                    component="a"
                    variant={"soft"}
                    color="neutral"
                    href="https://majrh.fr"
                    target="_blank"
                    startDecorator={<BookTwoTone/>}>
                    {"Entamer ma Mise à Jour RH"}
                  </Button>
                </Grid>
                <Grid xs={6}>
                  <Button sx={{ width: "100%" }}
                    component={ReactRouterLink}
                    variant={"solid"}
                    color="neutral"
                    to={companyActionUrl}
                    startDecorator={<AddRoundedIcon />}>
                    {"poster une offre"}
                  </Button>
                </Grid>
              </Grid>

            </Stack>
          </Container>
        </HeroBanner>

        <PageContent>
          <Grid container spacing={4} alignItems="center">
            <Grid xs={12} md={6} sx={{alignItems: "stretch"}}>
              <Stack gap={4} m={1}>
                <Typography level="h2">{t("homePage.essaiPossibleTerritories")}</Typography>
                <Typography level={"h4"} component={"p"}>
                  {t("homePage.implantationsExplanation")}
                </Typography>
                <ExternalLink
                  level={""}
                  startDecorator={<MailOutlineRoundedIcon />}
                  href={"mailto:contact@essaipossible.fr"}>
                  contact@essaipossible.fr
                </ExternalLink>
              </Stack>
            </Grid>{" "}
            <Grid xs={12} md={6}>
              <Card variant={"soft"} size={"lg"}>
                <Box component={"img"} src={ImplantationsImage} />
              </Card>
            </Grid>
          </Grid>
        </PageContent>
        {/* CALL TO ACTION HIRING MANAGERS */}
        <HeroBanner variant={"soft"} noBackground>
          <Container maxWidth={"lg"}>
            <Stack gap={4}>
              <Typography level="h2" sx={{alignSelf: "center"}}>
                {t("homePage.ourPartners")}
              </Typography>
              <Box component={"img"} src={PartnersImage} />
            </Stack>
          </Container>
        </HeroBanner>
      </Stack>
    </>
  );
}
