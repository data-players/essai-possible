import {loremIpsum} from "lorem-ipsum";
import {dateISOString, dateTimeISOString, omit} from "../../app/mockUtils.js";

export const goalOptions = ["Découverte métier/confirmation de projet pro", "Recrutement"];

// Ful data mock
export const fullOffers = [
  {
    id: "titredeloffre",
    publishedAt: dateTimeISOString("2023-1-4 16:22"),
    title: "Titre de l'offre",
    company: 1,
    location: {
      label: "Place de la Cathédrale 67000 Strasbourg",
      context: "67, Bas-Rhin, Grand Est",
      city: "Strasbourg",
      lat: 48.581821,
      long: 7.750263,
    },
    goal: goalOptions[0],
    startDate: dateISOString("2023-2-25"),
    description: loremIpsum({count: 2, units: "paragraph"}),
    tasks: loremIpsum({count: 1, units: "paragraph"}),
    skills: new Array(3).fill(0).map(() => loremIpsum({count: 4, units: "words"})),
    slots: [1, 2, 3, 4, 5, 6],
  },
  {
    id: "comptable",
    publishedAt: dateTimeISOString("2023-1-4 16:23"),
    title: "Comptable",
    company: 2,
    location: {
      label: "Pre Neuf 01300 Saint-Germain-les-Paroisses",
      context: "01, Ain, Auvergne-Rhône-Alpes",
      city: "Saint-Germain-les-Paroisses",
      lat: 45.771117,
      long: 5.614924,
    },
    goal: goalOptions[0],
    startDate: dateISOString("2023-2-4"),
    description: loremIpsum({count: 2, units: "paragraph"}),
    tasks: loremIpsum({count: 1, units: "paragraph"}),
    skills: new Array(3).fill(0).map(() => loremIpsum({count: 4, units: "words"})),
  },
  {
    id: "devcooperatiffront",
    title: "Dev Coopératif front",
    company: 2,
    location: {
      label: "Pre Neuf 01300 Saint-Germain-les-Paroisses",
      context: "01, Ain, Auvergne-Rhône-Alpes",
      city: "Saint-Germain-les-Paroisses",
      lat: 45.771117,
      long: 5.614924,
    },
    goal: goalOptions[1],
    startDate: dateISOString("2023-3-8"),
    description: loremIpsum({count: 2, units: "paragraph"}),
    tasks: loremIpsum({count: 1, units: "paragraph"}),
    skills: new Array(3).fill(0).map(() => loremIpsum({count: 4, units: "words"})),
    slots: [16],
  },
  {
    id: "devcooperatifback",
    publishedAt: dateTimeISOString("2023-1-4 16:15"),
    title:
      "Très long vraiment très long titre d'une très longue offre qui s'affiche difficilement car elle est très longue",
    company: 1,
    location: {
      label: "Place de la Cathédrale 67000 Strasbourg",
      context: "67, Bas-Rhin, Grand Est",
      city: "Strasbourg",
      lat: 48.581821,
      long: 7.750263,
    },
    goal: goalOptions[0],
    startDate: new Date(2023, 2, 4).toISOString(),
    description: loremIpsum({count: 2, units: "paragraph"}),
    tasks: loremIpsum({count: 1, units: "paragraph"}),
    skills: new Array(3).fill(0).map(() => loremIpsum({count: 4, units: "words"})),
    slots: [7, 8, 9, 10],
  },
  {
    id: "consultenergies",
    publishedAt: dateTimeISOString("2023-1-4 16:28"),
    title: "Consultant énergies renouvelables",
    company: 3,
    location: {
      label: "Rue de la Ville en Pierre 44000 Nantes",
      context: "44, Loire-Atlantique, Pays de la Loire",
      city: "Nantes",
      lat: 47.224907,
      long: -1.526928,
    },
    goal: goalOptions[1],
    startDate: dateISOString("2023-4-12"),
    description: loremIpsum({count: 2, units: "paragraph"}),
    tasks: loremIpsum({count: 1, units: "paragraph"}),
    skills: new Array(3).fill(0).map(() => loremIpsum({count: 4, units: "words"})),
    slots: [11, 12, 13, 14, 15],
  },
];

// List data mock with less attributes
export const lightOffersList = fullOffers.map((offer) => omit(["tasks", "skills"], offer));
