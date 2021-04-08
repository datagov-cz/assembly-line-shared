import vocabularyTypes from "./vocabularyTypes.json";

/**
 * Usage:
 * `const shortLabel = getVocabularyShortLabel("https://slovník.gov.cz/agendový/101")`
 */
export function getVocabularyShortLabel(vocabularyIri: string) {
    const vocabularies = vocabularyTypes
        .map((v) => {
            const match = vocabularyIri.match(v.regex);
            return !match ? null : (
                (match.length == 1) ? v.shortName : v.shortName.replace("{id}", match[1])
            );
        })
        .filter((v) => v);
    return (!vocabularies || vocabularies.length > 1) ?
        null :
        vocabularies[0];
}