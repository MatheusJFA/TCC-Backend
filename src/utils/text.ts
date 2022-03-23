import { t } from "i18next";

export const getFirstName = (name: string): string => {
  return name.split(" ")[0];
};

export const concat = (array: any): string => {
  const separator = array.length === 2 ? ` ${ t("CONJUNCTION") } ` : `, `;
  const lastSeparator = ` ${ t("CONJUNCTION") } `;

  return array
    .slice(0, -1)
    .join(separator)
    .concat(array.length > 1 ? lastSeparator : "", array.slice(-1));
}