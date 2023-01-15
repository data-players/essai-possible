export function groupBy(xs, fn) {
  return (
    xs?.reduce(function (rv, x) {
      const group = fn(x);
      (rv[group] ||= []).push(x);
      return rv;
    }, {}) || null
  );
}

export const normalize = (string, caseSensitive = false) => {
  const normalized =
    string
      ?.toString() // Must be done if the string is actually a number
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "") || "";
  return caseSensitive ? normalized : normalized.toLowerCase();
};
