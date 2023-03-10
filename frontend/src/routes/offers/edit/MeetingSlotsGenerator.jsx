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
  const [startDate, setStartDate] = useState(dayjs());
  const [endDate, setEndDate] = useState(dayjs());
  const [startTime, setStartTime] = useState(dayjs());
  const [endTime, setEndTime] = useState(dayjs());
  const [daysOfWeek, setDaysOfWeek] = useState(["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi"]);

  // console.log('MeetingSlotsGenerator',values)

  function handleSetDateTimeFn(isSettingStart, setStart, setEnd, otherDate) {
    const setDateTime = isSettingStart ? setStart : setEnd;
    const setOtherDateTime = isSettingStart ? setEnd : setStart;
    return (date) => {
      console.log("newdate", date.toString(), "otherdate", otherDate.toString());

      setDateTime(date); // Set the date

      // If there is a date overlap, then set the other date to the same
      if (isSettingStart ? date.isAfter(otherDate) : date.isBefore(otherDate))
        setOtherDateTime(date);
    };
  }

  // const slotsForOffer = useSelector((state) =>
  //   offerId ? selectSlotsForOffer(state, offerId) : []
  // );
  const existingOfferSlotsKeys = values?.offer?.slots?.map((slot) => slot.start);

  function generateSlots() {
    let currentDate = startDate.startOf("day");
    const maxDate = endDate.startOf("day");
    const realStartTime = startTime.millisecond(0).second(0).year(2000).month(1).day(1);
    const realEndTime = endTime.millisecond(0).second(0).year(2000).month(1).day(1);

    const slots = [];

    // console.log("STARTING SLOTS GENERATION");

    while (currentDate.isBefore(maxDate) || currentDate.isSame(maxDate)) {
      // console.log(" DAY :", currentDate.format("DD/MM"));

      const dayOfWeek = currentDate.format("dddd").toLowerCase();
      if (daysOfWeek.find((day) => day.toLowerCase() === dayOfWeek)) {
        let currentTime = realStartTime;
        while (currentTime.isBefore(realEndTime) || currentTime.isSame(realEndTime)) {
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
              label={"Espacement par d??faut entre chaque cr??neau"}
              endDecorator={"minutes"}
              slotProps={{input: {min: 1}}}
              type={"number"}
              register={register}
              name={"offer.meetingDuration"}
              help={"G??n??rer un cr??neaux toutes les X minutes..."}
            />
          </Grid>
          <Grid xs={12} md={3}>
            <FormInput
              component={DateInput}
              label="Date de d??but"
              inputFormat={"ddd D MMM YYYY"}
              disableMaskedInput
              value={startDate}
              onChange={handleSetDateTimeFn(true, setStartDate, setEndDate, endDate)}
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
              onChange={handleSetDateTimeFn(false, setStartDate, setEndDate, startDate)}
              help={"...jusqu'?? cette date incluse..."}
            />
          </Grid>
          <Grid xs={12} md={3}>
            <FormInput
              component={DateInput}
              datePickerComponent={TimePicker}
              label="Heure de d??but"
              value={startTime}
              onChange={handleSetDateTimeFn(true, setStartTime, setEndTime, endTime)}
              help={"...et de cette heure l??..."}
            />
          </Grid>
          <Grid xs={12} md={3}>
            <FormInput
              component={DateInput}
              datePickerComponent={TimePicker}
              label="Heure de fin"
              value={endTime}
              onChange={handleSetDateTimeFn(false, setStartTime, setEndTime, startTime)}
              help={"...jusqu'?? cette heure l?? incluse."}
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
              help={"Ne g??n??rer des cr??neaux que sur les jours de la semaine s??lectionn??s."}
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
                    startTime: tTime(startTime),
                    endTime: tTime(endTime),
                  }}
                />
              </Typography>
            </HelpBox>
          </Grid>

          <Grid xs={12}>
            <Button sx={{width: "100%"}} variant={"soft"} color={"success"} onClick={generateSlots}>
              G??n??rer des cr??neaux
            </Button>
          </Grid>
        </Grid>
      </Card>

      <Box>
        <FormLabel>Cr??neaux :</FormLabel>
        <FormHelperText sx={{mb: 1, display: "inline"}}>
          Les cr??neaux nouvellement cr????s sont
          <Box
            component={"span"}
            sx={{
              border: "2px solid lightgreen",
              bgcolor: "neutral.softBg",
              ml: 0.5,
              px: 0.5,
              borderRadius: 30,
            }}>
            entour??s de vert
          </Box>
          . Vous pouvez supprimer un cr??neau en cliquant sur ce dernier.
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
              Pas de cr??neaux pour l'instant. Vous pouvez en cr??er avec le g??n??rateur ci-dessus.
            </Typography>
          )}
          {(values.slots?.length > 0 || values?.offer?.slots?.length > 0) && (
            <Button
              sx={{mt: 2}}
              variant={"soft"}
              color={"danger"}
              size={"sm"}
              onClick={() => setFieldValue("slots", values?.offer?.slots)}>
              R??initialiser les cr??neaux
            </Button>
          )}
        </Card>
      </Box>
    </Stack>
  );
}
