import Button from "@mui/joy/Button";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import CreateRoundedIcon from "@mui/icons-material/CreateRounded";
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

export default function HomePage() {
  const {t} = useTranslation();
  return (
    <>
      {/* HERO HEADER */}
      <HeroBanner>
        <Grid container spacing={8} position={"relative"} p={2} alignItems="center">
          <Grid>
            <Stack gap={4}>
              <Card variant={"solid"} size={"lg"} sx={{width: "fit-content"}}>
                <Typography level="h1" textColor="primary.solidBg">
                  {t("essaiPossible")}
                </Typography>
              </Card>
              <Typography level="h2">{t("homePage.heroSubtitle")}</Typography>
            </Stack>
          </Grid>
          <Grid xs={12} md={7}>
            <Stack gap={4}>
              <Typography level="h4">
                <Trans i18nKey="homePage.heroExplanationCandidates" />
              </Typography>
              <Typography level="h4">
                <Trans i18nKey="homePage.heroExplanationHiringManagers" />
              </Typography>
            </Stack>
          </Grid>
          <Grid xs={12} md={5}>
            <Card invertedColors color={"primary"} variant={"solid"} size={"lg"}>
              <Stack gap={4} m={1}>
                <Button
                  component={ReactRouterLink}
                  to={"offers"}
                  size={"lg"}
                  startDecorator={<SearchRoundedIcon />}>
                  {t("offer.seeOffers")}
                </Button>
                <Button
                  component={ReactRouterLink}
                  variant={"soft"}
                  to={"offers"}
                  size={"lg"}
                  startDecorator={<AddRoundedIcon />}>
                  {t("offer.proposeAnOffer")}
                </Button>
              </Stack>
            </Card>
          </Grid>
        </Grid>
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
              <Button
                component={ReactRouterLink}
                variant={"solid"}
                color="neutral"
                to={"offers"}
                size={"lg"}
                startDecorator={<CreateRoundedIcon />}>
                {t("homePage.register")}
              </Button>
            </Stack>
          </Container>
        </HeroBanner>

        <PageContent>
          <Grid container spacing={4} alignItems="center">
            <Grid xs={12} md={6} sx={{alignItems: "stretch"}}>
              <Stack gap={4} m={1}>
                <Typography level="h2">{t("homePage.ourImplantations")}</Typography>
                <Typography level={"h4"} component={"p"}>
                  {t("homePage.implantationsExplanation")}
                </Typography>
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
