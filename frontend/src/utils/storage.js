export const safeJSONParse = (value) => {
  try {
    if (!value || value === "undefined" || value === "null") {
      return null;
    }
    return JSON.parse(value);
  } catch (err) {
    return null;
  }
};