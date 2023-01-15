import {Breadcrumbs} from "../../components/atoms.jsx";
import {HeroBanner} from "../../components/Layout.jsx";
import Container from "@mui/joy/Container";
import Card from "@mui/joy/Card";
import Grid from "@mui/joy/Grid";
import Stack from "@mui/joy/Stack";
import Typography from "@mui/joy/Typography";
import {OfferInfoPills} from "./OfferInfoPills.jsx";

export function OfferBanner({
  pageTitle,
  breadcrumbs,
  offer: {title, company, goal, startDate},
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
        sx={{overflow: "hidden", boxShadow: "lg", mx: -5, py: 6}}>
        <Grid container spacing={8} position={"relative"}>
          <Grid xs={12} md={8}>
            <Stack gap={4}>
              <Typography component="h1" level="h2">
                {pageTitle && (
                  <>
                    <Card variant={"solid"} size={"sm"} sx={{display: "inline", py: 0}}>
                      <Typography level="h2" textColor="primary.solidBg">
                        {pageTitle}
                      </Typography>
                    </Card>{" "}
                  </>
                )}
                {title}
              </Typography>

              <Typography component="h2" level="h4">
                {company.name}
              </Typography>

              <OfferInfoPills sectors={company.sectors} goal={goal} startDate={startDate} />
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
