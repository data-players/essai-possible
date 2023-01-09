import React from "react";
import {useTranslation} from "react-i18next";
import {Link as ReactRouterLink, Outlet, useLocation, useNavigate} from "react-router-dom";
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
import MenuIcon from "@mui/icons-material/Menu";
import GroupRoundedIcon from "@mui/icons-material/GroupRounded";
import Layout from "./components/Layout.jsx";
import Box from "@mui/joy/Box";
import Button from "@mui/joy/Button";
import {t} from "i18next";
import Stack from "@mui/joy/Stack";

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

function MobileNavigation({setDrawerOpen}) {
  const navigate = useNavigate();
  return (
    <List size="sm" sx={{"--List-item-radius": "8px", "--List-gap": "4px"}}>
      <ListItem nested>
        <ListSubheader>{t("nav.essaiPossible")}</ListSubheader>
        <List
          onClick={() => setDrawerOpen(false)}
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
            <NavButton.LogIn />
          </ListItem>
          <ListItem>
            <NavButton.SignIn />
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
      placeholder={t("offer.searchAnOffer")}
      startDecorator={<SearchRoundedIcon color="primary" />}
      {...props}
      sx={[{display: "flex"}, ...(Array.isArray(sx) ? sx : [sx])]}
    />
  );
}

const NavButton = {
  LogIn: ({sx}) => <Button sx={sx}>{t("nav.logIn")}</Button>,
  SignIn: ({sx}) => (
    <Button variant="soft" color="neutral" sx={sx}>
      {t("nav.signIn")}
    </Button>
  ),
};

const Root = ({children}) => {
  const {t} = useTranslation();
  const path = useLocation().pathname;
  const navigate = useNavigate();
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  console.log(window.location.key);
  return (
    <Box sx={{minHeight: "100vh", bgcolor: "neutral.solidBg"}}>
      {drawerOpen && (
        <Layout.SideDrawer onClose={() => setDrawerOpen(false)}>
          <MobileNavigation setDrawerOpen={setDrawerOpen} />
        </Layout.SideDrawer>
      )}
      <Layout.Root
        sx={{
          ...(drawerOpen && {
            height: "100vh",
            overflow: "hidden",
          }),
        }}>
        <Layout.Header>
          <Box
            onClick={() => navigate("/")}
            sx={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              gap: 1.5,
              cursor: "pointer",
            }}>
            {/* Small screens: show menu button */}
            <IconButton
              variant="soft"
              onClick={() => setDrawerOpen(true)}
              sx={{display: {sm: "none"}}}>
              <MenuIcon />
            </IconButton>
            {/* Big screens: show Platform icon */}
            <IconButton size="sm" variant="solid" sx={{display: {xs: "none", sm: "inline-flex"}}}>
              <GroupRoundedIcon />
            </IconButton>

            <Typography component="h1" level="h6" fontWeight="xl" noWrap>
              {t("nav.essaiPossible")}
            </Typography>
          </Box>

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

          <Stack direction={"row"} gap={1.5}>
            <NavButton.LogIn />
            {/* Small screens: hide sign in button */}
            <NavButton.SignIn sx={{display: {xs: "none", sm: "flex"}}} />
          </Stack>
        </Layout.Header>

        <Layout.Main>{children ? children : <Outlet />}</Layout.Main>

        <Layout.Footer></Layout.Footer>
      </Layout.Root>
    </Box>
  );
};

export default Root;
