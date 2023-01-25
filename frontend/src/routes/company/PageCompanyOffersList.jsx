import * as React from "react";
import {useSelector} from "react-redux";
import {HeroBanner} from "../../components/Layout.jsx";
import Typography from "@mui/joy/Typography";
import {useTranslation} from "react-i18next";
import Grid from "@mui/joy/Grid";
import Container from "@mui/joy/Container";
import {selectOfferIdsForCompany, selectOffersReady} from "../offers/offers-slice.js";
import {OfferListItemForCompany} from "../offers/OfferListItem.jsx";
import Stack from "@mui/joy/Stack";
import Button from "@mui/joy/Button";
import {ListPageContent, LoadingSpinner} from "../../components/atoms.jsx";
import {Link as ReactRouterLink, useParams} from "react-router-dom";
import {selectCompanyById, useFetchCompanyQuery} from "../offers/companies-slice.js";
import Card from "@mui/joy/Card";
import AddRoundedIcon from "@mui/icons-material/AddRounded.js";

export default function PageCompanyOffersList() {
  const {t} = useTranslation();
  const {companyId} = useParams();
  useFetchCompanyQuery(companyId);
  const offersForCompany = useSelector((state) => selectOfferIdsForCompany(state, companyId));
  const company = useSelector((state) => selectCompanyById(state, companyId));
  const offersReady = useSelector(selectOffersReady);

  if (!company?.id) return <LoadingSpinner />;

  return (
    <>
      <HeroBanner invertedColors={false}>
        <Container mx={2}>
          <Grid container spacing={2}>
            <Grid xs={12} display={"flex"} justifyContent={"center"}>
              <Typography level="h1" color={"white"}>
                Mon entreprise "{company.name}"
              </Typography>
            </Grid>
            <Grid xs={12} display={"flex"} justifyContent={"center"} mt={3}>
              <Card size={"lg"} sx={{maxWidth: 600}}>
                <Stack gap={3}>
                  <Typography>
                    Bienvenue sur la page de votre entreprise. Consultez vos offres en cours.
                  </Typography>
                  <Stack direction={"row"} gap={3} justifyContent={"center"}>
                    <Button
                      component={ReactRouterLink}
                      to={"/offers/new?company=" + companyId}
                      size={"lg"}
                      startDecorator={<AddRoundedIcon />}>
                      {t("offers.proposeAnOffer")}
                    </Button>
                    <Button size={"lg"} variant={"soft"}>
                      Editer mon entreprise
                    </Button>
                  </Stack>
                </Stack>
              </Card>
            </Grid>
          </Grid>
        </Container>
      </HeroBanner>

      <ListPageContent
        ready={offersReady && company}
        noResultsText={"Vous n'avez pas encore créé d'offres pour votre entreprise."}
        values={offersForCompany}
        item={OfferListItemForCompany}
      />
    </>
  );
}
