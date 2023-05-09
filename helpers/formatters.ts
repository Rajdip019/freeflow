export const formatCommaSeparatedStringToArray = (text: string) => {
  return text.split(",").map((str) => str.trim());
};
