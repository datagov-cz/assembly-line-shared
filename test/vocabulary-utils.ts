import { getVocabularyShortLabel } from "index";

describe("Test vocabulary utils", () => {
  test("Z-SGoV label is returned correctly", () => {
    const expectedOutput = "Z-SGoV";
    const output = getVocabularyShortLabel("https://slovník.gov.cz/základní");
    expect(output).toEqual(expectedOutput);
  });
  test("V-SGoV label is returned correctly", () => {
    const expectedOutput = "V-SGoV";
    const output = getVocabularyShortLabel(
      "https://slovník.gov.cz/veřejný-sektor"
    );
    expect(output).toEqual(expectedOutput);
  });
  test("L-SGoV label is returned correctly", () => {
    const expectedOutput = "L-SGoV-111/2009";
    const output = getVocabularyShortLabel(
      "https://slovník.gov.cz/legislativní/sbírka/111/2009"
    );
    expect(output).toEqual(expectedOutput);
  });
  test("A-SGoV label is returned correctly", () => {
    const expectedOutput = "A-SGoV-101";
    const output = getVocabularyShortLabel(
      "https://slovník.gov.cz/agendový/101"
    );
    expect(output).toEqual(expectedOutput);
  });
  test("D-SGoV label is returned correctly", () => {
    const expectedOutput = "D-SGoV-turistický-cíl";
    const output = getVocabularyShortLabel(
      "https://slovník.gov.cz/datový/turistický-cíl"
    );
    expect(output).toEqual(expectedOutput);
  });
  test("G-SGoV label is returned correctly", () => {
    const expectedOutput = "G-SGoV-čas";
    const output = getVocabularyShortLabel(
      "https://slovník.gov.cz/generický/čas"
    );
    expect(output).toEqual(expectedOutput);
  });
  test("G-SGoV label can contain dot", () => {
    const expectedOutput = "G-SGoV-a.b";
    const output = getVocabularyShortLabel(
      "https://slovník.gov.cz/generický/a.b"
    );
    expect(output).toEqual(expectedOutput);
  });
});
