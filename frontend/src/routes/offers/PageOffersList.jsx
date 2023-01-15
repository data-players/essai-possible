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
import {SearchBar} from "../../Root";
import React, {useState} from "react";
import {normalize} from "../../app/utils.js";
import FormControl from "@mui/joy/FormControl";
import PlaceRoundedIcon from "@mui/icons-material/PlaceRounded";
import Chip from "@mui/joy/Chip";
import Select from "@mui/joy/Select";
import Option from "@mui/joy/Option";
import {useFetchOffersQuery, usePrefetch} from "../../app/api.js";
import {LoadingSpinner} from "../../components/atoms.jsx";
import {OfferInfoPills} from "./OfferInfoPills.jsx";

function OfferListItem({id, title, company, goal, startDate, description, location, slots}) {
  const {t} = useTranslation();
  const prefetchOffer = usePrefetch("fetchOffer");

  return (
    <ListItem onMouseEnter={() => prefetchOffer(id)}>
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

              <Typography level="h4">{company.name}</Typography>

              <OfferInfoPills sectors={company.sectors} goal={goal} startDate={startDate} />

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

export default function PageOffersList() {
  const {t} = useTranslation();

  const {data: offers = [], isLoading} = useFetchOffersQuery();

  // Search query stuff
  const [searchText, setSearchText] = useState("");
  const [locationText, setLocationText] = useState("");
  const [radius, setRadius] = useState("10");

  const searchFields = (fields, searchText) =>
    fields.find((field) => normalize(field).includes(normalize(searchText)));

  function filterOffers(offers) {
    const hasSearchText = searchText !== "";
    const hasLocalizationText = locationText !== "";
    return hasSearchText || hasLocalizationText
      ? offers.filter((item) => {
          const {
            title,
            company: {name: companyName},
            description,
            location,
          } = item;

          return (
            (!hasSearchText || searchFields([title, companyName, description], searchText)) &&
            (!hasLocalizationText || searchFields([location], locationText))
          );
        })
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
        {isLoading ? (
          <Stack justifyContent={"center"} alignItems={"center"} minHeight={300}>
            <LoadingSpinner />
          </Stack>
        ) : (
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
        )}
      </Container>
    </>
  );
}
