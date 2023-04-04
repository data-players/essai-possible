import {FormInput} from "../../../components/forms.jsx";
import React, {useState} from "react";
import {CheckboxGroup, DateInput, HelpBox, SlotsList} from "../../../components/atoms.jsx";
import dayjs from "dayjs";
import Grid from "@mui/joy/Grid";
import {TimePicker} from "@mui/x-date-pickers";
import Button from "@mui/joy/Button";
import {useTranslationWithDates} from "../../../app/i18n.js";
import {Trans} from "react-i18next";
import Typography from "@mui/joy/Typography";
import {useSelector} from "react-redux";
import {selectSlotsForOffer} from "../book/slots-slice.js";
import FormLabel from "@mui/joy/FormLabel";
import FormHelperText from "@mui/joy/FormHelperText";
import Box from "@mui/joy/Box";
import Stack from "@mui/joy/Stack";
import Card from "@mui/joy/Card";

export default function MeetingSlotsGenerator({register, values, setFieldValue, offerId}) {
  const {tDate, tTime} = useTranslationWithDates();
  const [startDate, setStartDate] = useState(dayjs().hour(9).minute(0));
  const [endDate, setEndDate] = useState(dayjs().hour(9).minute(0));
  // const [startTime, setStartTime] = useState(dayjs());
  // const [endTime, setEndTime] = useState(dayjs());
  const [daysOfWeek, setDaysOfWeek] = useState(["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi"]);

  // console.log('MeetingSlotsGenerator',values)

  function setStartDateTime(date) {
    setStartDate(date);
    if(endDate.isBefore(date)){
      setEndDate(date);
    }
  }
  function setEndDateTime(date) {
    setEndDate(date);
    if(startDate.isAfter(date)){
      setStartDate(date);
    }
  }


  // function handleSetDateTimeFn(isSettingStart, setStart, setEnd, otherDate) {
  //   const setDateTime = isSettingStart ? setStart : setEnd;
  //   const setOtherDateTime = isSettingStart ? setEnd : setStart;
  //   return (date) => {
  //     console.log("newdate", date.toString(), "otherdate", otherDate.toString());

  //     setDateTime(date); // Set the date

  //     // If there is a date overlap, then set the other date to the same
  //     if (isSettingStart ? date.isAfter(otherDate) : date.isBefore(otherDate))
  //       setOtherDateTime(date);
  //   };
  // }

  // const slotsForOffer = useSelector((state) =>
  //   offerId ? selectSlotsForOffer(state, offerId) : []
  // );
  const existingOfferSlotsKeys = values?.offer?.slots?.map((slot) => slot.start);

  function generateSlots() {
    // let currentDate = startDate.startOf("day");
    let currentDate = startDate.clone();
    // const maxDate = endDate.startOf("day");
    // const realStartTime = startTime.millisecond(0).second(0).year(2000).month(1).day(1);
    // const realEndTime = endTime.millisecond(0).second(0).year(2000).month(1).day(1);

    const slots = [];

    // console.log("STARTING SLOTS GENERATION");

    while (currentDate.isBefore(endDate) || currentDate.isSame(endDate) ) {
      // console.log(" DAY :", currentDate.format("DD/MM"));

      const dayOfWeek = currentDate.format("dddd").toLowerCase();
      if (daysOfWeek.find((day) => day.toLowerCase() === dayOfWeek)) {
        // let currentTime = realStartTime;
        let currentTime =currentDate.clone();
        const endTime = currentDate.minute(endDate.minute()).hour(endDate.hour())
        while (currentTime.isBefore(endTime)) {
          // console.log("  TIME :", currentTime.format("HH:mm"));

          const slotStart = currentDate.minute(currentTime.minute()).hour(currentTime.hour());
          slots.push({start: slotStart.toISOString()});
          // console.log("   >>>", slotStart.toString());

          currentTime = currentTime.add(values.offer.meetingDuration, "minutes");
        }
      } else {
        console.log(`  ${dayOfWeek} not included. Skipping.`);
      }

      currentDate = currentDate.add(1, "day");
    }

    const existingSlotsKeys = values.slots?.map((slot) => slot.start)||[];
    const dedoubledNewSlots = slots.filter((slot) => !existingSlotsKeys.includes(slot.start));
    // console.log([...(values.slots||[]), ...dedoubledNewSlots]);
    setFieldValue("slots", [...(values.slots||[]), ...dedoubledNewSlots]);
  }

  return (
    <Stack gap={3}>
      <Card variant={"outlined"} size={"lg"}>
        <Grid container spacing={3}>
          <Grid xs={12}>
            <FormInput
              sx={{width: "fit-content"}}
              label={"Espacement par défaut entre chaque créneau"}
              endDecorator={"minutes"}
              slotProps={{input: {min: 1}}}
              type={"number"}
              register={register}
              name={"offer.meetingDuration"}
              help={"Générer un créneaux toutes les X minutes..."}
            />
          </Grid>
          <Grid xs={12} md={3}>
            <FormInput
              component={DateInput}
              label="Date de début"
              inputFormat={"ddd D MMM YYYY"}
              disableMaskedInput
              value={startDate}
              onChange={setStartDateTime}
              help={"De cette date (comprise)..."}
            />
          </Grid>
          <Grid xs={12} md={3}>
            <FormInput
              component={DateInput}
              label="Date de fin"
              inputFormat={"ddd D MMM YYYY"}
              disableMaskedInput
              value={endDate}
              onChange={setEndDateTime}
              help={"...jusqu'à cette date incluse..."}
            />
          </Grid>
          <Grid xs={12} md={3}>
            <FormInput
              component={DateInput}
              datePickerComponent={TimePicker}
              label="Heure de début"
              value={startDate}
              onChange={setStartDateTime}
              help={"...et de cette heure là..."}
            />
          </Grid>
          <Grid xs={12} md={3}>
            <FormInput
              component={DateInput}
              datePickerComponent={TimePicker}
              label="Heure de fin"
              value={endDate}
              onChange={setEndDateTime}
              help={"...jusqu'à cette heure là incluse."}
            />
          </Grid>

          <Grid xs={12}>
            <FormInput
              component={CheckboxGroup}
              wrapperComponent={Box}
              sx={{
                flexDirection: {xs: "column", md: "row"},
                flexWrap: "wrap",
                columnGap: 3,
                justifyContent: "space-between",
              }}
              label="Jours de la semaine"
              value={daysOfWeek}
              onChange={setDaysOfWeek}
              options={["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"]}
              help={"Ne générer des créneaux que sur les jours de la semaine sélectionnés."}
            />
          </Grid>

          <Grid xs={12}>
            <HelpBox>
              <Typography>
                <Trans
                  i18nKey="offer.generatorSummary"
                  values={{
                    context: tDate(startDate) === tDate(endDate) ? "sameDate" : undefined,
                    meetingDuration: values.offer.meetingDuration,
                    startDate: tDate(startDate, "long"),
                    endDate: tDate(endDate, "long"),
                    daysOfWeek,
                    startTime: tTime(startDate),
                    endTime: tTime(endDate),
                  }}
                />
              </Typography>
            </HelpBox>
          </Grid>

          <Grid xs={12}>
            <Button sx={{width: "100%"}} variant={"soft"} color={"success"} onClick={generateSlots}>
              Générer des créneaux
            </Button>
          </Grid>
        </Grid>
      </Card>

      <Box>
        <FormLabel>Créneaux :</FormLabel>
        <FormHelperText sx={{mb: 1, display: "inline"}}>
          Les créneaux nouvellement créés sont
          <Box
            component={"span"}
            sx={{
              border: "2px solid lightgreen",
              bgcolor: "neutral.softBg",
              ml: 0.5,
              px: 0.5,
              borderRadius: 30,
            }}>
            entourés de vert
          </Box>
          . Vous pouvez supprimer un créneau en cliquant sur ce dernier.
        </FormHelperText>
        <Card invertedColors variant={"soft"} sx={{boxShadow: "none"}}>
          {values.slots?.length > 0 ? (
            <SlotsList
              slots={values.slots}
              itemKey={"start"}
              itemSx={({key}) => {
                // console.log("generateSlots SlotsList existingOfferSlotsKeys",existingOfferSlotsKeys)
                if (!existingOfferSlotsKeys?.includes(key)) return {outline: "2px solid lightgreen"};
                // // TODO fetch all meetings for the offer (not only for the current user) and match them
                // if (meetingForOffer.start === key) return {outline: "3px solid red"};
              }}
              deletable
              onChange={(key) =>{
                console.log('onChange',key,values.slots)
                  setFieldValue(
                    "slots",
                    values.slots.filter((slot) => slot.start !== key)
                  )
                }
              }
            />
          ) : (
            <Typography>
              Pas de créneaux pour l'instant. Vous pouvez en créer avec le générateur ci-dessus.
            </Typography>
          )}
          {(values.slots?.length > 0 || values?.offer?.slots?.length > 0) && (
            <Button
              sx={{mt: 2}}
              variant={"soft"}
              color={"danger"}
              size={"sm"}
              onClick={() => setFieldValue("slots", values?.offer?.slots)}>
              Réinitialiser les créneaux
            </Button>
          )}
        </Card>
      </Box>
    </Stack>
  );
}
