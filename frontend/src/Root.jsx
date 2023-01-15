import React from "react";
import {useTranslation} from "react-i18next";
import {
  Link as ReactRouterLink,
  Outlet,
  ScrollRestoration,
  useLocation,
  useNavigate,
} from "react-router-dom";
import IconButton from "@mui/joy/IconButton";
import Input from "@mui/joy/Input";
import List from "@mui/joy/List";
import ListItem from "@mui/joy/ListItem";
import ListItemButton from "@mui/joy/ListItemButton";
import ListItemContent from "@mui/joy/ListItemContent";
import ListItemDecorator from "@mui/joy/ListItemDecorator";
import ListSubheader from "@mui/joy/ListSubheader";
import Typography from "@mui/joy/Typography";
import AssignmentIndRoundedIcon from "@mui/icons-material/AssignmentIndRounded";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import Layout, {AuthButton} from "./components/Layout.jsx";
import Box from "@mui/joy/Box";
import {t} from "i18next";
import Stack from "@mui/joy/Stack";
import Chip from "@mui/joy/Chip";
import Link from "@mui/joy/Link";
import {useFetchOffersQuery} from "./app/api.js";
import {selectCurrentUser, useAutoLogin} from "./app/auth-slice.js";
import {useSelector} from "react-redux";

const getNavigation = () => [
  {
    label: t("offer.seeOffers"),
    to: "offers",
    icon: AssignmentIndRoundedIcon,
  },
  {
    label: t("nav.hiringManagersSpace"),
    to: "hiring-managers",
    icon: AssignmentIndRoundedIcon,
  },
];

function MobileNavigation() {
  const navigate = useNavigate();
  return (
    <List size="sm" sx={{"--List-item-radius": "8px", "--List-gap": "4px"}}>
      <ListItem nested>
        <ListSubheader>{t("essaiPossible")}</ListSubheader>
        <List
          aria-labelledby="nav-list-browse"
          sx={{
            "& .JoyListItemButton-root": {p: "8px"},
          }}>
          <ListItem>
            <SearchBar onClick={() => navigate("/offers")} />
          </ListItem>
          {getNavigation().map(({label, to, icon: Icon}) => (
            <ListItem>
              <ListItemButton component={ReactRouterLink} to={to}>
                <ListItemDecorator sx={{color: "text.secondary"}}>
                  <Icon fontSize="small" />
                </ListItemDecorator>
                <ListItemContent>{label}</ListItemContent>
              </ListItemButton>
            </ListItem>
          ))}
          <ListItem>
            <AuthButton.LogIn />
          </ListItem>
          <ListItem>
            <AuthButton.SignUp />
          </ListItem>
        </List>
      </ListItem>
    </List>
  );
}

export function SearchBar({sx, ...props}) {
  const {t} = useTranslation();
  return (
    <Input
      variant={"soft"}
      color={"neutral"}
      placeholder={t("offer.searchAnOffer")}
      startDecorator={<SearchRoundedIcon color="primary" />}
      {...props}
      sx={[{display: "flex"}, ...(Array.isArray(sx) ? sx : [sx])]}
    />
  );
}

const Root = ({children}) => {
  const {t} = useTranslation();
  const navigate = useNavigate();

  // When we land on the website, prepare the data:
  // - auto connect the user if the user was already logged in
  // - prefetch the offers list directly so it's ready to be displayed.
  useAutoLogin();
  useFetchOffersQuery();

  const path = useLocation().pathname;
  const currentUser = useSelector(selectCurrentUser());

  return (
    <Box sx={{minHeight: "100vh", bgcolor: "neutral.solidBg"}}>
      <ScrollRestoration
        getKey={(location) => {
          // https://reactrouter.com/en/main/components/scroll-restoration#getkey
          const noScrollResetPaths = ["/offers"];
          return noScrollResetPaths.includes(location.pathname)
            ? // custom paths: restore by pathname
              location.pathname
            : // everything else: restore by location like the browser does natively
              location.key;
        }}
      />
      <Layout.Root>
        <Layout.Navigation mobileDrawerContent={MobileNavigation}>
          {/* Big screens: show search bar, except on /offers page */}
          {path !== "/offers" && (
            <SearchBar
              sx={{
                display: {xs: "none", sm: "flex"},
                flexBasis: {sm: "200px", md: "300px", lg: "500px"},
              }}
              onClick={() => navigate("offers")}
            />
          )}
          {/* Small screens: show search icon */}
          <IconButton
            variant="soft"
            color="neutral"
            sx={{display: {sm: "none"}, ml: "auto"}}
            onClick={() => navigate("offers")}>
            <SearchRoundedIcon color="primary" />
          </IconButton>

          {/* Small screens: only icon button to log in */}
          <AuthButton.LogInShort sx={{display: {xs: "block", sm: "none"}}} />
          {/* Big screens: two regular buttons for login and signup */}
          <Stack direction={"row"} gap={1.5} display={{xs: "none", sm: "flex"}}>
            <AuthButton.LogIn currentUser={currentUser} />
            {!currentUser && <AuthButton.SignUp />}
          </Stack>
        </Layout.Navigation>

        <Layout.Main sx={{overflow: "hidden"}}>{children ? children : <Outlet />}</Layout.Main>

        <Layout.Footer>
          <Chip color={"primary"} variant={"soft"}>
            {t("footer.contact")}
          </Chip>
          <Typography fontSize={"md"} fontWeight={"xl"} sx={{mt: 1, ml: 2}}>
            <Link href={"mailto:contact@essaipossible.fr"} sx={{color: "primary.solidColor"}}>
              contact@essaipossible.fr
            </Link>
          </Typography>
        </Layout.Footer>
      </Layout.Root>
    </Box>
  );
};

export default Root;
