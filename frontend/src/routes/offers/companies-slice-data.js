import {loremIpsum} from "lorem-ipsum";
import {omit} from "../../app/mockUtils.js";
import {sorter} from "../../app/utils.js";

export const sectorsOptions = [
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
].sort(sorter.text);

// Ful data mock
export const fullCompanies = [
  {
    id: "http://localhost:3000/organizations/pvgroep",
    name: "P&V Grouuup",
    website: "https://www.pvgroep.coop/",
    description: loremIpsum({count: 3}),
    sectors: [sectorsOptions[1], sectorsOptions[8]],
  },
  {
    id: "http://localhost:3000/organizations/tibillet",
    name: "TiBillet",
    website: "https://tibillet.org",
    description: loremIpsum({count: 3}),
    sectors: [sectorsOptions[5], sectorsOptions[8]],
  },
  {
    id: "http://localhost:3000/organizations/enercoop",
    name: "Enercoop",
    website: "https://www.enercoop.fr/",
    description: loremIpsum({count: 3}),
    sectors: [sectorsOptions[1], sectorsOptions[8]],
  },
];

// List data mock with less attributes
export const lightCompaniesList = fullCompanies.map((company) =>
  omit(["description", "website"], company)
);
