import {Link as ReactRouterLink, useLoaderData} from "react-router-dom";
import {loremIpsum} from "lorem-ipsum";
import {HeroBanner} from "../../components/Layout.jsx";
import Card from "@mui/joy/Card";
import Container from "@mui/joy/Container";
import Grid from "@mui/joy/Grid";
import List from "@mui/joy/List";
import ListItem from "@mui/joy/ListItem";
import Stack from "@mui/joy/Stack";
import Typography from "@mui/joy/Typography";
import {useTranslation} from "react-i18next";
import {SectorsGoalsDatePills} from "./Offer";
import {SearchBar} from "../../Root";
import React, {useState} from "react";
import {normalize} from "../../utils/utils.js";
import FormControl from "@mui/joy/FormControl";
import PlaceRoundedIcon from "@mui/icons-material/PlaceRounded";
import Chip from "@mui/joy/Chip";
import Select from "@mui/joy/Select";
import Option from "@mui/joy/Option";

export const offers = [
  {
    id: "titredeloffre",
    title: "Titre de l'offre",
    company: "P&V Group",
    location: "Paris",
    sectors: [
      "Activités de services administratifs et de soutien",
      "Santé humaine et action sociale",
    ],
    goals: ["Recrutement"],
    startDate: new Date(2023, 3, 25),
    description: loremIpsum({count: 2, units: "paragraph"}),
    tasks: loremIpsum({count: 1, units: "paragraph"}),
    skills: new Array(3).fill(0).map(() => loremIpsum({count: 4, units: "words"})),
    slots: [
      {start: new Date(2023, 3, 23, 16, 30), duration: 30},
      {start: new Date(2023, 3, 23, 16, 0), duration: 30},
      {start: new Date(2023, 3, 24, 15, 30), duration: 30},
      {start: new Date(2023, 3, 24, 16, 0), duration: 30},
      {start: new Date(2023, 3, 25, 16, 30), duration: 30},
      {start: new Date(2023, 3, 23, 15, 30), duration: 30},
    ],
  },
  {
    id: "comptable",
    title: "Comptable",
    company: "TiBillet",
    location: "La Réunion",
    sectors: ["Événementiel", "ESS"],
    goals: ["Recrutement"],
    startDate: new Date(2023, 2, 4),
    description: loremIpsum({count: 2, units: "paragraph"}),
    tasks: loremIpsum({count: 1, units: "paragraph"}),
    skills: new Array(3).fill(0).map(() => loremIpsum({count: 4, units: "words"})),
  },
  {
    id: "devcooperatiffront",
    title: "Dev Coopératif front",
    company: "TiBillet",
    location: "La Réunion",
    sectors: ["Événementiel", "ESS"],
    goals: ["Recrutement"],
    startDate: new Date(2023, 2, 4),
    description: loremIpsum({count: 2, units: "paragraph"}),
    tasks: loremIpsum({count: 1, units: "paragraph"}),
    skills: new Array(3).fill(0).map(() => loremIpsum({count: 4, units: "words"})),
    slots: [{start: new Date(2023, 3, 23, 15, 30), duration: 30}],
  },
  {
    id: "devcooperatifback",
    title:
      "Très long vraiment très long titre d'une très longue offre qui s'affiche difficilement car elle est très longue",
    company: "P&V Group",
    location: "Paris",
    sectors: ["Industriel"],
    goals: ["Recrutement"],
    startDate: new Date(2023, 2, 4),
    description: loremIpsum({count: 2, units: "paragraph"}),
    tasks: loremIpsum({count: 1, units: "paragraph"}),
    skills: new Array(3).fill(0).map(() => loremIpsum({count: 4, units: "words"})),
    slots: [
      {start: new Date(2023, 3, 23, 15, 30), duration: 30},
      {start: new Date(2023, 3, 23, 16, 0), duration: 30},
      {start: new Date(2023, 3, 24, 16, 0), duration: 30},
      {start: new Date(2023, 3, 25, 16, 30), duration: 30},
    ],
  },
  {
    id: "consultantenergiesrenouvelables",
    title: "Consultant énergies renouvelables",
    company: "Enercoop",
    location: "Tours",
    sectors: ["Environment", "ESS"],
    goals: ["Recrutement", "Discussion"],
    startDate: new Date(2023, 2, 4),
    description: loremIpsum({count: 2, units: "paragraph"}),
    tasks: loremIpsum({count: 1, units: "paragraph"}),
    skills: new Array(3).fill(0).map(() => loremIpsum({count: 4, units: "words"})),
    slots: [
      {start: new Date(2023, 3, 23, 15, 30), duration: 30},
      {start: new Date(2023, 3, 23, 16, 0), duration: 30},
      {start: new Date(2023, 3, 24, 15, 30), duration: 30},
      {start: new Date(2023, 3, 24, 16, 0), duration: 30},
      {start: new Date(2023, 3, 25, 16, 30), duration: 30},
    ],
  },
];

export async function loader() {
  return {offers};
}

