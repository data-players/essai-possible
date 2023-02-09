import React, {useEffect, useState} from "react";
import {useTranslation} from "react-i18next";
import {Outlet, ScrollRestoration, useLocation, useNavigate} from "react-router-dom";
import IconButton from "@mui/joy/IconButton";
import Typography from "@mui/joy/Typography";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import Layout, {AuthButton} from "./components/Layout.jsx";
import Box from "@mui/joy/Box";
import Stack from "@mui/joy/Stack";
import Chip from "@mui/joy/Chip";
import Link from "@mui/joy/Link";
import {useFetchOffersQuery} from "./routes/offers/offers-slice.js";
import {
  authActions,
  selectAuthTokenExists,
  selectCurrentUser,
  selectCurrentUserReady,
  useLazyFetchUserQuery,
} from "./app/auth-slice.js";
import {useDispatch, useSelector} from "react-redux";
import {SearchBar} from "./components/atoms.jsx";
import {useFetchCompaniesQuery} from "./routes/offers/companies-slice.js";
import {useLazyFetchMeetingsQuery} from "./routes/offers/book/meetings-slice.js";
import {useFetchSlotsQuery} from "./routes/offers/book/slots-slice.js";
import queryString from "query-string";

export default function Root() {
  const {t} = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [forcedNavigation, setForcedNavigation] = useState(false);

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

  const location = useLocation();
  const values = queryString.parse(location.search);
  const path = location.pathname;

  useEffect(() => {
    if (values.token) {
      if (!authTokenExists) {
        try {
          dispatch(authActions.setToken(values.token));
        } catch (e) {
          console.error(e);
        }
      } else if (authTokenExists) {
        navigate(path);
        setForcedNavigation(true);
      }
    } else {
      if (authTokenExists) {
        launchFetchUserQuery();
      }
    }
  }, [authTokenExists, launchFetchUserQuery, forcedNavigation]);

  const currentUser = useSelector(selectCurrentUser);

  // - prefetch the user meetings as soon as the user is available
  const currentUserReady = useSelector(selectCurrentUserReady);

  const [launchFetchMeetingsQuery] = useLazyFetchMeetingsQuery();
  useEffect(() => {
    if (currentUserReady) launchFetchMeetingsQuery();
  }, [currentUserReady, launchFetchMeetingsQuery]);

  const isCompanyAccount = currentUser?.companies?.length > 0;

  const connectionButtons = currentUser ? (
    <>
      { currentUser?.concernedBy?.length > 0 && (
        <AuthButton.MyMeetings />
      )}
      { currentUser?.companies?.length > 0 && (
        <AuthButton.CompanyOffersList currentUser={currentUser} />
      )}
  
      <AuthButton.Account currentUser={currentUser} />
    </>
  ) : (
    <>
      <AuthButton.LogIn />
      <AuthButton.SignUp />
    </>
  );

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
        {/* isCompanyAccount param used to display help heder to company accont*/}
        <Layout.Navigation
          mobileDrawerContent={
            <>
              <SearchBar
                onClick={() => {
                  navigate("/offers");
                }}
              />
              <Stack gap={1.5}>{connectionButtons} </Stack>
            </>
          }
          isCompanyAccount={isCompanyAccount}>
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
          <Stack direction={"row"} gap={1.5} display={{sm: "none"}} ml={"auto"}>
            <IconButton variant="soft" color="neutral" onClick={() => navigate("/offers")}>
              <SearchRoundedIcon color="primary" />
            </IconButton>
            {isCompanyAccount ? (
              <AuthButton.CompanyOffersList currentUser={currentUser} small />
            ) : (
              <AuthButton.LogInShort
                currentUser={currentUser}
                sx={{display: {xs: "block", sm: "none"}}}
              />
            )}
          </Stack>

          {/* Big screens: two regular buttons for login and signup */}
          <Stack direction={"row"} gap={1.5} display={{xs: "none", sm: "flex"}}>
            {connectionButtons}
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
}
