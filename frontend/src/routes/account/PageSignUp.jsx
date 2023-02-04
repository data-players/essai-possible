import {AuthComponent} from "./AuthComponent.jsx";
import Card from "@mui/joy/Card";
import Button from "@mui/joy/Button";
import {Link as ReactRouterLink} from "react-router-dom";
import Stack from "@mui/joy/Stack";
import Typography from "@mui/joy/Typography";
import PageAuthStructure from "./PageAuthStructure.jsx";

/**
 * @param companyMode boolean true = company mode | false = candidate mode
 * @param logInMode true = logIn | false = signUp
 */
export default function PageSignUp({companyMode = false}) {
  return (
    <PageAuthStructure title={"Nouveau compte" + (companyMode ? " entreprise" : "")}>
      <Card size={"lg"}>
        <Stack gap={3}>
          <AuthComponent redirect companyMode={companyMode} />
        </Stack>
      </Card>

      <Card size={"lg"}>
        <Stack gap={3}>
          <Typography level={"h5"} textAlign={"center"}>
            {companyMode ? "Vous êtes candidat·e ?" : "Vous êtes une entreprise ?"}
          </Typography>
          <Button
            variant={"soft"}
            color={"neutral"}
            component={ReactRouterLink}
            to={companyMode ? "/signup" : "/company/signup"}>
            Nouveau compte {!companyMode ? " entreprise" : " candidat·e"}
          </Button>
        </Stack>
      </Card>
    </PageAuthStructure>
  );
}
