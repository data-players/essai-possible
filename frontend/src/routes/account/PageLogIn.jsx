import {AuthComponent} from "./AuthComponent.jsx";
import Card from "@mui/joy/Card";
import {useTranslation} from "react-i18next";
import Button from "@mui/joy/Button";
import {Link as ReactRouterLink} from "react-router-dom";
import Stack from "@mui/joy/Stack";
import Typography from "@mui/joy/Typography";
import PageAuthStructure from "./PageAuthStructure.jsx";
import queryString from "query-string";
import {ExternalLink, HelpBox} from "../../components/atoms.jsx";
import LaunchRoundedIcon from "@mui/icons-material/LaunchRounded.js";
import * as React from "react";

export default function PageLogIn() {
  const {t} = useTranslation();
  const {loggedOut} = queryString.parse(window.location.search);

  // If loggedOut is equal to something else than "undefined", then it means the query arg loggedOut was used
  const displayLoggedOutMessage = loggedOut !== undefined;

  return (
    <PageAuthStructure title={t("nav.logIn")}>
      {displayLoggedOutMessage && (
        <HelpBox color={"success"}>
          <Typography fontWeight={"lg"}>Déconnexion réussie</Typography>
          <Typography>Vous vous êtes déconnecté·e du site Essai Possible.</Typography>
          <Typography>
            Pour vous déconnecter complètement de votre compte Les Communs, cliquez sur le lien
            ci-dessous.
          </Typography>
          <ExternalLink
            href={"https://login.lescommuns.org/auth/realms/master/account"}
            startDecorator={<LaunchRoundedIcon />}>
            Voir mon compte Les Communs
          </ExternalLink>
        </HelpBox>
      )}

      <Card size={"lg"}>
        <Stack gap={3}>
          <AuthComponent logInMode redirect />
        </Stack>
      </Card>

      <Card size={"lg"}>
        <Stack gap={3}>
          <Typography level={"h5"} textAlign={"center"}>
            Vous êtes nouveau sur Essai Possible ?
          </Typography>

          <Button variant={"soft"} color={"primary"} component={ReactRouterLink} to={"/signup"}>
            Créer un compte
          </Button>
        </Stack>
      </Card>
    </PageAuthStructure>
  );
}
