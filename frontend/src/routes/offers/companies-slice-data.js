import {loremIpsum} from "lorem-ipsum";
import {dateTimeISOString, omit} from "../../app/mockUtils.js";

const goalOptions = ["Découverte métier/confirmation de projet pro", "Recrutement"];
const sectorsOptions = [
  "Agriculture, sylviculture et pêche",
  "Industries extractives",
  "Production et distribution d’électricité, de gaz, de vapeur et d’air conditionné",
  "Production et distribution d’eau; assainissement, gestion des déchets et dépollution",
  "Construction",
  "Commerce, réparation d’automobiles et de motocycles",
  "Transport et entreprosage",
  "Hébergement et restauration",
  "Information et communication",
  "Activités financières et d’assurances",
  "Activités immobilières",
  "Activités spécialisées scientifiques et techniques",
  "Activités de services administratifs et de soutien",
  "Administration publique",
  "Enseignement",
  "Santé humaine et action sociale",
  "Autres activités de service",
  "Activités des ménages en tant qu'employeurs",
];

// Ful data mock
export const fullCompanies = [
  {
    id: 1,
    name: "P&V Group",
    description: loremIpsum({count: 3}),
    sectors: [sectorsOptions[1], sectorsOptions[8]],
  },
  {
    id: 2,
    name: "TiBillet",
    description: loremIpsum({count: 3}),
    sectors: [sectorsOptions[5], sectorsOptions[8]],
  },
  {
    id: 3,
    name: "Enercoop",
    description: loremIpsum({count: 3}),
    sectors: [sectorsOptions[1], sectorsOptions[8]],
    slots: [
      {id: 11, start: dateTimeISOString("2023-3-23 15:30"), duration: 30},
      {id: 12, start: dateTimeISOString("2023-3-23 16:0"), duration: 30},
      {id: 13, start: dateTimeISOString("2023-3-24 15:30"), duration: 30},
      {id: 14, start: dateTimeISOString("2023-3-24 16:0"), duration: 30},
      {id: 15, start: dateTimeISOString("2023-3-25 16:30"), duration: 30},
    ],
  },
];

// List data mock with less attributes
export const lightCompaniesList = fullCompanies.map((offer) => omit(["tasks", "skills"], offer));
