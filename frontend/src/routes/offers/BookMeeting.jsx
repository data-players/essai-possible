import React from "react";
import {useLoaderData} from "react-router-dom";
import List from "@mui/joy/List";
import ListItem from "@mui/joy/ListItem";
import Stack from "@mui/joy/Stack";
import Typography from "@mui/joy/Typography";
import Button from "@mui/joy/Button";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import CalendarMonthRoundedIcon from "@mui/icons-material/CalendarMonthRounded";
import {Trans, useTranslation} from "react-i18next";
import {RadioChips} from "../../components/atoms.jsx";
import {OfferBanner} from "./Offer.jsx";
import ListSubheader from "@mui/joy/ListSubheader";
import {useState} from "react";
import CheckIcon from "@mui/icons-material/Check";
import {groupBy} from "../../utils/utils.js";
import {PageContent} from "../../components/Layout";
import TextField from "@mui/joy/TextField";
import Grid from "@mui/joy/Grid";
import Textarea from "@mui/joy/Textarea";
import FormControl from "@mui/joy/FormControl";
import FormLabel from "@mui/joy/FormLabel";
import Box from "@mui/joy/Box";

export default function BookMeeting() {
  const {t} = useTranslation();
  const offer = useLoaderData().offer;

  const [selectedMeetingSlot, setSelectedMeetingSlot] = useState();
  const [formStep, setFormStep] = useState(0);

  const sortedSlots = offer.slots.sort((a, b) => a.start.getTime() - b.start.getTime());

  const slotsByDate = groupBy(sortedSlots, (slot) => {
    return t("intlDate", {val: slot.start});
  });

  function ValidateButton(props) {
    return (
      <Button
        size={"lg"}
        color="success"
        onClick={() => setFormStep(formStep + 1)}
        startDecorator={<CheckIcon />}
        {...props}
      />
    );
  }

  function BackValidationButton(props) {
    return (
      <Button
        size={"sm"}
        variant={"soft"}
        color="danger"
        onClick={() => setFormStep(formStep - 1)}
        startDecorator={<ChevronLeftIcon />}
        {...props}
      />
    );
  }

  return (
    <>
      <OfferBanner
        offer={offer}
        breadcrumbs={[
          {label: t("offer.backToOffers"), to: "/offers"},
          {label: offer.title, to: "./.."},
          {label: t("offer.meetingSlot"), to: ".", onClick: () => setFormStep(0)},
          formStep >= 1 && {
            label: t("offer.myInformation"),
            to: ".",
            onClick: () => setFormStep(1),
          },
        ]}
      />

      <PageContent gap={2}>
        {formStep === 0 && (
          <>
            <Typography mt={4} level={"h1"} color={"primary"}>
              {t("offer.bookAMeetingSlot")}
            </Typography>
            {slotsByDate ? (
              <>
                <List sx={{mt: 2}}>
                  {Object.entries(slotsByDate).map(([date, slots]) => (
                    <React.Fragment key={date}>
                      <ListSubheader sx={{fontSize: "md", mt: 2}}>{date}</ListSubheader>
                      <ListItem>
                        <RadioChips
                          options={slots.map((slot) => ({
                            label: t("intlTime", {val: slot.start}),
                            icon: CalendarMonthRoundedIcon,
                            key: slot.start.toString(),
                          }))}
                          value={selectedMeetingSlot}
                          setFieldValue={setSelectedMeetingSlot}
                        />
                      </ListItem>
                    </React.Fragment>
                  ))}
                </List>

                <Stack gap={2} my={1}>
                  <Typography sx={{height: 30}} textColor={"text.tertiary"}>
                    {selectedMeetingSlot && (
                      <Trans
                        i18nKey="offer.youAreAboutToBookAMeetingOnThe"
                        values={{
                          dateTime: t("intlDateTime", {
                            val: sortedSlots.find(
                              (slot) => slot.start.toString() === selectedMeetingSlot
                            ).start,
                          }),
                        }}
                      />
                    )}
                  </Typography>
                  <ValidateButton disabled={!selectedMeetingSlot}>
                    {t("offer.chooseThisMeetingSlot")}
                  </ValidateButton>
                </Stack>
              </>
            ) : (
              <Typography mt={4} textColor={"text.tertiary"}>
                {t("offer.ohOhNoMeetings")}
              </Typography>
            )}
          </>
        )}

        {formStep === 1 && (
          <>
            <Typography mt={4} level={"h1"} color={"primary"}>
              {t("offer.myInformation")}
            </Typography>

            <Box>
              <Grid container columnSpacing={4} rowSpacing={3} mx={-1.5} my={2}>
                <Grid lg={6} xs={12}>
                  <TextField label="Prénom" placeholder="prénom" name="firstName" />
                </Grid>
                <Grid lg={6} xs={12}>
                  <TextField label="Nom" name="lastName" placeholder="nom" />
                </Grid>
                <Grid lg={6} xs={12}>
                  <TextField label="Email" name="email" placeholder="email@monemail.com" />
                </Grid>
                <Grid lg={6} xs={12}>
                  <TextField
                    label="Numéro de téléphone"
                    name="phone"
                    placeholder="+33 6 12 34 56 78"
                  />
                </Grid>
                <Grid xs={12}>
                  <FormControl>
                    <FormLabel htmlFor="comments">Commentaires particuliers</FormLabel>
                    <Textarea
                      name="comments"
                      placeholder="commentaires, remarques pour l'entreprise..."
                      minRows={3}
                    />
                  </FormControl>
                </Grid>
              </Grid>
            </Box>

            <Stack direction={{xs: "column-reverse", sm: "row"}} rowGap={2} columnGap={3}>
              <BackValidationButton onClick={() => setFormStep(0)} sx={{flexGrow: 0}}>
                {t("goBack")}
              </BackValidationButton>
              <ValidateButton sx={{flexGrow: 1}}>{t("offer.validateInformation")}</ValidateButton>
            </Stack>
          </>
        )}
      </PageContent>
    </>
  );
}
