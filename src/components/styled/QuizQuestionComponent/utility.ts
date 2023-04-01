import { QuizQuestion } from "../../../../types/QuizQuestion";

export const mapIntToAlphabet = (num: number) => {
  return String.fromCharCode(97 + num).toLocaleUpperCase();
};

export const checkAndTrimString = (s: string): string => {
  /**
   * Checks to see if chat gpt added uneeded question indices then trims them if they do exist
   */
  const pattern = /^[a-z]\)\s/i; // regular expression pattern to match the pattern a), b), c), etc.
  if (pattern.test(s)) {
    // if the string matches the pattern, trim it and return the result
    return s.trim().slice(2);
  }
  // otherwise, return the original string
  return s;
};

export const constructQuestionTextClipboard = (
  index: number,
  question: QuizQuestion
) => {
  const text = `**Qustion ${index + 1}** \n 
${question.question}\n
${question.choices.map((choice, index) => {
  return `${index > 0 ? "\n" : ""} ${mapIntToAlphabet(
    index
  )}. *${checkAndTrimString(choice)}*`;
})} \n
${question.image} \n
`;
  return text;
};
