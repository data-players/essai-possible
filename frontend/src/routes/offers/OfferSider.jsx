import Stack from "@mui/joy/Stack";
import React from "react";
import {useSelector} from "react-redux";
import {selectCompanyById} from "./companies-slice.js";
import Card from "@mui/joy/Card";
import Typography from "@mui/joy/Typography";
import Chip from "@mui/joy/Chip";
import PlaceRoundedIcon from "@mui/icons-material/PlaceRounded.js";
import Link from "@mui/joy/Link";
import {cleanUrl} from "../../app/utils.js";
import FormControl from "@mui/joy/FormControl";
import FormLabel from "@mui/joy/FormLabel";

function CompanyCard({offer}) {
  const company = useSelector((state) => selectCompanyById(state, offer.company)) || {};
  return (
    <Card variant={"soft"}>
      <Stack gap={2}>
        <Typography level="body" sx={{color: "text.tertiary"}}>
          À propos de l'entreprise :
        </Typography>
        <Typography level="h3">{company.name}</Typography>
        <Typography>{company.description}</Typography>
        <Link href={company.website}>{cleanUrl(company.website)}</Link>
      </Stack>
    </Card>
  );
}

function ModalitiesCard({offer}) {
  return (
    <Card variant={"soft"}>
      <Stack gap={2}>
        <Typography level="body" sx={{color: "text.tertiary"}}>
          Modalités de l'offre :
        </Typography>

        <FormControl>
          <FormLabel>Durée</FormLabel>
          <Typography>{offer.duration} jours ouvrés</Typography>
        </FormControl>

        <FormControl>
          <FormLabel>Horaires</FormLabel>
          <Typography>{offer.timeSchedule} jours ouvrés</Typography>
        </FormControl>

        <Chip
          color={"neutral.tertiary"}
          variant={"plain"}
          startDecorator={<PlaceRoundedIcon />}
          sx={{p: 0, opacity: 0.6}}>
          {offer.location.city}
        </Chip>
      </Stack>
    </Card>
  );
}

export default function OfferSider({offer, display}) {
  return (
    <Stack my={2} gap={3} display={display}>
      <CompanyCard offer={offer} />
      <ModalitiesCard offer={offer} />
    </Stack>
  );
}
