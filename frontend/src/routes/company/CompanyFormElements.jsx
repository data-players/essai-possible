import {CheckboxGroupSemantic} from "../../components/atoms.jsx";
import Textarea from "@mui/joy/Textarea";
import Box from "@mui/joy/Box";
import React from "react";
import {FormInput} from "../../components/forms.jsx";
import {
  selectAllSectors,
  selectSectorsReady,
  useFetchSectorsQuery,
} from "../offers/companies-slice.js";
import {useSelector} from "react-redux";

export function CompanyFormElements({register, setFieldValue, baseFormPath}) {
  const base = baseFormPath ? `${baseFormPath}.` : "";
  useFetchSectorsQuery();
  const sectorsReady = useSelector(selectSectorsReady);
  const sectors = useSelector(selectAllSectors);
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

      {sectorsReady && (
        <FormInput
          component={CheckboxGroupSemantic}
          wrapperComponent={Box}
          label={"Secteurs"}
          name={base + "sectors"}
          register={register}
          onChange={(value) => setFieldValue(base + "sectors", value)}
          options={sectors}
        />
      )}
    </>
  );
}
