import {FormInput} from "../../components/atoms.jsx";
import * as React from "react";

export function UserFormElements({register}) {
  return (
    <>
      <FormInput label="Prénom" name={"firstName"} placeholder="prénom" register={register} />

      <FormInput label="Nom" name={"lastName"} placeholder="nom" register={register} />

      <FormInput
        label="Numéro de téléphone"
        name={"phone"}
        placeholder="+33 6 12 34 56 78"
        type={"tel"}
        register={register}
      />
    </>
  );
}
