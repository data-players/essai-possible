import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import Box from "@mui/joy/Box";
import Button from "@mui/joy/Button";
import Card from "@mui/joy/Card";
import Container from "@mui/joy/Container";
import FormControl from "@mui/joy/FormControl";
import FormLabel from "@mui/joy/FormLabel";
import Grid from "@mui/joy/Grid";
import Option from "@mui/joy/Option";
import Select from "@mui/joy/Select";
import Stack from "@mui/joy/Stack";
import Typography from "@mui/joy/Typography";
import Collapse from "@mui/material/Collapse";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import {
  selectAllGoals, selectAllSectors
} from "../../app/concepts-slice.js";
import { debouncedSetURLParam, getUrlParam, setURLParam } from "../../app/utils.js";
import {
  CheckboxGroupSemantic,
  ListPageContent,
  LocationSearchBar,
  SearchBar
} from "../../components/atoms.jsx";
import { HeroBanner } from "../../components/Layout.jsx";
import { selectCompaniesReady } from "./companies-slice.js";
import OfferListItem from "./OfferListItem.jsx";
import { selectFilteredOffersIds, selectOffersReady } from "./offers-slice.js";

const defaults = {
  search: "",
  location: null,
  radius: 10,
  sectors: [],
  goals: [],
};

export default function PageOffersList() {
  const {t} = useTranslation();

  const rawUrlSearchParams = new URLSearchParams(window.location.search);
  const searchParams = {
    search: getUrlParam("search", rawUrlSearchParams, defaults.search),
    location: getUrlParam("location", rawUrlSearchParams, "object", defaults.location),
    radius: getUrlParam("radius", rawUrlSearchParams, "number", defaults.radius),
    sectors: getUrlParam("sectors", rawUrlSearchParams, "array", defaults.sectors),
    goals: getUrlParam("goals", rawUrlSearchParams, "array", defaults.goals),
  };

  const [search, setSearch] = useState(searchParams.search);
  const [location, setLocation] = useState(searchParams.location);
  const [radius, setRadius] = useState(searchParams.radius);
  const [sectors, setSectors] = useState(searchParams.sectors);
  const [goals, setGoals] = useState(searchParams.goals);

  const resetParams = () => {
    setSearch(defaults.search);
    setLocation(defaults.location);
    setRadius(defaults.radius);
    setSectors(defaults.sectors);
    setGoals(defaults.goals);
    window.history.replaceState(null, null, "/offers");
  };

  const ClearSearchButton = ({sx}) => (
    <Button
      sx={sx}
      variant={"plain"}
      startDecorator={<DeleteOutlineRoundedIcon />}
      onClick={(event) => {
        event.stopPropagation();
        resetParams();
        setExpanded(false);
      }}>
      Effacer la recherche
    </Button>
  );

  // Advanced filters panel
  const [expanded, setExpanded] = useState(false);

  const offersReady = useSelector(selectOffersReady);
  const companiesReady = useSelector(selectCompaniesReady);

  const goalsOptions = useSelector(selectAllGoals);
  const sectorsOptions = useSelector(selectAllSectors);

  const filteredOffersIds = useSelector((state) =>
    selectFilteredOffersIds(state, {search, location, radius, sectors, goals})
  );

  return (
    <>
      <HeroBanner invertedColors={false}>
        <Container mx={2}>
          <Grid container spacing={2}>
            <Grid xs={12} display={"flex"} justifyContent={"center"}>
              <Typography level="h1" color={"white"}>
                {t("offers.theOffers")}
              </Typography>
            </Grid>

            <Grid xs={12} display={"flex"} justifyContent={"center"} mt={3}>
              <Card size={"lg"} sx={{width: 1000, p: 1.5}}>
                <Grid container spacing={3}>
                  <Grid xs={12} md={5}>
                    <FormControl>
                      <FormLabel>Mots clés</FormLabel>
                      <SearchBar
                        size={"lg"}
                        value={search}
                        onChange={(event) => {
                          setSearch(event.target.value);
                          debouncedSetURLParam("search", event.target.value);
                        }}
                      />
                    </FormControl>
                  </Grid>
                  <Grid xs={12} sm={7} md={4}>
                    <FormControl>
                      <FormLabel>Localisation</FormLabel>
                      <LocationSearchBar
                        size={"lg"}
                        value={location}
                        onChange={(event, value) => {
                          setLocation(value);
                          debouncedSetURLParam("location", value, "object");
                        }}
                      />
                    </FormControl>
                  </Grid>

                  <Grid xs={12} sm={5} md={3}>
                    <FormControl>
                      <FormLabel>Dans un rayon de...</FormLabel>
                      <Select
                        size={"lg"}
                        value={radius}
                        variant={"soft"}
                        onChange={(_, value) => {
                          setRadius(value);
                          setURLParam("radius", value, "number");
                        }}>
                        <Option value={5}>0 à 5km</Option>
                        <Option value={10}>0 à 10km</Option>
                        <Option value={20}>0 à 20km</Option>
                        <Option value={50}>0 à 50km</Option>
                        <Option value={100}>0 à 100km</Option>
                      </Select>
                    </FormControl>
                  </Grid>
                </Grid>
              </Card>
            </Grid>

            <Grid xs={12} display={"flex"} justifyContent={"center"}>
              <Card
                size={"lg"}
                sx={{
                  boxShadow: "none",
                  width: 1000,
                  p: 1.5,
                  bgcolor: !expanded && "transparent",
                  transition: "all 0.3s ease-in-out",
                }}>
                <Stack
                  direction={{sm: "row"}}
                  flexWrap={"wrap"}
                  sx={{cursor: "pointer", px: 3, py: 2.5, m: -2, flexGrow: 1}}
                  onClick={() => setExpanded(!expanded)}>
                  <Button
                    variant={"plain"}
                    sx={{":not(:hover)": !expanded && {color: "white"}}}
                    startDecorator={
                      expanded ? <KeyboardArrowDownIcon /> : <KeyboardArrowRightIcon />
                    }>
                    {expanded ? "Cacher" : "Voir"} les filtres avancés
                  </Button>
                  <ClearSearchButton
                    sx={{
                      ml: "auto",
                      display: {
                        xs: "none",
                        sm: "flex",
                      },
                      ":not(:hover)": !expanded && {color: "white"},
                    }}
                  />
                </Stack>
                <Collapse in={expanded}>
                  <Grid
                    xs={12}
                    sx={{mt: 1, opacity: expanded ? 1 : 0, transition: "opacity 0.3s ease-in-out"}}>
                    <Box>
                      <FormLabel>Objectifs de recrutement</FormLabel>
                      <CheckboxGroupSemantic
                        options={goalsOptions}
                        value={goals}
                        onChange={(value) => {
                          setGoals(value);
                          setURLParam("goals", value, "array");
                        }}
                      />
                    </Box>
                  </Grid>
                  <Grid container spacing={3}>
                    <Grid xs={12}>
                      <Box>
                        <FormLabel>Secteurs d'activité</FormLabel>
                        <CheckboxGroupSemantic
                          options={sectorsOptions}
                          value={sectors}
                          onChange={(value) => {
                            setSectors(value);
                            setURLParam("sectors", value, "array");
                          }}
                        />
                      </Box>
                    </Grid>
                  </Grid>
                </Collapse>
              </Card>
            </Grid>

            <Grid xs={12} display={{xs: "grid", sm: "none"}}>
              <ClearSearchButton sx={{mx: 3, ":not(:hover)": {color: "white"}}} />
            </Grid>
          </Grid>
        </Container>
      </HeroBanner>

      <ListPageContent
        ready={offersReady && companiesReady}
        noResultsContent={t("error.oopsNoResults")}
        values={filteredOffersIds}
        item={OfferListItem}
      />
    </>
  );
}
