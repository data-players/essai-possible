import React from "react";
import List from "@mui/joy/List";
import ListItem from "@mui/joy/ListItem";
import Stack from "@mui/joy/Stack";
import Typography from "@mui/joy/Typography";
import Button from "@mui/joy/Button";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import CalendarMonthRoundedIcon from "@mui/icons-material/CalendarMonthRounded";
import {Trans} from "react-i18next";
import {LoadingSpinner, RadioChips} from "../../components/atoms.jsx";
import ListSubheader from "@mui/joy/ListSubheader";
import {useState} from "react";
import CheckIcon from "@mui/icons-material/Check";
import {groupBy} from "../../app/utils.js";
import {PageContent} from "../../components/Layout";
import TextField from "@mui/joy/TextField";
import Textarea from "@mui/joy/Textarea";
import FormControl from "@mui/joy/FormControl";
import FormLabel from "@mui/joy/FormLabel";
import Collapse from "@mui/material/Collapse";
import Sheet from "@mui/joy/Sheet";
import {useFetchOfferQuery} from "../../app/api.js";
import {OfferBanner} from "./OfferBanner.jsx";
import dayjs from "dayjs";
import {useParams} from "react-router-dom";
import {useTranslationWithDates} from "../../app/i18n.js";
import {AuthCard} from "../auth/AuthCard.jsx";

export default function PageBookMeeting() {
  const {t, tTime, tDate, tDateTime} = useTranslationWithDates();

  const [selectedMeetingSlot, setSelectedMeetingSlot] = useState();
  // TODO debug
  const [formStep, setFormStep] = useState(1);
  const nextStep = () => setFormStep(formStep + 1);
  const lastStep = () => setFormStep(formStep - 1);

  const {id} = useParams();
  const {data: offer, isLoading} = useFetchOfferQuery(id);
  if (isLoading) return <LoadingSpinner />;

  const sortedSlots = [...offer.slots].sort((a, b) =>
    dayjs(a.start).isAfter(dayjs(b.start)) ? 1 : -1
  );

  const slotsByDate = groupBy(sortedSlots, (slot) => tDate(slot.start));

  const StepTitle = ({children}) => (
    <Typography mt={4} mb={1} level={"h2"} color={"primary"}>
      {children}
    </Typography>
  );

  function BackValidationButton(props) {
    return (
      <Button
        size={"sm"}
        variant={"soft"}
        color="danger"
        onClick={lastStep}
        startDecorator={<ChevronLeftIcon />}
        {...props}
      />
    );
  }

  return (
    <>
      <OfferBanner
        pageTitle={t("offer.bookAMeetingSlot", {context: "short"})}
        offer={offer}
        breadcrumbs={[
          {label: t("offer.backToOffers"), to: "/offers"},
          {label: offer.title, to: "./.."},
          {label: t("offer.bookAMeetingSlot"), to: ".", onClick: () => setFormStep(0)},
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
            <StepTitle> {t("offer.chooseYourMeetingSlot")}</StepTitle>

            {slotsByDate ? (
              <>
                <List>
                  {Object.entries(slotsByDate).map(([date, slots]) => (
                    <React.Fragment key={date}>
                      <ListSubheader sx={{fontSize: "md"}}>{date}</ListSubheader>
                      <ListItem sx={{mb: 3}}>
                        <RadioChips
                          options={slots.map((slot) => ({
                            label: tTime(slot.start),
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

                <Stack gap={2}>
                  <Button
                    size={"lg"}
                    disabled={!selectedMeetingSlot}
                    color="success"
                    onClick={nextStep}
                    startDecorator={<CheckIcon />}>
                    {t("offer.chooseThisMeetingSlot")}
                  </Button>
                  <Sheet>
                    <Collapse in={selectedMeetingSlot}>
                      {selectedMeetingSlot && (
                        <Typography sx={{alignSelf: "center"}} textColor={"text.tertiary"}>
                          <Trans
                            i18nKey="offer.youAreAboutToBookAMeetingOnThe"
                            values={{
                              dateTime: tDateTime(
                                sortedSlots.find(
                                  (slot) => slot.start.toString() === selectedMeetingSlot
                                ).start
                              ),
                            }}
                          />
                        </Typography>
                      )}
                    </Collapse>
                  </Sheet>
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
            <StepTitle>{t("offer.myInformation")}</StepTitle>

            <Stack gap={3}>
              <AuthCard />

              <TextField label="Numéro de téléphone" name="phone" placeholder="+33 6 12 34 56 78" />
              <FormControl>
                <FormLabel htmlFor="comments">Commentaires particuliers</FormLabel>
                <Textarea
                  name="comments"
                  placeholder="commentaires, remarques pour l'entreprise..."
                  minRows={3}
                />
              </FormControl>

              <Stack direction={{xs: "column-reverse", sm: "row"}} rowGap={2} columnGap={3} mt={2}>
                <BackValidationButton onClick={() => setFormStep(0)} sx={{flexGrow: 0}}>
                  {t("goBack")}
                </BackValidationButton>
                <Button
                  size={"lg"}
                  disabled={!selectedMeetingSlot}
                  color="success"
                  onClick={nextStep}
                  sx={{flexGrow: 1}}
                  startDecorator={<CheckIcon />}>
                  {t("offer.chooseThisMeetingSlot")}
                </Button>
              </Stack>
            </Stack>
          </>
        )}
      </PageContent>
    </>
  );
}
