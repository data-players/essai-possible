import {usePrefetch} from "../../app/api.js";
import {useSelector} from "react-redux";
import {
  useFetchStatusQuery,
  selectAllStatus,
  selectStatusStatus
} from "../../app/concepts-slice.js";
import {
  selectOfferById,
} from "./offers-slice.js";
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
import {useTranslationWithDates} from "../../app/i18n.js";
import {statusOptions} from "./offers-slice-data.js";
import CheckIcon from "@mui/icons-material/Check.js";
import VisibilityRoundedIcon from "@mui/icons-material/VisibilityRounded";
import VisibilityOffRoundedIcon from "@mui/icons-material/VisibilityOffRounded";
import {StatusChip} from "../../components/atoms.jsx";

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

function OfferListItemRoot({offer, children}) {
  const navigate = useNavigate();

  const launchOfferPrefetch = usePrefetch("fetchOffer");
  const launchCompanyPrefetch = usePrefetch("fetchCompany");
  const launchSlotsPrefetch = usePrefetch("fetchSlots");

  return (
    <ListItem
      onMouseEnter={(e) => {
        console.log("onMouseEnter", e);
        // launchOfferPrefetch(offer.id);
        // launchSlotsPrefetch({offer: offer.id});
        // launchCompanyPrefetch(offer.company);
      }}>
      <Card
        onClick={() => navigate(`/offers/${encodeURIComponent(offer.id)}`)}
        variant={"soft"}
        size={"lg"}
        sx={{
          cursor: "pointer",
          width: "100%",
          my: 1,
          ":hover": {boxShadow: "lg"},
        }}>
        {children}
      </Card>
    </ListItem>
  );
}

/**
 * The list item in the list of offers, show to users
 */
export default function OfferListItem({
  value: offerId,
  sideElement: SideElement = OfferDescriptionSideElement,
}) {
  const {t, tDate} = useTranslationWithDates();

  const offer = useSelector((state) => selectOfferById(state, offerId));
  const company = useSelector((state) => selectCompanyById(state, offer.company)) || {};

  return (
    <OfferListItemRoot offer={offer}>
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
            <Typography
              textColor={"text.tertiary"}
              fontSize={"sm"}
              sx={{opacity: 0.6}}
              fontStyle={"italic"}>
              Publiée le {tDate(offer.publishedAt)}
            </Typography>
          </Stack>
        </Grid>

        <Grid xs={12} md={4}>
          <Card sx={{height: "100%"}}>
            <SideElement offer={offer} />
          </Card>
        </Grid>
      </Grid>
    </OfferListItemRoot>
  );
}

/**
 * The list item in the list of COMPANY offers, shown to company members only for admin tasks
 */
export function OfferListItemForCompany({value: offerId}) {
  const {t, tDate} = useTranslationWithDates();

  const offer = useSelector((state) => selectOfferById(state, offerId));
  const statusState = useSelector(selectStatusStatus);
  // if(statusState==undefined){
  //   useFetchStatusQuery();
  // }

  const status = useSelector(selectAllStatus);

  return (
    <OfferListItemRoot offer={offer}>
      <Stack gap={2}>
        <Typography level="h4" component="h2" fontWeight={"lg"}>
          {offer.title}
        </Typography>

        <Grid container spacing={3}>
          <Grid md={6} xs={12}>
            <Typography textColor={"text.tertiary"}>
              {t("offers.xMeetingSlotsAvailable", {count: offer.slots?.length || 0})}
            </Typography>
          </Grid>
          <Grid md={6} xs={12}>
            <StatusChip
              status={offer.status}
              options={status}
            />
          </Grid>
        </Grid>

        <Typography
          textColor={"text.tertiary"}
          fontSize={"sm"}
          sx={{opacity: 0.6}}
          fontStyle={"italic"}>
          Publiée le {tDate(offer.publishedAt)}
        </Typography>
      </Stack>
    </OfferListItemRoot>
  );
}
