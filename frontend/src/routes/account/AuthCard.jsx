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
export function AuthCard({ redirectUrl, redirectComplete ,defaultConnectionMode="signUp", welcomeInfo, helpBoxConnected}) {
  const {t} = useTranslation();
  const currentUser = useSelector(selectCurrentUser);
  // const [openedCard, setOpenedCard] = useState(defaultConnectionMode);

  // const Content = ({connectionMode}) => {
  //   const isLogInMode = connectionMode === "logIn";
  //   const nextConnectionMode = connectionMode==="signUp"?"logIn":"signUp";

  //   return (
  //     <>
  //       <Stack alignItems={"center"} gap={2}>
  //       <AuthComponent logInMode={isLogInMode} redirectUrl={redirectUrl}/>
            
  //             {/* <Typography level={"h4"}>
  //               {isLogInMode ? "Nouveau sur Essai Possible ?" : "Vous avez déjà un compte ?"}
  //             </Typography>
  //             <Button
  //               startDecorator={<CreateRoundedIcon />}
  //               color={isLogInMode ? "primary" : "neutral"}
  //               onClick={() => setOpenedCard(nextConnectionMode)}
  //               >
  //               {t(`nav.${nextConnectionMode}`)}
  //             </Button>
  //            */}

  //             <Typography level={"h4"}>
  //               {"Nouveau sur Essai Possible ou Vous avez déjà un compte ?"}
  //             </Typography>
  //             {/* <Button
  //               startDecorator={<CreateRoundedIcon />}
  //               color={isLogInMode ? "primary" : "neutral"}
  //               onClick={() => setOpenedCard(nextConnectionMode)}
  //               >
  //               {t(`nav.${nextConnectionMode}`)}
  //             </Button> */}
          
  //       </Stack>
  //     </>
  //   );
  // };

  // return (<></>)

  return currentUser ? (
    <HelpBox color={"success"}>
      <Typography fontSize={"lg"} textColor={"text.secondary"}>
        {helpBoxConnected}
      </Typography>
      <AuthComponent redirectUrl={redirectUrl} redirectComplete={redirectComplete} welcomeInfo={welcomeInfo}/>
    </HelpBox>
  ) : (
    
    <Card variant={"outlined"}>
      <AuthComponent redirectUrl={redirectUrl} redirectComplete={redirectComplete} welcomeInfo={welcomeInfo}/>
    </Card>
    
  );
}
