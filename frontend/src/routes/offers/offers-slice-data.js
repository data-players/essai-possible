import {loremIpsum} from "lorem-ipsum";
import dayjs from "dayjs";

const dateTimeISOString = (date) => dayjs(date, "YYYY-M-DD HH:m").toISOString();
const dateISOString = (date) => dayjs(date, "YYYY-M-DD").toISOString();
const omit = (keys, obj) =>
  Object.fromEntries(Object.entries(obj).filter(([k]) => !keys.includes(k)));

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
export const fullOffers = [
  {
    id: "titredeloffre",
    createdAt: dateTimeISOString("2023-1-4 16:22"),
    title: "Titre de l'offre",
    company: {
      name: "P&V Group",
      description: loremIpsum({count: 3}),
      sectors: [sectorsOptions[1], sectorsOptions[8]],
    },
    location: "Paris",
    goal: goalOptions[0],
    startDate: dateISOString("2023-2-25"),
    description: loremIpsum({count: 2, units: "paragraph"}),
    tasks: loremIpsum({count: 1, units: "paragraph"}),
    skills: new Array(3).fill(0).map(() => loremIpsum({count: 4, units: "words"})),
    slots: [
      {start: dateTimeISOString("2023-3-23 16:30"), duration: 30},
      {start: dateTimeISOString("2023-3-23 16:0"), duration: 30},
      {start: dateTimeISOString("2023-3-24 15:30"), duration: 30},
      {start: dateTimeISOString("2023-3-24 16:0"), duration: 30},
      {start: dateTimeISOString("2023-3-25 16:30"), duration: 30},
      {start: dateTimeISOString("2023-3-23 15:30"), duration: 30},
    ],
  },
  {
    id: "comptable",
    createdAt: dateTimeISOString("2023-1-4 16:23"),
    title: "Comptable",
    company: {
      name: "TiBillet",
      description: loremIpsum({count: 3}),
      sectors: [sectorsOptions[5], sectorsOptions[8]],
    },
    location: "La Réunion",
    sectors: [sectorsOptions[6], sectorsOptions[7]],
    goal: goalOptions[0],
    startDate: dateISOString("2023-2-4"),
    description: loremIpsum({count: 2, units: "paragraph"}),
    tasks: loremIpsum({count: 1, units: "paragraph"}),
    skills: new Array(3).fill(0).map(() => loremIpsum({count: 4, units: "words"})),
  },
  {
    id: "devcooperatiffront",
    title: "Dev Coopératif front",
    company: {
      name: "TiBillet",
      description: loremIpsum({count: 3}),
      sectors: [sectorsOptions[4], sectorsOptions[8]],
    },
    location: "La Réunion",
    goal: goalOptions[1],
    startDate: dateISOString("2023-3-8"),
    description: loremIpsum({count: 2, units: "paragraph"}),
    tasks: loremIpsum({count: 1, units: "paragraph"}),
    skills: new Array(3).fill(0).map(() => loremIpsum({count: 4, units: "words"})),
    slots: [{start: dateTimeISOString("2023-3-23 15:30"), duration: 30}],
  },
  {
    id: "devcooperatifback",
    createdAt: dateTimeISOString("2023-1-4 16:15"),
    title:
      "Très long vraiment très long titre d'une très longue offre qui s'affiche difficilement car elle est très longue",
    company: {
      name: "P&V Group",
      description: loremIpsum({count: 3}),
      sectors: [sectorsOptions[2], sectorsOptions[6], sectorsOptions[3]],
    },
    location: "Paris",
    goal: goalOptions[0],
    startDate: new Date(2023, 2, 4).toISOString(),
    description: loremIpsum({count: 2, units: "paragraph"}),
    tasks: loremIpsum({count: 1, units: "paragraph"}),
    skills: new Array(3).fill(0).map(() => loremIpsum({count: 4, units: "words"})),
    slots: [
      {start: dateTimeISOString("2023-3-23 15:30"), duration: 30},
      {start: dateTimeISOString("2023-3-23 16:0"), duration: 30},
      {start: dateTimeISOString("2023-3-24 16:0"), duration: 30},
      {start: dateTimeISOString("2023-3-25 16:30"), duration: 30},
    ],
  },
  {
    id: "consultantenergiesrenouvelables",
    createdAt: dateTimeISOString("2023-1-4 16:28"),
    title: "Consultant énergies renouvelables",
    company: {
      name: "Enercoop",
      description: loremIpsum({count: 3}),
      sectors: [sectorsOptions[1], sectorsOptions[8]],
    },
    location: "Tours",
    goal: goalOptions[1],
    startDate: dateISOString("2023-4-12"),
    description: loremIpsum({count: 2, units: "paragraph"}),
    tasks: loremIpsum({count: 1, units: "paragraph"}),
    skills: new Array(3).fill(0).map(() => loremIpsum({count: 4, units: "words"})),
    slots: [
      {start: dateTimeISOString("2023-3-23 15:30"), duration: 30},
      {start: dateTimeISOString("2023-3-23 16:0"), duration: 30},
      {start: dateTimeISOString("2023-3-24 15:30"), duration: 30},
      {start: dateTimeISOString("2023-3-24 16:0"), duration: 30},
      {start: dateTimeISOString("2023-3-25 16:30"), duration: 30},
    ],
  },
];

// List data mock with less attributes
export const lightOffersList = fullOffers.map((offer) => omit(["tasks", "skills"], offer));
