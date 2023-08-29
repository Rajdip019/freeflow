export const formatCommaSeparatedStringToArray = (text: string): string[] => {
  // Remove any leading/trailing spaces and split the string by commas
  const trimmedText = text.trim();
  const array = trimmedText.split(",");

  // Remove any extra spaces around each array element
  const trimmedArray = array.map((item) => item.trim());

  return trimmedArray;
};
