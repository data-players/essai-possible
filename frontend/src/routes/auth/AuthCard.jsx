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

export function AuthCard() {
  const {t} = useTranslation();
  const currentUser = useSelector(selectCurrentUser());
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
    <Card variant={"outlined"} size={"lg"}>
      <Typography>
        <strong> Bienvenue {currentUser.firstName} !</strong> Vos informations personnelles seront
        communiquées dans votre demande.
      </Typography>
    </Card>
  ) : (
    <>
      <Card variant={"outlined"} size={"lg"}>
        <Content connectionMode={"signUp"} />
      </Card>
      <Card variant={"outlined"} size={"lg"}>
        <Content connectionMode={"logIn"} />
      </Card>
    </>
  );
}
