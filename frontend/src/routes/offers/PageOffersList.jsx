import {Link as ReactRouterLink} from "react-router-dom";
import {HeroBanner} from "../../components/Layout.jsx";
import Card from "@mui/joy/Card";
import Container from "@mui/joy/Container";
import Grid from "@mui/joy/Grid";
import List from "@mui/joy/List";
import ListItem from "@mui/joy/ListItem";
import Stack from "@mui/joy/Stack";
import Typography from "@mui/joy/Typography";
import {useTranslation} from "react-i18next";
import {CheckboxGroup, LoadingSpinner, SearchBar} from "../../components/atoms.jsx";
import React, {useState} from "react";
import FormControl from "@mui/joy/FormControl";
import PlaceRoundedIcon from "@mui/icons-material/PlaceRounded";
import Chip from "@mui/joy/Chip";
import Select from "@mui/joy/Select";
import Option from "@mui/joy/Option";
import {usePrefetch} from "../../app/api.js";
import OfferInfoPills from "./OfferInfoPills.jsx";
import {useSelector} from "react-redux";
import {selectFilteredOffersIds, selectOfferById, selectOffersReady} from "./offers-slice.js";
import {selectCompaniesReady, selectCompanyById} from "./companies-slice.js";
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

function OfferListItem({offerId}) {
  const {t} = useTranslation();

  const launchOfferPrefetch = usePrefetch("fetchOffer");
  const launchCompanyPrefetch = usePrefetch("fetchCompany");

  const offer = useSelector((state) => selectOfferById(state, offerId));
  const company = useSelector((state) => selectCompanyById(state, offer.company)) || {};

  return (
    <ListItem
      onMouseEnter={() => {
        launchOfferPrefetch(offer.id);
        launchCompanyPrefetch(offer.company);
      }}>
      <Card
        component={ReactRouterLink}
        to={offerId}
        variant={"soft"}
        size={"lg"}
        sx={{
          width: "100%",
          textDecoration: "none",
          my: 1,
          ":hover": {boxShadow: "lg"},
        }}>
        <Grid container columnSpacing={4} rowSpacing={2}>
          <Grid xs={12} md={8}>
            <Stack gap={2}>
              <Typography level="h3" component="h2" fontWeight={"lg"}>
                {offer.title}
              </Typography>

              <Typography level="h4">{company.name}</Typography>

              <OfferInfoPills company={company} offer={offer} />

              <Stack
                gap={2}
                direction={"row"}
                flexWrap={"wrap"}
                alignItems={"center"}
                justifyContent={"space-between"}>
                <Typography textColor={"text.tertiary"}>
                  {t("offers.xMeetingSlotsAvailable", {count: offer.slots?.length || 0})}
                </Typography>

                <Chip
                  color={"neutral.tertiary"}
                  variant={"plain"}
                  startDecorator={<PlaceRoundedIcon />}
                  sx={{p: 0, opacity: 0.6}}>
                  {offer.location}
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
                {offer.description}
              </Typography>
            </Card>
          </Grid>
        </Grid>
      </Card>
    </ListItem>
  );
}

const filtersInitialState = {
  search: "",
  location: "",
  radius: 10,
  sectors: [],
  goals: [],
};

function getUrlParam(key, urlParams) {
  const defaultValue = filtersInitialState[key];
  let urlParamValue = urlParams.get(key);

  if (urlParamValue === null) return defaultValue;
  if (Array.isArray(defaultValue) && urlParamValue.length > 0) return urlParamValue.split(";");
  if (typeof defaultValue === "number") return parseInt(urlParamValue);
  return urlParamValue;
}

function setURLParam(key, value) {
  let urlParamValue = value;

  if (Array.isArray(value) && value.length > 0) urlParamValue = value.join(";");
  else if (typeof value === "number") urlParamValue = value.toString();
  const newParams = new URLSearchParams(window.location.search);
  urlParamValue !== "" ? newParams.set(key, urlParamValue) : newParams.delete(key);

  window.history.replaceState(null, null, "/offers?" + newParams.toString());
}

const debouncedSetURLParam = debounce(setURLParam, 1000);

export default function PageOffersList() {
  const {t} = useTranslation();

  const rawUrlSearchParams = new URLSearchParams(window.location.search);
  const searchParams = {
    search: getUrlParam("search", rawUrlSearchParams),
    location: getUrlParam("location", rawUrlSearchParams),
    radius: getUrlParam("radius", rawUrlSearchParams),
    sectors: getUrlParam("sectors", rawUrlSearchParams),
    goals: getUrlParam("goals", rawUrlSearchParams),
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

            <Grid xs={12} display={"flex"} justifyContent={"center"}>
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
                      <SearchBar
                        size={"lg"}
                        defaultValue={location}
                        placeholder={"Ville ou région..."}
                        startDecorator={<PlaceRoundedIcon color="primary" />}
                        onChange={(event) => {
                          setLocation(event.target.value);
                          debouncedSetURLParam("location", event.target.value);
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
                          setURLParam("radius", value);
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
                          setURLParam("goals", value);
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
                            setURLParam("sectors", value);
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

      <Container>
        {offersReady && companiesReady ? (
          <Stack my={4} alignItems={"center"}>
            {filteredOffersIds.length > 0 ? (
              <List>
                {filteredOffersIds.map((offerId) => (
                  <OfferListItem offerId={offerId} key={offerId} />
                ))}
              </List>
            ) : (
              t("error.oopsNoResults")
            )}
          </Stack>
        ) : (
          <Stack justifyContent={"center"} alignItems={"center"} minHeight={300}>
            <LoadingSpinner />
          </Stack>
        )}
      </Container>
    </>
  );
}
