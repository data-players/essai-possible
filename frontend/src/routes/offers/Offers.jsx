import {useLoaderData, useNavigate} from "react-router-dom";
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
import {useState} from "react";
import {normalize} from "../../utils/utils.js";

export const offers = [
  {
    id: "titredeloffre",
    title: "Titre de l'offre",
    company: "P&V Group",
    sectors: ["Industriel"],
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
    title: "Dev Coopératif back",
    company: "P&V Group",
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

function OfferListItem({id, title, company, sectors, goals, startDate, description, slots}) {
  const {t} = useTranslation();
  const navigate = useNavigate();

  return (
    <ListItem>
      <Card
        onClick={() => navigate(id)}
        variant={"soft"}
        size={"lg"}
        sx={{
          width: "100%",
          my: 1,
          cursor: "pointer",
          ":hover": {boxShadow: "md"},
        }}>
        <Grid container spacing={4}>
          <Grid xs={12} md={8}>
            <Stack gap={2}>
              <Typography component="h2" level="h3" fontWeight={"lg"}>
                {title}
              </Typography>

              <Typography component="h3" level="h4">
                {company}
              </Typography>

              <SectorsGoalsDatePills sectors={sectors} goals={goals} startDate={startDate} />

              <Typography textColor={"text.tertiary"}>
                {t("offer.xMeetingSlotsAvailable", {count: slots?.length || 0})}
              </Typography>
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

  const {t} = useTranslation();
  const {offers} = useLoaderData();

  const searchItems = (item, fieldsToSearch, searchText) =>
    fieldsToSearch.find((field) => normalize(item[field]).includes(normalize(searchText)));

  const filteredOffers =
    searchText !== ""
      ? offers.filter((item) => searchItems(item, ["title", "company"], searchText))
      : offers;

  return (
    <>
      <HeroBanner>
        <Container mx={2}>
          <Stack alignItems={"center"} gap={4}>
            <Typography level="h2">{t("offer.theOffers")}</Typography>
            <SearchBar
              sx={{width: "500px", maxWidth: "100%"}}
              autoFocus
              onChange={(event) => setSearchText(event.target.value)}
            />
          </Stack>
        </Container>
      </HeroBanner>
      <Container>
        <Stack my={4} alignItems={"center"}>
          {filteredOffers.length > 0 ? (
            <List>
              {filteredOffers.map((offer) => (
                <OfferListItem {...offer} />
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
