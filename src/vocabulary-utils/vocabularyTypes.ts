const vocabularyTypes = [
  {
    regex: "^https://slovník.gov.cz/datový/([ěščřžýáíéóúůďťňa-z0-9-.]+)$",
    shortName: "D-SGoV-{id}",
  },
  {
    regex: "^https://slovník.gov.cz/agendový/([a-z0-9-]+)$",
    shortName: "A-SGoV-{id}",
  },
  {
    regex: "^https://slovník.gov.cz/legislativní/sbírka/([0-9]+/[0-9]+)$",
    shortName: "L-SGoV-{id}",
  },
  {
    regex: "^https://slovník.gov.cz/generický/([ěščřžýáíéóúůďťňa-z0-9-.]+$)",
    shortName: "G-SGoV-{id}",
  },
  {
    regex: "^https://slovník.gov.cz/veřejný-sektor",
    shortName: "V-SGoV",
  },
  {
    regex: "^https://slovník.gov.cz/základní",
    shortName: "Z-SGoV",
  },
];

export default vocabularyTypes;
