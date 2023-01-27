import {loremIpsum} from "lorem-ipsum";
import {dateTimeISOString, omit} from "../../app/mockUtils.js";

export const goalOptions = ["Découverte métier/confirmation de projet pro", "Recrutement"];
export const softSkillsOptions = [
  "Capacité d’adaptation",
  "Gestion du stress",
  "Travail en équipe",
  "Capacité à fédérer",
  "Sens de la communication",
  "Sens de l’organisation",
  "Rigueur",
  "Force de proposition",
  "Curiosité",
  "Persévérance",
  "Autonomie",
  "Capacité de décision",
  "Prise de recul",
  "Réactivité",
];

export const statusOptions = ["Brouillon", "Publiée", "Pourvue"];

// Ful data mock
export const fullOffers = [
  {
    id: "titredeloffre",
    status: statusOptions[1],
    publishedAt: dateTimeISOString("2023-1-4 16:22"),
    title: "Titre de l'offre",
    company: "pvgroep",
    location: {
      label: "Place de la Cathédrale 67000 Strasbourg",
      context: "67, Bas-Rhin, Grand Est",
      city: "Strasbourg",
      lat: 48.581821,
      long: 7.750263,
    },
    goal: goalOptions[0],
    description: loremIpsum({count: 2, units: "paragraph"}),
    workEnvironment: loremIpsum({count: 2}),
    softSkills: [softSkillsOptions[1], softSkillsOptions[7], softSkillsOptions[2]],
    duration: 7,
    timeSchedule: loremIpsum({count: 1}),
    meetingDetails: loremIpsum({count: 1}),
    mentorEmail: "mymentor@email.com",
    mentorPhone: "+33651274934",
    tasks: loremIpsum({count: 1, units: "paragraph"}),
    skills: new Array(3)
      .fill(0)
      .map(() => loremIpsum({count: 4, units: "words"}))
      .join("\n"),
    slots: [1, 2, 3, 4, 5, 6],
  },
  {
    id: "comptable",
    status: statusOptions[1],
    publishedAt: dateTimeISOString("2023-1-4 16:23"),
    title: "Comptable",
    company: "tibillet",
    location: {
      label: "Pre Neuf 01300 Saint-Germain-les-Paroisses",
      context: "01, Ain, Auvergne-Rhône-Alpes",
      city: "Saint-Germain-les-Paroisses",
      lat: 45.771117,
      long: 5.614924,
    },
    goal: goalOptions[0],
    description: loremIpsum({count: 2, units: "paragraph"}),
    workEnvironment: loremIpsum({count: 2}),
    softSkills: [softSkillsOptions[1], softSkillsOptions[7], softSkillsOptions[2]],
    duration: 7,
    timeSchedule: loremIpsum({count: 1}),
    meetingDetails: loremIpsum({count: 1}),
    mentorEmail: "mymentor@email.com",
    mentorPhone: "+33651274934",
    tasks: loremIpsum({count: 1, units: "paragraph"}),
    skills: new Array(3)
      .fill(0)
      .map(() => loremIpsum({count: 4, units: "words"}))
      .join("\n"),
  },
  {
    id: "devcooperatiffront",
    status: statusOptions[1],
    title: "Dev Coopératif front",
    company: "tibillet",
    location: {
      label: "Pre Neuf 01300 Saint-Germain-les-Paroisses",
      context: "01, Ain, Auvergne-Rhône-Alpes",
      city: "Saint-Germain-les-Paroisses",
      lat: 45.771117,
      long: 5.614924,
    },
    goal: goalOptions[1],
    description: loremIpsum({count: 2, units: "paragraph"}),
    workEnvironment: loremIpsum({count: 2}),
    softSkills: [softSkillsOptions[1], softSkillsOptions[7], softSkillsOptions[2]],
    duration: 7,
    timeSchedule: loremIpsum({count: 1}),
    meetingDetails: loremIpsum({count: 1}),
    mentorEmail: "mymentor@email.com",
    mentorPhone: "+33651274934",
    tasks: loremIpsum({count: 1, units: "paragraph"}),
    skills: new Array(3)
      .fill(0)
      .map(() => loremIpsum({count: 4, units: "words"}))
      .join("\n"),
    slots: [16],
  },
  {
    id: "devcooperatifback",
    status: statusOptions[2],
    publishedAt: dateTimeISOString("2023-1-4 16:15"),
    title:
      "Très long vraiment très long titre d'une très longue offre qui s'affiche difficilement car elle est très longue",
    company: "pvgroep",
    location: {
      label: "Place de la Cathédrale 67000 Strasbourg",
      context: "67, Bas-Rhin, Grand Est",
      city: "Strasbourg",
      lat: 48.581821,
      long: 7.750263,
    },
    goal: goalOptions[0],
    description: loremIpsum({count: 2, units: "paragraph"}),
    workEnvironment: loremIpsum({count: 2}),
    softSkills: [softSkillsOptions[1], softSkillsOptions[7], softSkillsOptions[2]],
    duration: 7,
    timeSchedule: loremIpsum({count: 1}),
    meetingDetails: loremIpsum({count: 1}),
    mentorEmail: "mymentor@email.com",
    mentorPhone: "+33651274934",
    tasks: loremIpsum({count: 1, units: "paragraph"}),
    skills: new Array(3)
      .fill(0)
      .map(() => loremIpsum({count: 4, units: "words"}))
      .join("\n"),
    slots: [7, 8, 9, 10],
  },
  {
    id: "consultenergies",
    status: statusOptions[1],
    publishedAt: dateTimeISOString("2023-1-4 16:28"),
    title: "Consultant énergies renouvelables",
    company: "enercoop",
    location: {
      label: "Rue de la Ville en Pierre 44000 Nantes",
      context: "44, Loire-Atlantique, Pays de la Loire",
      city: "Nantes",
      lat: 47.224907,
      long: -1.526928,
    },
    goal: goalOptions[1],
    description: loremIpsum({count: 2, units: "paragraph"}),
    workEnvironment: loremIpsum({count: 2}),
    softSkills: [softSkillsOptions[1], softSkillsOptions[7], softSkillsOptions[2]],
    duration: 7,
    timeSchedule: loremIpsum({count: 1}),
    meetingDetails: loremIpsum({count: 1}),
    mentorEmail: "mymentor@email.com",
    mentorPhone: "+33651274934",
    tasks: loremIpsum({count: 1, units: "paragraph"}),
    skills: new Array(3)
      .fill(0)
      .map(() => loremIpsum({count: 4, units: "words"}))
      .join("\n"),
    slots: [11, 12, 13, 14, 15],
  },
];

// List data mock with less attributes
export const lightOffersList = fullOffers.map((offer) =>
  omit(
    [
      "tasks",
      "skills",
      "softSkills",
      "duration",
      "timeSchedule",
      "meetingDetails",
      "mentorEmail",
      "mentorPhone",
      "workEnvironment",
    ],
    offer
  )
);