function OfferListItem({
  id,
  title,
  company,
  sectors,
  goals,
  startDate,
  description,
  location,
  slots,
}) {
  const {t} = useTranslation();

  return (
    <ListItem>
      <Card
        component={ReactRouterLink}
        to={id}
        variant={"soft"}
        size={"lg"}
        sx={{
          width: "100%",
          textDecoration: "none",
          my: 1,
          ":hover": {boxShadow: "md"},
        }}>
        <Grid container columnSpacing={4} rowSpacing={2}>
          <Grid xs={12} md={8}>
            <Stack gap={2}>
              <Typography level="h3" component="h2" fontWeight={"lg"}>
                {title}
              </Typography>

              <Typography level="h4">{company}</Typography>

              <SectorsGoalsDatePills sectors={sectors} goals={goals} startDate={startDate} />

              <Stack
                gap={2}
                direction={"row"}
                flexWrap={"wrap"}
                alignItems={"center"}
                justifyContent={"space-between"}>
                <Typography textColor={"text.tertiary"}>
                  {t("offer.xMeetingSlotsAvailable", {count: slots?.length || 0})}
                </Typography>

                <Chip
                  color={"neutral.tertiary"}
                  variant={"plain"}
                  startDecorator={<PlaceRoundedIcon />}
                  sx={{p: 0, opacity: 0.6}}>
                  {location}
                </Chip>
              </Stack>
            </Stack>
          </Grid>

          <Grid xs={12} md={4}>
            <Card sx={{height: "100%"}}>
              <Typography
                sx={{
                  whiteSpace: "normal",
                  overflow: "hidden",
                  display: "-webkit-box",
                  WebkitLineClamp: {xs: 4, md: 8},
                  WebkitBoxOrient: "vertical",
                }}>
                {description}
              </Typography>
            </Card>
          </Grid>
        </Grid>
      </Card>
    </ListItem>
  );
}

export default function Offers() {
  const [searchText, setSearchText] = useState("");
  const [locationText, setLocationText] = useState("");
  const [radius, setRadius] = useState("10");

  const {t} = useTranslation();
  const {offers} = useLoaderData();

  const searchItems = (item, fieldsToSearch, searchText) =>
    fieldsToSearch.find((field) => normalize(item[field]).includes(normalize(searchText)));

  function filterOffers(offers) {
    const hasSearchText = searchText !== "";
    const hasLocalizationText = locationText !== "";
    return hasSearchText || hasLocalizationText
      ? offers.filter(
          (item) =>
            (!hasSearchText || searchItems(item, ["title", "company"], searchText)) &&
            (!hasLocalizationText || searchItems(item, ["location"], locationText))
        )
      : offers;
  }
  const filteredOffers = filterOffers(offers);

  return (
    <>
      <HeroBanner>
        <Container mx={2}>
          <Grid container spacing={4}>
            <Grid xs={12} display={"flex"} justifyContent={"center"}>
              <Typography level="h1">{t("offer.theOffers")}</Typography>
            </Grid>

            <Grid xs={12} display={"flex"} justifyContent={"center"}>
              <Card variant={"solid"} size={"lg"} sx={{width: 1000, p: 1.5}}>
                <Grid container spacing={3}>
                  <Grid xs={12} md={5}>
                    <FormControl>
                      <Typography sx={{color: "neutral.solidBg"}}>Mots clés</Typography>
                      <SearchBar
                        size={"lg"}
                        onChange={(event) => setSearchText(event.target.value)}
                      />
                    </FormControl>
                  </Grid>
                  <Grid xs={12} sm={7} md={4}>
                    <FormControl>
                      <Typography sx={{color: "neutral.solidBg"}}>Localisation</Typography>
                      <SearchBar
                        size={"lg"}
                        placeholder={"Ville ou région..."}
                        startDecorator={<PlaceRoundedIcon color="primary" />}
                        onChange={(event) => setLocationText(event.target.value)}
                      />
                    </FormControl>
                  </Grid>

                  <Grid xs={12} sm={5} md={3}>
                    <FormControl>
                      <Typography sx={{color: "neutral.solidBg"}}>Dans un rayon de...</Typography>

                      <Select
                        size={"lg"}
                        value={radius}
                        variant={"soft"}
                        color={"neutral"}
                        onChange={(event, value) => setRadius(value)}>
                        <Option value="5">0 à 5km</Option>
                        <Option value="10">0 à 10km</Option>
                        <Option value="20">0 à 20km</Option>
                        <Option value="50">0 à 50km</Option>
                        <Option value="100">0 à 100km</Option>
                      </Select>
                    </FormControl>
                  </Grid>
                </Grid>
              </Card>
            </Grid>
          </Grid>
        </Container>
      </HeroBanner>
      <Container>
        <Stack my={4} alignItems={"center"}>
          {filteredOffers.length > 0 ? (
            <List>
              {filteredOffers.map((offer) => (
                <OfferListItem {...offer} key={offer.id} />
              ))}
            </List>
          ) : (
            t("oopsNoResults")
          )}
        </Stack>
      </Container>
    </>
  );
}
