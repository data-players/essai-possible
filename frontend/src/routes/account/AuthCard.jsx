import Card from "@mui/joy/Card";
import Typography from "@mui/joy/Typography";
import {AuthComponent} from "./AuthComponent.jsx";
import React, {useState} from "react";
import {useSelector} from "react-redux";
import {selectCurrentUser} from "../../app/auth-slice.js";
import Button from "@mui/joy/Button";
import Stack from "@mui/joy/Stack";
import CreateRoundedIcon from "@mui/icons-material/CreateRounded.js";
import {useTranslation} from "react-i18next";
import Link from "@mui/joy/Link";
import {Link as ReactRouterLink} from "react-router-dom";
import Collapse from "@mui/material/Collapse";
import {HelpBox} from "../../components/atoms";

// TODO not tested at all @Simon
// Je voulais faire un truc en mode :
// - connecté et user complété intégralement: petit encart vert pour dire "c'est cool t'es connecté et tout"
// - connecté mais user complété partiellement (manque des infos genre tel etc): permettre au user de compléter ses informations en utilisant le AuthComponent
// - si pas connecté du tout, deux boites "S'inscrire" et "Se connecter" qui se déplient quand on clique sur l'une d'elle, et font entrevoir des
export function AuthCard() {
  const {t} = useTranslation();
  const currentUser = useSelector(selectCurrentUser);
  const [openedCard, setOpenedCard] = useState();

  const Content = ({connectionMode}) => {
    const isLogInMode = connectionMode === "logIn";

    return (
      <>
        <Stack alignItems={"center"} gap={2}>
          {openedCard === connectionMode ? (
            // Card open: display the AuthComponent in sign up or log in mode
            <AuthComponent logInMode={connectionMode === "logIn"} />
          ) : (
            // Card not open: display title and action button
            <>
              <Typography level={"h4"}>
                {isLogInMode ? " Vous avez déjà un compte ?" : "Nouveau sur Essai Possible ?"}
              </Typography>
              <Button
                startDecorator={<CreateRoundedIcon />}
                color={isLogInMode ? "primary" : "neutral"}
                onClick={() => setOpenedCard(connectionMode)}>
                {t(`nav.${connectionMode}`)}
              </Button>
            </>
          )}
        </Stack>
      </>
    );
  };

  return currentUser ? (
    <HelpBox color={"success"}>
      <Typography fontSize={"lg"} textColor={"text.secondary"}>
        <strong>Bienvenue {currentUser.firstName} !</strong> Vos informations personnelles seront
        communiquées dans votre demande.{" "}
      </Typography>
      <Link component={ReactRouterLink} size={"sm"} to={"/account"} sx={{opacity: 0.7}}>
        Modifier mes informations
      </Link>
    </HelpBox>
  ) : (
    <>
      <Collapse in={!openedCard || openedCard === "signUp"}>
        <Card variant={"outlined"}>
          <Content connectionMode={"signUp"} />
        </Card>
      </Collapse>
      <Collapse in={!openedCard || openedCard === "logIn"}>
        <Card variant={"outlined"}>
          <Content connectionMode={"logIn"} />
        </Card>
      </Collapse>
    </>
  );
}
