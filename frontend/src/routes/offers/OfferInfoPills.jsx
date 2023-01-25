import Grid from "@mui/joy/Grid";
import Chip from "@mui/joy/Chip";
import LocalOfferRoundedIcon from "@mui/icons-material/LocalOfferRounded.js";
import {BasicList} from "../../components/atoms.jsx";
import FlagRoundedIcon from "@mui/icons-material/FlagRounded.js";
import Box from "@mui/joy/Box";
import CalendarMonthRoundedIcon from "@mui/icons-material/CalendarMonthRounded.js";
import {useTranslationWithDates} from "../../app/i18n.js";
import {sorter} from "../../app/utils.js";
import {useSelector} from "react-redux";
import {selectSlotsForOffer} from "./book/slots-slice.js";

export default function OfferInfoPills({offer, company, companyMode = false}) {
  const {t, tDate} = useTranslationWithDates();
  const slotsForOffer = useSelector((state) => selectSlotsForOffer(state, offer.id));
  const nextAvailableSlotDate =
    slotsForOffer.length > 0 &&
    [...slotsForOffer].sort((a, b) => sorter.date(a.start, b.start))[0].start;
  return (
    <Grid container columnSpacing={4} rowSpacing={3} p={0}>
      {!companyMode && (
        <Grid xs={12} sm={6} md={4}>
          <Chip color={"primary"} startDecorator={<LocalOfferRoundedIcon />}>
            {t("offers.sector", {count: company.sectors?.length})}
          </Chip>
          <BasicList elements={company.sectors} />
        </Grid>
      )}

      <Grid xs={12} sm={6} md={4}>
        <Chip color={"primary"} startDecorator={<FlagRoundedIcon />}>
          {t("offers.goal")}
        </Chip>
        <Box sx={{mt: 1, ml: 2}}>{offer.goal}</Box>
      </Grid>
      {!companyMode && slotsForOffer.length > 0 && (
        <Grid xs={12} sm={12} md={4}>
          <Chip color={"primary"} startDecorator={<CalendarMonthRoundedIcon />}>
            {t("offers.startDate")}
          </Chip>
          <Box sx={{mt: 1, ml: 2}}>Dès le {tDate(nextAvailableSlotDate)}</Box>
        </Grid>
      )}
    </Grid>
  );
}
