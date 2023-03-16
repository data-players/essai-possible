import React from "react";
import Stack from "@mui/joy/Stack";
import {SimpleBanner, ButtonWithConfirmation} from "../../components/atoms.jsx";
import {
  companyValidationSchema,
  selectCompanyById,
  selectCompanyReady,
  useAddCompanyMutation,
  useUpdateCompanyMutation,
} from "../offers/companies-slice.js";
import {useNavigate, useParams} from "react-router-dom";
import {useTranslationWithDates} from "../../app/i18n.js";
import {useSelector} from "react-redux";
import EditFormComponent from "../../components/EditFormComponent.jsx";
import Typography from "@mui/joy/Typography";
import Button from "@mui/joy/Button"
import Grid from "@mui/joy/Grid";
import Card from "@mui/joy/Card";
import Divider from "@mui/joy/Divider";
import ListItem from "@mui/joy/ListItem";
import {
  ListPageContent,
} from "../../components/atoms.jsx";
import {HeroBanner, PageContent} from "../../components/Layout.jsx";

const AffiliatesItem = function({
  value,
  context
}) {
  const [updateCompany, {isLoading: isUpdatingCompany}] = useUpdateCompanyMutation();
  return (
    <ListItem>
      <Card
      variant={"soft"}
      sx={{width: "100%"}}>
        <Grid container spacing={2}>
          <Grid xs={10}>
            <Typography xs={10} key={value.id}>{value.label}</Typography>
          </Grid>
          <Grid xs={2}>
            <ButtonWithConfirmation
              xs={2} 
              color={"danger"}
              onClick={async (event) => {
                event.stopPropagation();
                const company={
                  ...context,
                  affiliates:context.affiliates.filter(a=>a.id!=value.id)
                }
                updateCompany(company);
              }}
              areYouSureText={
                "Êtes vous sûr·e de vouloir supprimer retirer cette personne es utlisateurs rattachés"
              }>
              Supprimer
            </ButtonWithConfirmation>
          </Grid>
        </Grid>
      </Card>
    </ListItem>
  );
}

const AskedAfiliationItem = function({
  value,
  context
}) {
  const [updateCompany, {isLoading: isUpdatingCompany}] = useUpdateCompanyMutation();
  return (
    <ListItem>
      <Card
      variant={"soft"}
      sx={{width: "100%"}}
      >
        <Grid container spacing={2} >
          <Grid xs={10}>
            <Typography xs={10}  key={value.id}>{value.label}</Typography>
          </Grid>
          <Grid xs={2}>
            <Button
            xs={2} 
            color={"success"}
            onClick={async (event) => {
              event.stopPropagation();
              const company={
                ...context,
                affiliates:[...context.affiliates,value],
                askedAffiliation:context.askedAffiliation.filter(a=>a.id!=value.id)
              }
              updateCompany(company);
            }}>
            Attacher
          </Button>
          </Grid>
        </Grid>
      </Card>
    </ListItem>
  );
}

export default function PageEditCompanyUsers({mode}) {
  const isEditMode = mode === "edit";
  const navigate = useNavigate();
  const {t} = useTranslationWithDates();
  const {companyId} = useParams();

  const company = useSelector((state) => selectCompanyById(state, encodeURIComponent(companyId)));

  const companyReady = useSelector(selectCompanyReady);

  return (
    <PageContent>
      <Stack>
        <Typography level="h2">Utilisateurs rattachés</Typography>
        <ListPageContent
          ready={true}
          values={company.affiliates}
          item={AffiliatesItem}
          context={company}
          getKey={(value)=>(value.id?value.id:value)}
        />
        <Typography level="h2">Demande de rattachement</Typography>
        <ListPageContent
          ready={true}
          noResultsContent={"aucune demande de rattachement"}
          values={company.askedAffiliation}
          item={AskedAfiliationItem}
          context={company}
          getKey={(value)=>(value.id?value.id:value)}
        />
      </Stack>
    </PageContent>
  );
}
