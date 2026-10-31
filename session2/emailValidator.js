import validator from "validator";

const validateEmail = (email) => {
  if (!validator.isEmail(email)) {
    throw new Error("Invalid email address");
  }
  return true;
};

export default validateEmail;
