import dayjs from "dayjs";
import debounce from "@mui/utils/debounce.js";

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

export function getUrlParam(key, urlParams, type = "string", defaultValue = "") {
  let urlParamValue = urlParams.get(key);

  if (urlParamValue === null) return defaultValue;

  if (type === "array" && urlParamValue.length > 0) return urlParamValue.split(";");
  else if (type === "number") return parseInt(urlParamValue);
  else if (type === "object") return JSON.parse(urlParamValue);

  return urlParamValue;
}

export function setURLParam(key, value, type = "string") {
  const URLParams = new URLSearchParams(window.location.search);

  if (!value || value === "" || value === [] || value === {}) {
    URLParams.delete(key);
  } else {
    // Case value is an Array
    if (type === "array") value = value.join(";");
    else if (type === "number") value = value.toString();
    else if (type === "object") value = JSON.stringify(value);

    // If value equals something
    URLParams.set(key, value);
  }

  const queryParamsString = URLParams.toString();

  window.history.replaceState(
    null,
    null,
    queryParamsString.length > 0 ? `/offers?${queryParamsString}` : "/offers"
  );
}

export const debouncedSetURLParam = debounce(setURLParam, 1000);
