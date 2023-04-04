import * as yup from "yup";
import {parsePhoneNumber ,AsYouType} from "libphonenumber-js";

export const required = yup.mixed().required("Ce champ est requis");

export const requiredString = yup
  .string("Ce champ n'est pas valide.")
  .required("Ce champ est requis");
export const requiredUrl = requiredString.url("Ce champ doit être une URL valide.");
export const requiredEmail = requiredString.email("Entrez un email valide");
// export const requiredPhone = requiredString.matches(
//   /^(?:(?:(?:\+|00)\d{2}[ ]?(?:\(0\)[ ]?)?)|0){1}[1-9]{1}([ .-]?)(?:\d{2}\1?){3}\d{2}$/, // Match french phone numbers in national and international format
//   "Entrez un numéro de téléphone valide"
// );
export const requiredPhone = requiredString.matches(
  /^(?:(?:(?:\+|00)\d{2}[ ]?(?:\(0\)[ ]?)?)|0){1}[1-9]{1}([ .-]?)(?:\d{2}\1?){3}\d{2}$/, // Match french phone numbers in national and international format
  "Entrez un numéro de téléphone valide"
);

let max = 64;
export const requiredInternationalPhone = requiredString.test({
  name: 'internationalPhone',
  exclusive: true,
  params: { },
  message: '${path} Entrez un numéro de téléphone valide',
  test: (value) =>{
    // console.log('allo')
    // const asYouType = new AsYouType('FR').input(value);
    // console.log('asYouType',asYouType)
    // console.log('phone value',value)
    try{
      const phoneNumber = parsePhoneNumber(value);
      // console.log('phoneNumber',phoneNumber);
      const isValid = phoneNumber.isValid();
      // console.log(isValid);
      return isValid;
    } catch (e) {
      return false;
    }

  } 
});

export const requiredPositiveNumber = yup
  .number("Ce champ n'est pas valide.")
  .positive("Ce nombre doit être positif.")
  .required("Ce champ est requis");

export const requiredTrueBoolean = yup
  .boolean()
  .isTrue("Vous devez valider ce champ.")
  .required("Ce champ est requis");

export const requiredArray = yup.array().min(1, "Donnez au moins une réponse.");

export const password = yup.string().min(8, "Le mot de passe doit faire au moins 8 caractères");
export const confirmNewPassword = yup
  .string()
  .oneOf([yup.ref("password"), null], "Les mots de passe doivent correspondre");
