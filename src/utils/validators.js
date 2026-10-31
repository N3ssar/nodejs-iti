import validator from "validator";

const isValidEmail = (email) => {
  return validator.isEmail(email);
};

const isValidNonNegativeInteger = (value, min = 0) => {
  if (!value || typeof value !== "string") return false;
  return validator.isInt(value, { min: min });
};
export { isValidEmail, isValidNonNegativeInteger };
