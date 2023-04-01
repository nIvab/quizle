import { QuizQuestion } from "../../../../types/QuizQuestion";
import { mapIntToAlphabet } from "../QuizQuestionComponent/utility";

export const constructAnswerTextClipboard = (
  isCorrect: boolean,
  summary: string,
  correctAnswerIndex: number
) => {
  const text = `
${isCorrect ? "**Correct!**" : "**False:**"}\n
${summary}\n
${
  isCorrect === false
    ? `**The correct answer was: ${mapIntToAlphabet(correctAnswerIndex)}**`
    : ""
}
`;
  return text;
};
