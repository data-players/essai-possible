import {FormInput} from "../../components/forms.jsx";
import {PhoneInput} from "../../components/atoms.jsx";
import Box from "@mui/joy/Box";
import * as React from "react";

export function UserFormElements({register,setFieldValue, baseFormPath}) {
  const base = baseFormPath ? `${baseFormPath}.` : "";
  return (
    <>
      {/* <FormInput
        label="Numéro de téléphone"
        name={base + "phone"}
        placeholder="+33 6 12 34 56 78"
        register={register}
      /> */}
      <FormInput
          component={PhoneInput}
          name={base + "phone"}
          wrapperComponent={Box}
          label={"Numéro de téléphone"}
          register={register}
          onChange={(value) => setFieldValue(base + "phone", value)}
          disabled={false}
        />
      {/* <FormInput
        label="Numéro de téléphone"
        name={base + "phone"}
        placeholder="+33 6 12 34 56 78"
        type={"tel"}
        register={register}
      /> */}
    </>
  );
}
