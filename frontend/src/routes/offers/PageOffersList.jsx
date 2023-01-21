import {HeroBanner} from "../../components/Layout.jsx";
import Card from "@mui/joy/Card";
import Container from "@mui/joy/Container";
import Grid from "@mui/joy/Grid";
import Stack from "@mui/joy/Stack";
import Typography from "@mui/joy/Typography";
import {useTranslation} from "react-i18next";
import {
  CheckboxGroup,
  ListPageContent,
  LocationSearchBar,
  SearchBar,
} from "../../components/atoms.jsx";
import React, {useState} from "react";
import FormControl from "@mui/joy/FormControl";
import Select from "@mui/joy/Select";
import Option from "@mui/joy/Option";
import {useSelector} from "react-redux";
import {selectFilteredOffersIds, selectOffersReady} from "./offers-slice.js";
import {selectCompaniesReady} from "./companies-slice.js";
import {sectorsOptions} from "./companies-slice-data.js";
import Box from "@mui/joy/Box";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import FormLabel from "@mui/joy/FormLabel";
import IconButton from "@mui/joy/IconButton";
import Collapse from "@mui/material/Collapse";
import {goalOptions} from "./offers-slice-data.js";
import debounce from "@mui/utils/debounce.js";
import Link from "@mui/joy/Link";
import OfferListItem from "./OfferListItem.jsx";

function getUrlParam(key, urlParams, type = "string", defaultValue = "") {
  let urlParamValue = urlParams.get(key);

  if (urlParamValue === null) return defaultValue;

  if (type === "array" && urlParamValue.length > 0) return urlParamValue.split(";");
  else if (type === "number") return parseInt(urlParamValue);
  else if (type === "object") return JSON.parse(urlParamValue);

  return urlParamValue;
}

function setURLParam(key, value, type = "string") {
  const URLParams = new URLSearchParams(window.location.search);

  if (!value || value === "" || value === [] || value === {}) {
    URLParams.delete(key);
  } else {
    // Case value is an Array
    if (type === "array") value = value.join(";");
    else if (type === "number") value = value.toString();
    else if (type === "object") value = JSON.stringify(value);

    // If value equals something
    URLParams.set(key, value);
  }

  const queryParamsString = URLParams.toString();

  window.history.replaceState(
    null,
    null,
    queryParamsString.length > 0 ? `/offers?${queryParamsString}` : "/offers"
  );
}

const debouncedSetURLParam = debounce(setURLParam, 1000);

export default function PageOffersList() {
  const {t} = useTranslation();

  const rawUrlSearchParams = new URLSearchParams(window.location.search);
  const searchParams = {
    search: getUrlParam("search", rawUrlSearchParams),
    location: getUrlParam("location", rawUrlSearchParams, "object", null),
    radius: getUrlParam("radius", rawUrlSearchParams, "number", 10),
    sectors: getUrlParam("sectors", rawUrlSearchParams, "array", []),
    goals: getUrlParam("goals", rawUrlSearchParams, "array", []),
  };

  const [search, setSearch] = useState(searchParams.search);
  const [location, setLocation] = useState(searchParams.location);
  const [radius, setRadius] = useState(searchParams.radius);
  const [sectors, setSectors] = useState(searchParams.sectors);
  const [goals, setGoals] = useState(searchParams.goals);

  // Advanced filters panel
  const [expanded, setExpanded] = useState(false);

  const offersReady = useSelector(selectOffersReady);
  const companiesReady = useSelector(selectCompaniesReady);

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
                        defaultValue={search}
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
                  direction="row"
                  alignItems="center"
                  gap={2}
                  sx={{cursor: "pointer", px: 3, py: 2.5, m: -2, flexGrow: 1}}
                  onClick={() => setExpanded(!expanded)}>
                  <IconButton>
                    {expanded ? <KeyboardArrowDownIcon /> : <KeyboardArrowRightIcon />}
                  </IconButton>
                  <Link
                    sx={{
                      color: expanded ? "primary.solidBg" : "white",
                      fontWeight: expanded && "lg",
                    }}>
                    {expanded ? "Cacher" : "Voir"} les filtres avancés
                  </Link>
                </Stack>
                <Collapse in={expanded}>
                  <Grid
                    xs={12}
                    sx={{opacity: expanded ? 1 : 0, transition: "opacity 0.3s ease-in-out"}}>
                    <Box>
                      <FormLabel sx={{mb: 1}}>Objectifs de recrutement</FormLabel>
                      <CheckboxGroup
                        options={goalOptions}
                        value={goals}
                        setFieldValue={(value) => {
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
                        <CheckboxGroup
                          options={sectorsOptions}
                          value={sectors}
                          setFieldValue={(value) => {
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
          </Grid>
        </Container>
      </HeroBanner>

      <ListPageContent
        ready={offersReady && companiesReady}
        noResultsText={t("error.oopsNoResults")}
        values={filteredOffersIds}
        item={({value}) => <OfferListItem offerId={value} key={value} />}
      />
    </>
  );
}
