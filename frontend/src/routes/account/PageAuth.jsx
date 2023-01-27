import {AuthComponent} from "./AuthComponent.jsx";
import {SimpleBanner} from "../../components/atoms";
import {PageContent} from "../../components/Layout";
import Sheet from "@mui/joy/Sheet";
import Card from "@mui/joy/Card";
import {useTranslation} from "react-i18next";
import Button from "@mui/joy/Button";
import {Link as ReactRouterLink} from "react-router-dom";
import Stack from "@mui/joy/Stack";
import Typography from "@mui/joy/Typography";

/**
 * @param type candidate | company
 * @param mode logIn | signUp
 */
export default function PageAuth({mode, type}) {
  const {t} = useTranslation();

  const logInMode = mode === "logIn";
  const companyMode = type === "company";

  return (
    <>
      <SimpleBanner>
        {(logInMode ? t("nav.logIn") : "Nouveau compte") + (companyMode ? " entreprise" : "")}
      </SimpleBanner>
      <Sheet color={"neutral"} variant={"solid"} sx={{mt: -2, py: 6}}>
        <PageContent color="neutral" maxWidth={"sm"} gap={3}>
          <Card size={"lg"}>
            <Stack gap={3}>
              <AuthComponent mode={mode} redirect />

              <Button
                variant={"soft"}
                component={ReactRouterLink}
                to={logInMode ? "../signup" : "../login"}>
                {logInMode ? "Créer un compte" : "J'ai déjà un compte"}
              </Button>
            </Stack>
          </Card>
          <Card size={"lg"}>
            <Stack gap={3}>
              <Typography level={"h4"} textAlign={"center"}>
                {companyMode ? "Vous êtes candidat·e ?" : "Vous êtes une entreprise ?"}
              </Typography>
              <Button
                variant={"soft"}
                component={ReactRouterLink}
                to={companyMode ? "./.." : "company"}>
                {(logInMode ? t("nav.logIn") : "Nouveau compte") +
                  (!companyMode ? " entreprise" : " candidat·e")}
              </Button>
            </Stack>
          </Card>
        </PageContent>
      </Sheet>
    </>
  );
}
