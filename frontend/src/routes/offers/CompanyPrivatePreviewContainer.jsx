import {HeroBanner} from "../../components/Layout";
import Stack from "@mui/joy/Stack";
import Typography from "@mui/joy/Typography";
import Button from "@mui/joy/Button";
import {LoadingSpinner} from "../../components/atoms.jsx";
import Box from "@mui/joy/Box";
import {statusOptions} from "./offers-slice-data.js";
import CreateRoundedIcon from "@mui/icons-material/CreateRounded.js";
import VisibilityRoundedIcon from "@mui/icons-material/VisibilityRounded";
import VisibilityOffRoundedIcon from "@mui/icons-material/VisibilityOffRounded";
import React, {useMemo} from "react";
import {useUpdateOfferMutation} from "./offers-slice.js";
import {Link as ReactRouterLink, useNavigate} from "react-router-dom";
import Collapse from "@mui/material/Collapse";
import {useSelector} from "react-redux";
import {selectCurrentUser, selectCurrentUserReady} from "../../app/auth-slice.js";
import {selectCompanyById} from "./companies-slice.js";

export default function CompanyPrivatePreviewContainer({offer, children}) {
  const isDraft = offer.status === statusOptions[0];
  const isPublished = offer.status === statusOptions[1];
  const navigate = useNavigate();

  const company = useSelector((state) => selectCompanyById(state, offer.company)) || {};
  const currentUser = useSelector(selectCurrentUser);
  const currentUserReady = useSelector(selectCurrentUserReady);

  const isConnected = currentUserReady && currentUser?.id;
  const isCompanyMember = isConnected && currentUser.companies.includes(company.id);

  const [updateOffer, {isLoading: isUpdatingOffer}] = useUpdateOfferMutation();

  async function handlePublish() {
    await updateOffer({id: offer.id, status: statusOptions[1]}).unwrap();
  }
  async function handleDraft() {
    await updateOffer({id: offer.id, status: statusOptions[0]}).unwrap();
  }

  const StatusCollapse = useMemo(
    () =>
      ({open, title, description, button, color}) => {
        return (
          <Collapse in={open}>
            <HeroBanner noBackground color={color} sx={{py: 3, mb: {xs: 1, md: 0}}}>
              <Stack gap={1}>
                <Typography fontWeight={"lg"} fontSize={"lg"}>
                  {title}
                </Typography>
                <Typography>{description}</Typography>
                <Stack direction={"row"} flexWrap={"wrap"} gap={3} alignItems={"start"} mt={1}>
                  {button}
                  <Button
                    component={ReactRouterLink}
                    to={`/offers/${offer.id}/edit`}
                    variant={"soft"}
                    startDecorator={<CreateRoundedIcon />}>
                    Modifier
                  </Button>
                  <Button
                    component={ReactRouterLink}
                    to={`/company/${company.id}`}
                    variant={"soft"}>
                    Toutes les offres de "{company.name}"
                  </Button>
                </Stack>
              </Stack>
            </HeroBanner>
          </Collapse>
        );
      },
    []
  );

  // If the offer is not published, then a user must be connected at least.
  if (!isPublished) {
    // Wait for the user to be ready
    if (!currentUserReady) return <LoadingSpinner />;

    // If ready, then check if it has the right to be there. If not allowed, redirect to the offers list
    if (!isCompanyMember) {
      navigate("/offers");
      return;
    }
  }

  return isCompanyMember ? (
    <Box
      sx={{
        transition: "background 0.5s ease-in-out",
        pb: 6,
        mb: -6,
        bgcolor: isDraft && "warning.50",
      }}>
      <StatusCollapse
        open={isDraft}
        title={"Cette offre est en mode brouillon."}
        description={
          <>
            Elle n'est{" "}
            <strong>visible que par vous et les membres de l'entreprise "{company.name}"</strong>.
            Vous pouvez consultez cette page pour voir l'offre telle que les candidat·es la verront,
            et vérifier les informations avant la publication.
          </>
        }
        color={"warning"}
        button={
          <Button
            startDecorator={<VisibilityRoundedIcon />}
            onClick={handlePublish}
            loading={isUpdatingOffer}>
            Publier
          </Button>
        }
      />

      <StatusCollapse
        open={isPublished}
        title={"Cette offre est publiée."}
        description={
          <>
            Elle est désormais visible par les candidat·es, qui peuvent prendre rendez-vous avec
            l'entreprise.
          </>
        }
        color={"neutral"}
        button={
          <Button
            startDecorator={<VisibilityOffRoundedIcon />}
            onClick={handleDraft}
            loading={isUpdatingOffer}>
            Repasser en brouillon
          </Button>
        }
      />

      {children}
    </Box>
  ) : (
    children
  );
}