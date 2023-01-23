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
            <>
              <Typography level={"h5"}>
                {isLogInMode ? "Se connecter" : "Nouveau compte"}
              </Typography>
              <AuthComponent mode={connectionMode} />
            </>
          ) : (
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
    <Stack gap={1}>
      <Typography fontSize={"lg"} textColor={"text.secondary"}>
        <strong>Bienvenue {currentUser.firstName} !</strong> Vos informations personnelles seront
        communiquées dans votre demande.{" "}
        <Link component={ReactRouterLink} size={"sm"} to={"/account"} sx={{opacity: 0.7}}>
          Modifier mes informations
        </Link>
      </Typography>
    </Stack>
  ) : (
    <>
      <Card variant={"soft"} invertedColors>
        <Content connectionMode={"signUp"} />
      </Card>
      <Card variant={"soft"} invertedColors>
        <Content connectionMode={"logIn"} />
      </Card>
    </>
  );
}
