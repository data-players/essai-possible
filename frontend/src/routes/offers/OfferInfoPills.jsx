import Grid from "@mui/joy/Grid";
import Chip from "@mui/joy/Chip";
import LocalOfferRoundedIcon from "@mui/icons-material/LocalOfferRounded.js";
import {BasicList} from "../../components/atoms.jsx";
import FlagRoundedIcon from "@mui/icons-material/FlagRounded.js";
import Box from "@mui/joy/Box";
import CalendarMonthRoundedIcon from "@mui/icons-material/CalendarMonthRounded.js";
import {useTranslationWithDates} from "../../app/i18n.js";

export default function OfferInfoPills({offer, company}) {
  const {t, tDate} = useTranslationWithDates();
  return (
    <Grid container columnSpacing={4} rowSpacing={3} p={0}>
      <Grid xs={12} sm={6} md={4}>
        <Chip color={"primary"} startDecorator={<LocalOfferRoundedIcon />}>
          {t("offer.sector", {count: company.sectors?.length})}
        </Chip>
        <BasicList elements={company.sectors} />
      </Grid>
      <Grid xs={12} sm={6} md={4}>
        <Chip color={"primary"} startDecorator={<FlagRoundedIcon />}>
          {t("offer.goal")}
        </Chip>
        <Box sx={{mt: 1, ml: 2}}>{offer.goal}</Box>
      </Grid>
      <Grid xs={12} sm={12} md={4}>
        <Chip color={"primary"} startDecorator={<CalendarMonthRoundedIcon />}>
          {t("offer.startDate")}
        </Chip>
        <Box sx={{mt: 1, ml: 2}}>{tDate(company.startDate)}</Box>
      </Grid>
    </Grid>
  );
}
