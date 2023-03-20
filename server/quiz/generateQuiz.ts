import cron from "node-cron";
import fs from "fs/promises";
import path from "path";
import { getNewsArticlesFromTimePeriod, NewsData } from "./newsHandler";
import { getGPTChatResponse, GeneratedQuizQuestion } from "./gptHandler";

export interface QuizQuestion extends GeneratedQuizQuestion {
  source: string;
  image: string;
}
//TODO copy old files to generartedQuiz/old + file handling + cron job
export const setupQuiz = async (timePeriod: string): Promise<void> => {
  /**
   * will generate a quiz, filter out all null values save the quiz to the ~/server/quiz/generatedQuiz dir
   * and move the old quiz to a new directory
   */
  const quizQuestionsWithNulls: QuizQuestion[] | null = await generateQuiz(
    timePeriod
  );
  //quickly filter out the nulls
  const quizQuestions: QuizQuestion[] = (quizQuestionsWithNulls ?? []).filter(
    (question: QuizQuestion) => question !== null && question !== undefined
  );
  const fileName = `quiz_${new Date().toISOString().slice(0, 10)}.json`;
  const generatedDir = path.join(__dirname, "generatedQuiz");
  const oldDir = path.join(generatedDir, "old");
  await fs.writeFile(fileName, JSON.stringify(quizQuestions));
};

export const generateQuiz = async (
  timePeriod: string
): Promise<QuizQuestion[] | null> => {
  try {
    const newsArticles: NewsData[] | null = await getNewsArticlesFromTimePeriod(
      timePeriod
    );
    if (!newsArticles) {
      return null;
    }

    const quizQuestions: (QuizQuestion | null)[] = await Promise.all(
      newsArticles.map(async (article) => {
        const gptResponse: GeneratedQuizQuestion | null =
          await getGPTChatResponse(article.text);
        if (gptResponse?.question) {
          const quizQuestion: QuizQuestion = {
            ...gptResponse,
            source: article.url,
            image: article.image,
          };
          return quizQuestion;
        } else {
          return null;
        }
      })
    );
    return quizQuestions.filter(
      (question) => question !== null
    ) as QuizQuestion[];
  } catch (error) {
    console.error(error);
    return null;
  }
};
