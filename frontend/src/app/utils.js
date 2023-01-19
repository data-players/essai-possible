import dayjs from "dayjs";

export function groupBy(xs, fn) {
  return (
    xs?.reduce(function (rv, x) {
      const group = fn(x);
      (rv[group] ||= []).push(x);
      return rv;
    }, {}) || null
  );
}

export const cleanUrl = (url) => url.replace(/https?:\/\/(www.)?/, "").replace(/\/$/, "");

export const normalize = (string, caseSensitive = false) => {
  const normalized =
    string
      ?.toString() // Must be done if the string is actually a number
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "") || "";
  return caseSensitive ? normalized : normalized.toLowerCase();
};

const compare = (a, b) => {
  if (a === b) {
    return 0;
  } else {
    const aDefined = a !== undefined && a !== null;
    const bDefined = b !== undefined && b !== null;
    if (aDefined && bDefined) return a > b ? 1 : -1;
    else if (aDefined) return 1;
    else if (bDefined) return -1;
    else return 0;
  }
};

export const sorter = {
  date: (a, b) => (a ? dayjs(a).valueOf() : -Infinity) - (b ? dayjs(b).valueOf() : -Infinity),
  text: (a, b) => compare(normalize(a).replace(/ /g, ""), normalize(b).replace(/ /g, "")),
  number: compare,
};
