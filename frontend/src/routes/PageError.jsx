import {useRouteError} from "react-router-dom";
import {PageContent} from "../components/Layout";
import Typography from "@mui/joy/Typography";
import Card from "@mui/joy/Card";
import {useTranslation} from "react-i18next";

export default function PageError() {
  const {t} = useTranslation();
  const error = useRouteError();
  console.error(error);

  return (
    <PageContent gap={3}>
      <Typography level={"h1"}>{t("error.oops")}</Typography>
      <Typography>{t("error.aProblemOccurred")}</Typography>
      <Card variant={"soft"}>
        <pre>{error.statusText || error.message}</pre>
      </Card>
    </PageContent>
  );
}
