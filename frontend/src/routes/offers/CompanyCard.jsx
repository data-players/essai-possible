import Card from "@mui/joy/Card";
import Stack from "@mui/joy/Stack";
import Typography from "@mui/joy/Typography";
import Link from "@mui/joy/Link";
import {useSelector} from "react-redux";
import {selectCompanyById} from "./companies-slice.js";
import PlaceRoundedIcon from "@mui/icons-material/PlaceRounded.js";
import Chip from "@mui/joy/Chip";
import React from "react";

const cleanUrl = (url) => url?.replace(/https?:\/\/(www.)?/, "").replace(/\/$/, "");

export default function CompanyCard({offer}) {
  const company = useSelector((state) => selectCompanyById(state, offer.company)) || {};
  return (
    <Card variant={"soft"}>
      <Stack gap={2}>
        <Typography level="body" sx={{color: "text.tertiary"}}>
          À propos de l'entreprise :
        </Typography>
        <Typography level="h3">{company.name}</Typography>
        <Typography>{company.description}</Typography>
        <Chip
          color={"neutral.tertiary"}
          variant={"plain"}
          startDecorator={<PlaceRoundedIcon />}
          sx={{p: 0, opacity: 0.6}}>
          {offer.location.city}
        </Chip>
        <Link href={company.website}>{cleanUrl(company.website)}</Link>
      </Stack>
    </Card>
  );
}
