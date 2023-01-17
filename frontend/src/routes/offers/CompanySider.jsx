import Card from "@mui/joy/Card";
import Stack from "@mui/joy/Stack";
import Typography from "@mui/joy/Typography";
import Link from "@mui/joy/Link";
import {useSelector} from "react-redux";
import {selectCompanyById} from "./companies-slice.js";

const cleanUrl = (url) => url?.replace(/https?:\/\/(www.)?/, "").replace(/\/$/, "");

export default function CompanySider({offer}) {
  const company = useSelector((state) => selectCompanyById(state, offer.company)) || {};
  return (
    <Card variant={"soft"}>
      <Stack gap={2}>
        <Typography level="body" sx={{color: "text.tertiary"}}>
          À propos de l'entreprise :
        </Typography>
        <Typography level="h3">{company.name}</Typography>
        <Typography>{company.description}</Typography>
        <Link to={company.website}>{cleanUrl(company.website)}</Link>
      </Stack>
    </Card>
  );
}
