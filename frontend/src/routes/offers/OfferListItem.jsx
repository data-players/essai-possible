import {useTranslation} from "react-i18next";
import {usePrefetch} from "../../app/api.js";
import {useSelector} from "react-redux";
import {selectOfferById} from "./offers-slice.js";
import {selectCompanyById} from "./companies-slice.js";
import ListItem from "@mui/joy/ListItem";
import Card from "@mui/joy/Card";
import {useNavigate} from "react-router-dom";
import Grid from "@mui/joy/Grid";
import Stack from "@mui/joy/Stack";
import Typography from "@mui/joy/Typography";
import OfferInfoPills from "./OfferInfoPills.jsx";
import Chip from "@mui/joy/Chip";
import PlaceRoundedIcon from "@mui/icons-material/PlaceRounded.js";
import React from "react";

function OfferDescriptionSideElement({offer}) {
  return (
    <Typography
      sx={{
        whiteSpace: "normal",
        overflow: "hidden",
        display: "-webkit-box",
        WebkitLineClamp: {xs: 4, md: 8},
        WebkitBoxOrient: "vertical",
      }}>
      {offer.description}
    </Typography>
  );
}

export default function OfferListItem({
  offerId,
  sideElement: SideElement = OfferDescriptionSideElement,
  sx,
}) {
  const navigate = useNavigate();
  const {t} = useTranslation();

  const launchOfferPrefetch = usePrefetch("fetchOffer");
  const launchCompanyPrefetch = usePrefetch("fetchCompany");

  const offer = useSelector((state) => selectOfferById(state, offerId));
  const company = useSelector((state) => selectCompanyById(state, offer.company)) || {};

  return (
    <ListItem
      onMouseEnter={() => {
        launchOfferPrefetch(offer.id);
        launchCompanyPrefetch(offer.company);
      }}>
      <Card
        onClick={() => navigate(`/offers/${offerId}`)}
        variant={"soft"}
        size={"lg"}
        sx={{
          cursor: "pointer",
          width: "100%",
          my: 1,
          ":hover": {boxShadow: "lg"},
          ...sx,
        }}>
        <Grid container columnSpacing={4} rowSpacing={2}>
          <Grid xs={12} md={8}>
            <Stack gap={2}>
              <Typography level="h3" component="h2" fontWeight={"lg"}>
                {offer.title}
              </Typography>

              <Typography level="h4">{company.name}</Typography>

              <OfferInfoPills company={company} offer={offer} />

              <Stack
                gap={2}
                direction={"row"}
                flexWrap={"wrap"}
                alignItems={"center"}
                justifyContent={"space-between"}>
                <Typography textColor={"text.tertiary"}>
                  {t("offers.xMeetingSlotsAvailable", {count: offer.slots?.length || 0})}
                </Typography>

                <Chip
                  color={"neutral.tertiary"}
                  variant={"plain"}
                  startDecorator={<PlaceRoundedIcon />}
                  sx={{p: 0, opacity: 0.6}}>
                  {offer.location.city}
                </Chip>
              </Stack>
            </Stack>
          </Grid>

          <Grid xs={12} md={4}>
            <Card sx={{height: "100%"}}>
              <SideElement offer={offer} />
            </Card>
          </Grid>
        </Grid>
      </Card>
    </ListItem>
  );
}
