import {Breadcrumbs} from "../../components/atoms.jsx";
import {HeroBanner} from "../../components/Layout.jsx";
import Container from "@mui/joy/Container";
import Card from "@mui/joy/Card";
import Grid from "@mui/joy/Grid";
import Stack from "@mui/joy/Stack";
import Typography from "@mui/joy/Typography";
import OfferInfoPills from "./OfferInfoPills.jsx";
import {selectCompanyById} from "./companies-slice.js";
import {useSelector} from "react-redux";

export default function OfferBanner({pageTitle, breadcrumbs, offer, cardContent}) {
  const company = useSelector((state) => selectCompanyById(state, offer.company)) || {};
  return (
    <>
      <Breadcrumbs breadcrumbs={breadcrumbs} />
      <HeroBanner
        invertedColors={false}
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
              <Typography component="h1" level="h2" textColor={"white"}>
                {pageTitle && (
                  <>
                    <Card size={"sm"} sx={{display: "inline", py: 0}}>
                      <Typography level="h2" textColor="primary.solidBg">
                        {pageTitle}
                      </Typography>
                    </Card>{" "}
                  </>
                )}
                {offer.title}
              </Typography>

              <Typography component="h2" level="h4" textColor={"white"}>
                {company.name}
              </Typography>

              <OfferInfoPills offer={offer} company={company} />
            </Stack>
          </Grid>

          {cardContent && (
            <Grid xs={12} md={4}>
              <Card size={"lg"}>{cardContent}</Card>
            </Grid>
          )}
        </Grid>
      </HeroBanner>
    </>
  );
}
