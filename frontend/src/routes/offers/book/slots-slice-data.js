import {dateTimeISOString} from "../../../app/mockUtils.js";

export const slots = [
  {id: 1, start: dateTimeISOString("2023-3-23 16:30"), duration: 30, offer: "titredeloffre"},
  {id: 2, start: dateTimeISOString("2023-3-23 16:0"), duration: 30, offer: "titredeloffre"},
  {id: 3, start: dateTimeISOString("2023-3-24 15:30"), duration: 30, offer: "titredeloffre"},
  {id: 4, start: dateTimeISOString("2023-3-24 16:0"), duration: 30, offer: "titredeloffre"},
  {id: 5, start: dateTimeISOString("2023-3-25 16:30"), duration: 30, offer: "titredeloffre"},
  {id: 6, start: dateTimeISOString("2023-3-23 15:30"), duration: 30, offer: "titredeloffre"},
  {id: 7, start: dateTimeISOString("2023-3-23 15:30"), duration: 30, offer: "devcooperatifback"},
  {id: 8, start: dateTimeISOString("2023-3-23 16:0"), duration: 30, offer: "devcooperatifback"},
  {id: 9, start: dateTimeISOString("2023-3-24 16:0"), duration: 30, offer: "devcooperatifback"},
  {id: 10, start: dateTimeISOString("2023-3-25 16:30"), duration: 30, offer: "devcooperatifback"},
  {id: 11, start: dateTimeISOString("2023-3-23 15:30"), duration: 30, offer: "consultenergies"},
  {id: 12, start: dateTimeISOString("2023-3-23 16:0"), duration: 30, offer: "consultenergies"},
  {id: 13, start: dateTimeISOString("2023-3-24 15:30"), duration: 30, offer: "consultenergies"},
  {id: 14, start: dateTimeISOString("2023-3-24 16:0"), duration: 30, offer: "consultenergies"},
  {id: 15, start: dateTimeISOString("2023-3-25 16:30"), duration: 30, offer: "consultenergies"},
  {id: 16, start: dateTimeISOString("2023-3-28 15:30"), duration: 30, offer: "devcooperatiffront"},
  {id: 18, slot: 12, comments: "Des commentaires divers et variés sur le meeting 2"},
];
