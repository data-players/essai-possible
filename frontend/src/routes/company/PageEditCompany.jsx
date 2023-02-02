import React from "react";
import Stack from "@mui/joy/Stack";
import {SimpleBanner} from "../../components/atoms.jsx";
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
import Divider from "@mui/joy/Divider";
import {CompanyFormElements} from "./CompanyFormElements.jsx";

export default function PageEditCompany({mode}) {
  const isEditMode = mode === "edit";
  const navigate = useNavigate();
  const {t} = useTranslationWithDates();
  const {companyId} = useParams();

  const company = useSelector((state) => selectCompanyById(state, encodeURIComponent(companyId)));

  const companyReady = useSelector(selectCompanyReady);

  const [addCompany, {isLoading: isAddingCompany}] = useAddCompanyMutation();
  const [updateCompany, {isLoading: isUpdatingCompany}] = useUpdateCompanyMutation();

  const pageTitle = isEditMode
    ? t("companies.modifyACompany", {name: company.name})
    : t("companies.createANewCompany");

  async function onSubmit(values) {
    const method = isEditMode ? updateCompany : addCompany;
    const newCompany = await method({...values, id: company?.id}).unwrap();
    const newCompanyId = newCompany.id;
    navigate(`/company/${newCompanyId}`);
  }

  // async function onDelete() {
  //   await deleteCompany(companyId).unwrap();
  //   openSnackbar("Suppression réussie");
  //   navigate("/company/" + companyId);
  // }

  return (
    <EditFormComponent
      ready={companyReady}
      pageBanner={<SimpleBanner>{pageTitle}</SimpleBanner>}
      initialValues={isEditMode ? company : {name: "", description: "", website: "", sectors: []}}
      validationSchema={companyValidationSchema}
      onSubmit={onSubmit}
      isEditMode={isEditMode}
      helpBox={
        <>
          <Typography fontWeight={"lg"} fontSize={"lg"}>
            Vous éditez l'entreprise "{company.name}".
          </Typography>
          <Typography>
            Les informations de votre entreprise seront visibles par les candidat·es dans la liste
            des offres et dans le détail des offres.
          </Typography>
        </>
      }
      updateLoading={isAddingCompany || isUpdatingCompany}>
      {(register, {setFieldValue}) => (
        <Stack gap={3}>
          <CompanyFormElements setFieldValue={setFieldValue} register={register} />

          <Divider sx={{my: 1}} />
        </Stack>
      )}
    </EditFormComponent>
  );
}
