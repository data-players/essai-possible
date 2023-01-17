import dayjs from "dayjs";

export const dateTimeISOString = (date) => dayjs(date, "YYYY-M-DD HH:m").toISOString();
export const dateISOString = (date) => dayjs(date, "YYYY-M-DD").toISOString();
export const omit = (keys, obj) =>
  Object.fromEntries(Object.entries(obj).filter(([k]) => !keys.includes(k)));
