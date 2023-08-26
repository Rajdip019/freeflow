import { every } from "lodash-es";
import { formatCommaSeparatedStringToArray } from "@/utils/formatters";

export const validateEmail = (email: string) => {
  if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
    return true;
  }
  return false;
};

export const validateCommaSeparatedEmails = (emails: string) => {
  const emailArray = formatCommaSeparatedStringToArray(emails);
  return every(emailArray, (email) => validateEmail(email));
};
