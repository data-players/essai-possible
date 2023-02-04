import {FormInput} from "../../components/forms.jsx";
import * as React from "react";

export function UserFormElements({register, baseFormPath}) {
  const base = baseFormPath ? `${baseFormPath}.` : "";
  return (
    <FormInput
      label="Numéro de téléphone"
      name={base + "phone"}
      placeholder="+33 6 12 34 56 78"
      type={"tel"}
      register={register}
    />
  );
}
