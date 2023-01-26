import * as React from "react";
import Box from "@mui/joy/Box";
import Sheet from "@mui/joy/Sheet";
import Stack from "@mui/joy/Stack";
import HeroHomeImage from "../assets/hero-home.jpg";
import TousTesPossiblesLogoWhite from "../assets/tous-tes-possibles-logo-white.png";
import Grid from "@mui/joy/Grid";
import Typography from "@mui/joy/Typography";
import {useTranslation} from "react-i18next";
import IconButton from "@mui/joy/IconButton";
import MenuIcon from "@mui/icons-material/Menu.js";
import EssaiPossibleLogo from "../assets/essai-possible-logo.jpg";
import {Link as ReactRouterLink, useNavigate, useParams} from "react-router-dom";
import Slide from "@mui/material/Slide";
import Fade from "@mui/material/Fade";
import Container from "@mui/joy/Container";
import Link from "@mui/joy/Link";
import Button from "@mui/joy/Button";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded.js";
import {t} from "i18next";
import CreateRoundedIcon from "@mui/icons-material/CreateRounded.js";
import Menu from "@mui/joy/Menu";
import MenuItem from "@mui/joy/MenuItem";
import {useSelector} from "react-redux";
import {selectCompanyById} from "../routes/offers/companies-slice.js";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import Collapse from "@mui/material/Collapse";
import ApartmentRoundedIcon from "@mui/icons-material/ApartmentRounded";
import Divider from "@mui/joy/Divider";
import HelpPdf1 from "../assets/Outil 1 : Définition du poste.pdf";
import HelpPdf2 from "../assets/Outil 2 : Rédaction de l'offre d'emploi.pdf";
import FileOpenRoundedIcon from "@mui/icons-material/FileOpenRounded";

function Root(props) {
  return (
    <Box
      {...props}
      sx={[{bgcolor: "background.surface"}, ...(Array.isArray(props.sx) ? props.sx : [props.sx])]}
    />
  );
}

