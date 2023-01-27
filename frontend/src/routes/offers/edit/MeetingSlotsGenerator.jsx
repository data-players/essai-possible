import {FormInput} from "../../../components/forms.jsx";
import React, {useState} from "react";
import {DateInput} from "../../../components/atoms.jsx";
import dayjs from "dayjs";
import Grid from "@mui/joy/Grid";
import {TimePicker} from "@mui/x-date-pickers";

export default function MeetingSlotsGenerator({register, setFieldValue}) {
  const [startDate, setStartDate] = useState(dayjs());
  const [endDate, setEndDate] = useState(dayjs());
  const [startTime, setStartTime] = useState(dayjs());
  const [endTime, setEndTime] = useState(dayjs());
  return (
    <Grid container spacing={3}>
      <Grid xs={12} md={3}>
        <FormInput
          component={DateInput}
          label="Date de début"
          inputFormat={"DD MMMM YYYY"}
          value={startDate}
          onChange={setStartDate}
        />
      </Grid>
      <Grid xs={12} md={3}>
        <FormInput
          component={DateInput}
          label="Date de fin"
          value={endDate}
          onChange={setEndDate}
        />
      </Grid>
      <Grid xs={12} md={3}>
        <FormInput
          component={DateInput}
          label="Date de fin"
          inputFormat={"DD MMMM YYYY"}
          value={endTime}
          onChange={setEndTime}
        />
      </Grid>
      <Grid xs={12} md={3}>
        <FormInput
          component={DateInput}
          datePickerComponent={TimePicker}
          value={startTime}
          onChange={setStartTime}
          label="Date de début"
          placeholder="date de début"
        />
      </Grid>
    </Grid>
  );
}
