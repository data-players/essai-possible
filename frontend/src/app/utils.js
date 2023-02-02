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

export const cleanUrl = (url) => url?.replace(/https?:\/\/(www.)?/, "").replace(/\/$/, "");

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

export function getDeepValue(obj, splitName) {
  let final = obj;
  for (const namePart of splitName) {
    final = final?.[namePart];
  }

  return final;
}

/**
 * Create a marshaller that can marshall and unmarshall objects. Keys not specified in the schema are ignored.
 * Marshallers can be nested inside each other like in the example below.
 *
 * Usage:
 *
 * const offersMarshaller = createJsonLDMarshaller(
 *   {
 *     title: "pair:title",
 *     softSkills: "pair:softSkills",
 *     location: createJsonLDMarshaller(
 *       {
 *         city: "location:city",
 *         label: "location:label",
 *       },
 *       {oldFieldName: "pair:location"}
 *     ),
 *   },
 *   {objectArrayFields: ["softSkills"]}
 * );
 *
 * const offer = {
 *   "pair:title": "Truc Muche",
 *   "pair:softSkills": ["truc", "muche"],
 *   "pair:softSkills": ["truc", "muche"],
 *   "pair:location": {
 *     "location:city": "Avranches",
 *     "location:label": "Ville d'avranches",
 *   },
 * };
 *
 * const marshalledOffer = offersMarshaller.marshall(offer);
 * const unmarshalledOffer = offersMarshaller.unmarshall(marshalledOffer);
 *
 * console.log(offer, marshalledOffer, unmarshalledOffer); // offer == unmarshalledOffer
 *
 *
 * @param renamingsSchema Keys are either like:
 * "newName": "oldName"
 *    --> oldFieldNameOrMarshaller is a string
 * or :
 * "newName": createJsonLDMarshaller(nestedRenamingsSchema, "oldName")
 *    --> oldFieldNameOrMarshaller is a marshaller that contains an attribute oldFieldName containing "oldName"
 * @param oldFieldName Needed for nested marshallers. Its the old name of the field.
 * @param objectArrayFields the fields that contain links to one or more elements, and thus can be either ids or arrays of ids in JSON-LD (in their new fieldName)
 * @returns {{marshall: (function(*): {}), oldFieldName: string, unmarshall: (function(*): {})}}
 */
export function createJsonLDMarshaller(
  renamingsSchema,
  {oldFieldName = undefined, objectArrayFields = [],encodeUriFields = []} = {}
) {
  const isObjectMarshaller = (obj) =>
    typeof obj?.marshall === "function" && typeof obj?.unmarshall === "function";

  return {
    marshall: function (inObject) {
      const outObject = {};

      for (const [newFieldName, oldFieldNameOrMarshaller] of Object.entries(renamingsSchema)) {
        if (typeof oldFieldNameOrMarshaller === "string") {
          if (inObject[oldFieldNameOrMarshaller])
            outObject[newFieldName] = inObject[oldFieldNameOrMarshaller]; // The value at oldFieldName
        } else if (
          isObjectMarshaller(oldFieldNameOrMarshaller) &&
          oldFieldNameOrMarshaller.oldFieldName
        ) {
          const valueToMarshall = inObject[oldFieldNameOrMarshaller.oldFieldName];
          outObject[newFieldName] = oldFieldNameOrMarshaller.marshall(valueToMarshall);
        } else {
          throw new Error("The renamings schema is incorrect");
        }
      }

      // Convert "keys that should be arrays"
      for (const objectArrayField of objectArrayFields) {
        if (outObject[objectArrayField]) {
          if (!Array.isArray(outObject[objectArrayField]))
            outObject[objectArrayField] = [outObject[objectArrayField]];
          // outObject[objectArrayField] = outObject[objectArrayField].map(encodeURIComponent);
        }
      }

      for (const encodeUriField of encodeUriFields) {
        if (outObject[encodeUriFields]) {
          if (Array.isArray(outObject[encodeUriField])){
              outObject[encodeUriField]=outObject[encodeUriField].map(v=>encodeURIComponent(v))
          }else {
            outObject[encodeUriField]=encodeURIComponent(outObject[encodeUriField])
          }
        }
      }

      // Encode ID for use in the URL
      outObject.id = encodeURIComponent(inObject.id);

      return outObject;
    },

    unmarshall: function (outObjectInit) {
      const outObject = {...outObjectInit};
      const inObject = {};

      // Decode ID
      inObject.id = decodeURIComponent(outObject.id);

      // Convert "keys that should be arrays"
      for (const objectArrayField of objectArrayFields) {
        if (outObject[objectArrayField] && Array.isArray(outObject[objectArrayField])) {
          const {length} = outObject[objectArrayField];
          inObject[objectArrayField] =
            length === 1
              ? outObject[objectArrayField][0]
              : length === 0
              ? null
              : outObject[objectArrayField];
          // outObject[objectArrayField] = outObject[objectArrayField].map(decodeURIComponent);
        }
      }

      // for (const encodeUriField of encodeUriFields) {
      //   if (inObject[encodeUriFields]) {
      //     if (Array.isArray(outObject[encodeUriField])){
      //         inObject[encodeUriField]=inObject[encodeUriField].map(v=>encodeURIComponent(v))
      //     }else {
      //       inObject[encodeUriField]=encodeURIComponent(inObject[encodeUriField])
      //     }
      //   }
      // }

      for (const [newFieldName, oldFieldNameOrMarshaller] of Object.entries(renamingsSchema)) {
        if (typeof oldFieldNameOrMarshaller === "string") {
          if (outObject[newFieldName]) inObject[oldFieldNameOrMarshaller] = outObject[newFieldName]; // The value at oldFieldName
        } else if (
          isObjectMarshaller(oldFieldNameOrMarshaller) &&
          oldFieldNameOrMarshaller.oldFieldName
        ) {
          const valueToUnmarshall = outObject[newFieldName];
          inObject[oldFieldNameOrMarshaller.oldFieldName] =
            oldFieldNameOrMarshaller.unmarshall(valueToUnmarshall);
        } else {
          throw new Error("The renamings schema is incorrect");
        }
      }

      return inObject;
    },

    oldFieldName,
  };
}
