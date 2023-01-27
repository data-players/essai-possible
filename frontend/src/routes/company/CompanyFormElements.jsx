import {CheckboxGroup} from "../../components/atoms.jsx";
import Textarea from "@mui/joy/Textarea";
import Box from "@mui/joy/Box";
import {sectorsOptions} from "../offers/companies-slice-data.js";
import React from "react";
import {FormInput} from "../../components/forms.jsx";

export function CompanyFormElements({register, setFieldValue, baseFormPath}) {
  const base = baseFormPath ? `${baseFormPath}.` : "";
  return (
    <>
      <FormInput
        label={"Nom de l'entreprise"}
        placeholder={"nom"}
        register={register}
        name={base + "name"}
      />

      <FormInput
        component={Textarea}
        label={"Description de l'entreprise"}
        placeholder={"description"}
        register={register}
        name={base + "description"}
      />

      <FormInput
        label={"Site internet de l'entreprise"}
        placeholder={"https://mon-entreprise.com"}
        register={register}
        type={"url"}
        name={base + "website"}
      />

      <FormInput
        component={CheckboxGroup}
        wrapperComponent={Box}
        label={"Secteurs"}
        name={base + "sectors"}
        register={register}
        onChange={(value) => setFieldValue(base + "sectors", value)}
        options={sectorsOptions}
      />
    </>
  );
}
