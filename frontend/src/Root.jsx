import React, {useEffect} from "react";
import {useTranslation} from "react-i18next";
import {
  Link as ReactRouterLink,
  Outlet,
  ScrollRestoration,
  useLocation,
  useNavigate,
} from "react-router-dom";
import IconButton from "@mui/joy/IconButton";
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
import Stack from "@mui/joy/Stack";
import Chip from "@mui/joy/Chip";
import Link from "@mui/joy/Link";
import {useFetchOffersQuery} from "./routes/offers/offers-slice.js";
import {
  selectAuthTokenExists,
  selectCurrentUser,
  selectCurrentUserReady,
  useLazyFetchUserQuery,
} from "./app/auth-slice.js";
import {useSelector} from "react-redux";
import {SearchBar} from "./components/atoms.jsx";
import {useFetchCompaniesQuery} from "./routes/offers/companies-slice.js";
import {useLazyFetchMeetingsQuery} from "./routes/offers/book/meetings-slice.js";
import {useFetchSlotsQuery} from "./routes/offers/book/slots-slice.js";

function MobileDrawerContent() {
  const navigate = useNavigate();
  const currentUser = useSelector(selectCurrentUser);
  const {t} = useTranslation();

  const navigationItems = [
    {
      label: t("offers.seeOffers"),
      to: "offers",
      icon: AssignmentIndRoundedIcon,
    },
    {
      label: t("nav.companiesSpace"),
      to: "hiring-managers",
      icon: AssignmentIndRoundedIcon,
    },
  ];

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
          {navigationItems.map(({label, to, icon: Icon}) => (
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
            <AuthButton.LogIn currentUser={currentUser} />
          </ListItem>
          {!currentUser && (
            <ListItem>
              <AuthButton.SignUp />
            </ListItem>
          )}
        </List>
      </ListItem>
    </List>
  );
}

const Root = ({children}) => {
  const {t} = useTranslation();
  const navigate = useNavigate();

  // When we land on the website, prepare the data:

  // - prefetch the full offers, slots and companies lists directly so it's ready to be displayed.
  useFetchOffersQuery();
  useFetchCompaniesQuery();
  useFetchSlotsQuery();

  // - prefetch the user if the user was already logged in
  const [launchFetchUserQuery] = useLazyFetchUserQuery();
  const authTokenExists = useSelector(selectAuthTokenExists);
  useEffect(() => {
    if (authTokenExists) launchFetchUserQuery();
  }, [authTokenExists, launchFetchUserQuery]);

  const path = useLocation().pathname;
  const currentUser = useSelector(selectCurrentUser);

  // - prefetch the user meetings as soon as the user is available
  const currentUserReady = useSelector(selectCurrentUserReady);
  const [launchFetchMeetingsQuery] = useLazyFetchMeetingsQuery();
  useEffect(() => {
    if (currentUserReady) launchFetchMeetingsQuery();
  }, [currentUserReady, launchFetchMeetingsQuery]);

  const userLoggedIn = currentUser || authTokenExists;

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
        <Layout.Navigation mobileDrawerContent={MobileDrawerContent}>
          {/* Big screens: show search bar, except on /offers page */}
          {path !== "/offers" && (
            <SearchBar
              sx={{
                display: {xs: "none", sm: "flex"},
                flexBasis: {sm: "200px", md: "300px", lg: "500px"},
              }}
              onClick={() => navigate("/offers")}
            />
          )}
          {/* Small screens: show search icon */}
          <IconButton
            variant="soft"
            color="neutral"
            sx={{display: {sm: "none"}, ml: "auto"}}
            onClick={() => navigate("/offers")}>
            <SearchRoundedIcon color="primary" />
          </IconButton>

          {/* Small screens: only icon button to log in */}
          <AuthButton.LogInShort
            currentUser={currentUser}
            sx={{display: {xs: "block", sm: "none"}}}
          />
          {/* Big screens: two regular buttons for login and signup */}
          <Stack direction={"row"} gap={1.5} display={{xs: "none", sm: "flex"}}>
            {userLoggedIn && <AuthButton.MyMeetings />}
            <AuthButton.LogIn currentUser={currentUser} />
            {!userLoggedIn && <AuthButton.SignUp />}
          </Stack>
        </Layout.Navigation>

        <Layout.Main sx={{overflow: "hidden"}}>
          <Outlet />
        </Layout.Main>

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
