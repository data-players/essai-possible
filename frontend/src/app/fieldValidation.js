import * as yup from "yup";

export const firstName = yup.string("Entrez un prénom").required("Le prénom est requis");
export const lastName = yup.string("Entrez un nom").required("Le nom est requis");

export const email = yup
  .string("Entrez un email")
  .email("Entrez un email valide")
  .required("L'email est requis");

export const phone = yup
  .string("Entrez un numéro de téléphone")
  .matches(
    /^(?:(?:(?:\+|00)\d{2}[ ]?(?:\(0\)[ ]?)?)|0){1}[1-9]{1}([ .-]?)(?:\d{2}\1?){3}\d{2}$/, // Match french phone numbers in national and international format
    "Entrez un numéro de téléphone valide"
  )
  .required("Le numéro de téléphone est requis");

export const password = yup.string().min(8, "Le mot de passe doit faire au moins 8 caractères");
export const newPassword = password.optional();
export const confirmNewPassword = yup
  .string()
  .oneOf([yup.ref("newPassword"), null], "Les mots de passe doivent correspondre");
