import React from "react";
import Stack from "@mui/joy/Stack";
import {CheckboxGroup, FormInput, SimpleBanner} from "../../components/atoms.jsx";
import Textarea from "@mui/joy/Textarea";
import {
  selectCompanyById,
  selectCompanyReady,
  useAddCompanyMutation,
  useUpdateCompanyMutation,
} from "../offers/companies-slice.js";
import {useNavigate, useParams} from "react-router-dom";
import {useTranslationWithDates} from "../../app/i18n.js";
import {useSelector} from "react-redux";
import {sectorsOptions} from "../offers/companies-slice-data.js";
import Box from "@mui/joy/Box";
import {requiredArray, requiredString, requiredUrl} from "../../app/fieldValidation.js";
import * as yup from "yup";
import PageEdit from "../../components/PageEdit.jsx";
import Typography from "@mui/joy/Typography";
import Divider from "@mui/joy/Divider";

const validationSchema = yup.object({
  name: requiredString,
  description: requiredString,
  sectors: requiredArray,
  website: requiredUrl,
});

export default function PageEditCompany({mode}) {
  const isEditMode = mode === "edit";
  const navigate = useNavigate();
  const {t} = useTranslationWithDates();
  const {companyId} = useParams();

  const company = useSelector((state) => selectCompanyById(state, companyId));

  const companyReady = useSelector(selectCompanyReady);

  const [addCompany, {isLoading: isAddingCompany}] = useAddCompanyMutation();
  const [updateCompany, {isLoading: isUpdatingCompany}] = useUpdateCompanyMutation();

  const pageTitle = isEditMode
    ? t("companies.modifyACompany", {name: company.name})
    : t("companies.createANewCompany");

  async function onSubmit(values) {
    const method = isEditMode ? updateCompany : addCompany;
    const newCompany = await method({...values, id: company?.id}).unwrap();
    navigate("/company/" + newCompany.id);
  }

  // async function onDelete() {
  //   await deleteCompany(companyId).unwrap();
  //   openSnackbar("Suppression réussie");
  //   navigate("/company/" + companyId);
  // }

  return (
    <PageEdit
      ready={companyReady}
      pageBanner={<SimpleBanner>{pageTitle}</SimpleBanner>}
      initialValues={isEditMode ? company : {name: "", description: "", website: "", sectors: []}}
      validationSchema={validationSchema}
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
          <FormInput
            label={"Nom de l'entreprise"}
            placeholder={"nom"}
            register={register}
            name={"name"}
          />

          <FormInput
            component={Textarea}
            label={"Description de l'entreprise"}
            placeholder={"description"}
            register={register}
            name={"description"}
          />
          <FormInput
            label={"Site internet de l'entreprise"}
            placeholder={"https://mon-entreprise.com"}
            register={register}
            type={"url"}
            name={"website"}
          />
          <FormInput
            component={CheckboxGroup}
            wrapperComponent={Box}
            label={"Secteurs"}
            name={"sectors"}
            register={register}
            onChange={(value) => setFieldValue("sectors", value)}
            options={sectorsOptions}
          />

          <Divider sx={{my: 1}} />
        </Stack>
      )}
    </PageEdit>
  );
}
