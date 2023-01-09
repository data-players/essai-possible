import {Card, Grid, Stack, Typography} from "@mui/joy";
import {loremIpsum} from "lorem-ipsum";
import Button from "@mui/joy/Button";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import {HeroBanner, PageContent} from "../components/Layout.jsx";
import {Link as ReactRouterLink} from "react-router-dom";
import {useTranslation} from "react-i18next";

export default function HomePage() {
  const {t} = useTranslation();
  return (
    <>
      {/* HERO HEADER */}
      <HeroBanner>
        <Grid container spacing={8} position={"relative"} p={2} alignItems="center">
          <Grid xs={12} md={8}>
            <Stack alignItems={"center"}>
              <Typography level="h2">{loremIpsum({count: 2})}</Typography>
            </Stack>
          </Grid>
          <Grid xs={12} md={4}>
            <Card invertedColors color={"primary"} variant={"solid"} size={"lg"}>
              <Stack gap={3}>
                <Typography level="h3">Les offres vous attendent ! N'hésitez plus.</Typography>
                <Button
                  component={ReactRouterLink}
                  to={"offers"}
                  startDecorator={<SearchRoundedIcon />}>
                  {t("offer.seeOffers")}
                </Button>
              </Stack>
            </Card>
          </Grid>
        </Grid>
      </HeroBanner>

      <PageContent>
        <Typography>Blablabla</Typography>
        <Typography>Blablabla</Typography>
        <Typography>Blablabla</Typography>
        <Typography>Blablabla</Typography>
        <Typography>Blablabla</Typography>
        <Typography>Blablabla</Typography>
      </PageContent>
    </>
  );
}
