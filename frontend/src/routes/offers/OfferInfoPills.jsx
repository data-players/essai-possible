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

import {
  selectAllGoals,
  selectGoalsReady,
  selectGoalsStatus,
  useFetchGoalsQuery,
  selectAllSectors,
  selectSectorsReady,
  selectSectorsStatus,
  useFetchSectorsQuery,
} from "../../app/concepts-slice.js";
import { useEffect } from "react";

export default function OfferInfoPills({offer, company}) {
  const {t, tDate} = useTranslationWithDates();
  const slotsForOffer = useSelector((state) => selectSlotsForOffer(state, offer.id));
  const nextAvailableSlotDate =
    slotsForOffer.length > 0 &&
    [...slotsForOffer].sort((a, b) => sorter.date(a.start, b.start))[0].start;
  
  // useFetchSectorsQuery();
  const sectorsReady = useSelector(selectSectorsReady);
  const sectorsStatus =useSelector(selectSectorsStatus);
  const sectors = useSelector(selectAllSectors);
  const sectorCompanyLabels = company.sectors.map(cs=>sectors.find(s=>s.id==cs)?.label);
  // if(sectorsStatus==undefined){
  //   useFetchSectorsQuery();
  // }


  // useFetchGoalsQuery();
  const goalsReady = useSelector(selectGoalsReady);
  const goalsStatus =useSelector(selectGoalsStatus);
  const goals = useSelector(selectAllGoals);
  const goalLabel = goals.find(g=>g.id==offer.goal)?.label;
  // if(goalsStatus==undefined){
  //   useFetchGoalsQuery();
  // }



  // console.log('sectorCompanyLabels',sectorCompanyLabels);
  return (
    <Grid container columnSpacing={4} rowSpacing={3} p={0}>
      <Grid xs={12} sm={6} md={4}>
        <Chip color={"primary"} startDecorator={<LocalOfferRoundedIcon />}>
          {t("offers.sector", {count: company.sectors?.length})}
        </Chip>
        <BasicList elements={sectorCompanyLabels} />
      </Grid>

      <Grid xs={12} sm={6} md={4}>
        <Chip color={"primary"} startDecorator={<FlagRoundedIcon />}>
          {t("offers.goal")}
        </Chip>
        <Box sx={{mt: 1, ml: 2}}>{goalLabel}</Box>
      </Grid>
      {slotsForOffer.length > 0 && (
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
