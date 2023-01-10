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
import TousTesPossiblesLogoBlue from "../assets/tous-tes-possibles-logo-blue.svg";
import {useNavigate} from "react-router-dom";
import Slide from "@mui/material/Slide";
import {Fade} from "@mui/material";
import Container from "@mui/joy/Container";
import Link from "@mui/joy/Link";

function Root(props) {
  return (
    <Box
      {...props}
      sx={[{bgcolor: "background.surface"}, ...(Array.isArray(props.sx) ? props.sx : [props.sx])]}
    />
  );
}

function Navigation(props) {
  const [drawerOpen, setDrawerOpen] = React.useState(false);

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
            {props.mobileDrawerContent}
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

      {/* Mobile side drawer */}

      <Container
        {...props}
        component={"header"}
        sx={[
          {
            py: 3,
            gap: {xs: 2, md: 3},
            bgcolor: "background.surface",
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          },
          ...(Array.isArray(props.sx) ? props.sx : [props.sx]),
        ]}>
        {/* Website logo and menu button */}
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
            src={TousTesPossiblesLogoBlue}
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

export function HeroBanner(props) {
  const Component = props.component || Sheet;
  return (
    <Component
      variant="solid"
      color="neutral"
      invertedColors
      {...props}
      sx={[{py: 8}, ...(Array.isArray(props.sx) ? props.sx : [props.sx])]}>
      {/* Image background */}
      {!props.noBackground && (
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

export function PageContent(props) {
  return (
    <Container>
      <Stack my={4} mb={6} mt={2} mx={2} {...props} />
    </Container>
  );
}

const Layout = {
  Root,
  Navigation,
  SideDrawer,
  Main,
  Footer,
};

export default Layout;