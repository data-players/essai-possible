import dayjs from "dayjs";

export const dateTimeISOString = (date) => dayjs(date).toISOString();
export const omit = (keys, obj) =>
  Object.fromEntries(Object.entries(obj).filter(([k]) => !keys.includes(k)));