function Navigation({mobileDrawerContent, isCompanyAccount, ...props}) {
  const [drawerOpen, setDrawerOpen] = React.useState(false);

  const ExternalLink = (props) => (
    <Link
      startDecorator={<FileOpenRoundedIcon />}
      textColor={"primary.700"}
      fontSize={"sm"}
      target="_blank"
      {...props}
    />
  );

  const navigate = useNavigate();
  return (
    <>
      {/* Mobile side drawer */}
      <Slide direction="right" in={drawerOpen} mountOnEnter unmountOnExit>
        <Box
          sx={[{position: "fixed", zIndex: 1201, width: "100%", height: "100%"}]}
          onClick={() => setDrawerOpen(false)}>
          <Sheet
            sx={{
              minWidth: 256,
              width: "max-content",
              height: "100%",
              p: 2,
            }}>
            <Stack gap={3}>
              <Box
                onClick={() => navigate("/")}
                component={"img"}
                src={EssaiPossibleLogo}
                height={40}
                alignSelf={"start"}
              />
              {mobileDrawerContent}
            </Stack>
          </Sheet>
        </Box>
      </Slide>
      {/* Mobile side drawer background */}
      <Fade in={drawerOpen}>
        <Box
          role="button"
          onClick={() => setDrawerOpen(false)}
          sx={{
            position: "absolute",
            inset: 0,
            zIndex: 1200,
            bgcolor: (theme) => `rgba(${theme.vars.palette.neutral.darkChannel} / 0.8)`,
          }}
        />
      </Fade>
      <Collapse in={isCompanyAccount}>
        <Sheet
          variant={"soft"}
          invertedColors
          sx={{
            py: 1,
            display: "flex",
            flexDirection: "row",
            flexWrap: "wrap",
            rowGap: 1,
            columnGap: 5,
            alignItems: "center",
            justifyContent: "center",
            px: 2,
          }}>
          <Typography fontWeight={"lg"} textAlign={"center"}>
            Vous êtes connecté·e avec un compte entreprise.
          </Typography>
          <ExternalLink href={HelpPdf1}>Comment analyser les besoins d'un poste ?</ExternalLink>
          <ExternalLink href={HelpPdf2}>Comment rédiger une fiche de poste ?</ExternalLink>
        </Sheet>
      </Collapse>
      <Container
        {...props}
        component={"header"}
        sx={{
          py: 3,
          gap: {xs: 2, md: 3},
          bgcolor: "background.surface",
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}>
        <Box
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

          <Box
            onClick={() => navigate("/")}
            component={"img"}
            src={EssaiPossibleLogo}
            height={{xs: 40, md: 50}}
          />
        </Box>

        {props.children}
      </Container>
    </>
  );
}

function Footer(props) {
  const {t} = useTranslation();
  return (
    <Box component="footer" className="Footer" {...props}>
      <Sheet color={"neutral"} variant={"solid"} invertedColors sx={{overflow: "hidden"}}>
        <Container>
          <Grid container spacing={6} py={8} alignItems="center">
            <Grid xs={12} md={9}>
              {props.children}
            </Grid>
            <Grid xs={12} md={3}>
              <Stack gap={2} alignItems={"center"}>
                <Box component={"img"} src={TousTesPossiblesLogoWhite} width={"100%"} />
                <Typography fontSize={"lg"}>
                  {t("footer.projectFundedBy")}{" "}
                  <Link href={"https://toustespossibles.fr"} target="_blank">
                    toustespossibles.fr
                  </Link>
                </Typography>
                <Link
                  component={ReactRouterLink}
                  to={"/cgu"}
                  fontSize={"sm"}
                  color={"white"}
                  mt={2}>
                  CGU et mentions légales
                </Link>
              </Stack>
            </Grid>
          </Grid>
        </Container>
      </Sheet>
    </Box>
  );
}

function Main(props) {
  return <Box {...props} />;
}

function SideDrawer({onClose, ...props}) {
  return (
    <Box
      {...props}
      sx={[
        {position: "fixed", width: "100%", height: "100%"},
        ...(Array.isArray(props.sx) ? props.sx : [props.sx]),
      ]}>
      <Box
        role="button"
        onClick={onClose}
        sx={{
          position: "absolute",
          inset: 0,
          bgcolor: (theme) => `rgba(${theme.vars.palette.neutral.darkChannel} / 0.8)`,
        }}
      />
      <Sheet
        sx={{
          minWidth: 256,
          width: "max-content",
          height: "100%",
          p: 2,
        }}>
        {props.children}
      </Sheet>
    </Box>
  );
}

export function HeroBanner({
  noBackground = false,
  invertedColors = true,
  component: Component = Sheet,
  ...props
}) {
  return (
    <Component
      variant="solid"
      color="neutral"
      invertedColors={invertedColors}
      {...props}
      sx={[{py: 8}, ...(Array.isArray(props.sx) ? props.sx : [props.sx])]}>
      {/* Image background */}
      {!noBackground && (
        <>
          <Box
            sx={{
              position: "absolute",
              width: "100%",
              height: "100%",
              zIndex: 0,
              top: 0,
              right: 0,
              opacity: props.opacity || 0.35,
              backgroundImage: `url("${HeroHomeImage}")`,
              backgroundPositionY: "30%",
              backgroundPositionX: "70%",
            }}
          />
          {/* Gradient background to improve readability of text on the image */}
          <Box
            sx={(theme) => ({
              position: "absolute",
              width: "100%",
              height: "100%",
              zIndex: 0,
              top: 0,
              right: 0,
              opacity: 0.5,
              backgroundImage: `linear-gradient(to right, ${theme.vars.palette.neutral.solidBg}, 75%,  transparent)`,
              backgroundPositionY: "30%",
              backgroundPositionX: "70%",
            })}
          />
        </>
      )}
      <Container sx={{position: "relative"}}>{props.children}</Container>
    </Component>
  );
}

export function PageContent({maxWidth, ...props}) {
  return (
    <Container maxWidth={maxWidth}>
      <Stack my={4} mb={6} mt={2} mx={2} {...props} />
    </Container>
  );
}

export const AuthButton = {
  MyMeetings: ({sx}) => (
    <Button component={ReactRouterLink} sx={sx} to={"/my-meetings"}>
      {t("nav.myMeetings")}
    </Button>
  ),
  CompanyOffersList: ({currentUser, small}) => {
    const navigate = useNavigate();
    const {companyId: currentCompanyId} = useParams();

    const companiesLength = currentUser.companies.length;

    const displayMenu = small || companiesLength > 1;

    const [anchorEl, setAnchorEl] = React.useState(null);
    const handleClose = () => setAnchorEl(null);

    const handleNavigateToCompany = (id) => () => {
      navigate(`/company/${id}`);
      handleClose();
    };
    const open = !!anchorEl;

    const buttonProps = small
      ? {
          children: <PersonRoundedIcon />,
          variant: "solid",
        }
      : {
          startDecorator: <ApartmentRoundedIcon />,
          endDecorator: companiesLength > 1 && <KeyboardArrowDownIcon />,
          children: t("company.myCompany", {count: companiesLength}),
        };
    const ButtonComp = small ? IconButton : Button;

    const Item = ({companyId}) => {
      const company = useSelector((state) => selectCompanyById(state, companyId));
      const selected = currentCompanyId === companyId;
      return (
        <MenuItem
          {...(selected && {selected: true, variant: "soft"})}
          onClick={handleNavigateToCompany(companyId)}>
          {company.name}
        </MenuItem>
      );
    };

    return (
      <>
        <ButtonComp
          id="companies-button"
          aria-controls={open ? "companies-menu" : undefined}
          aria-haspopup="true"
          aria-expanded={open ? "true" : undefined}
          onClick={(event) => {
            if (displayMenu) {
              event.stopPropagation();
              setAnchorEl(event.currentTarget);
            } else {
              handleNavigateToCompany(currentUser.companies[0])();
            }
          }}
          {...buttonProps}
        />
        {displayMenu && (
          <Menu
            id="companies-menu"
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            aria-labelledby="companies-button">
            {small && (
              <>
                <MenuItem
                  onClick={() => {
                    navigate("/account");
                    handleClose();
                  }}>
                  Mon compte
                </MenuItem>
                <Divider sx={{mb: 1}} />
              </>
            )}
            {currentUser.companies.map((companyId) => (
              <Item companyId={companyId} key={companyId} />
            ))}
          </Menu>
        )}
      </>
    );
  },
  Account: ({sx, currentUser}) => (
    <Button
      component={ReactRouterLink}
      sx={sx}
      to={"/account"}
      variant={"soft"}
      color={"neutral"}
      startDecorator={<PersonRoundedIcon />}>
      {currentUser.firstName}
    </Button>
  ),
  LogIn: ({sx}) => (
    <Button
      component={ReactRouterLink}
      sx={sx}
      to={"/login"}
      variant={"solid"}
      startDecorator={<PersonRoundedIcon />}>
      {t("nav.logIn")}
    </Button>
  ),
  LogInShort: ({sx, currentUser}) => {
    const isCompanyAccount = currentUser?.companies?.length > 0;
    return (
      <ReactRouterLink
        to={
          currentUser
            ? isCompanyAccount
              ? `/company/${currentUser.companies[0]}`
              : "/my-meetings"
            : "/login"
        }>
        <IconButton sx={sx} variant={"solid"}>
          <PersonRoundedIcon />
        </IconButton>
      </ReactRouterLink>
    );
  },
  SignUp: ({sx}) => (
    <Button
      component={ReactRouterLink}
      to={"/signup"}
      variant="soft"
      color="neutral"
      sx={sx}
      startDecorator={<CreateRoundedIcon />}>
      {t("nav.signUp")}
    </Button>
  ),
};

const Layout = {
  Root,
  Navigation,
  SideDrawer,
  Main,
  Footer,
};

export default Layout;
