// import cron from "node-cron";

import { getNewsArticlesFromTimePeriod } from "./newsHandler";
import { getGPTChatResponse } from "./gptHandler";
import { writeQuizToMongo } from "../database/databaseHandler";
import { GeneratedQuizQuestion, QuizQuestion } from "../../types/QuizQuestion";
import { NewsData } from "../../types/NewsData";
export const setupQuiz = async (timePeriod: string): Promise<void> => {
  /**
   * will generate a quiz, filter out all null values save the quiz to the mongoDB database
   */
  try {
    const quizQuestionsWithNulls: QuizQuestion[] | null =
      await generateQuizQuestions(timePeriod);
    //quickly filter out the nulls
    const quizQuestions: QuizQuestion[] = (quizQuestionsWithNulls ?? []).filter(
      (question: QuizQuestion) => question !== null && question !== undefined
    );
    await writeQuizToMongo(quizQuestions, timePeriod);
  } catch (error) {
    console.error(error);
  }
};

export const generateQuizQuestions = async (
  timePeriod: string
): Promise<QuizQuestion[] | null> => {
  try {
    const newsArticles: NewsData[] | null = await getNewsArticlesFromTimePeriod(
      timePeriod
    );
    if (!newsArticles) {
      console.error("no news articles to use");
      return null;
    }
    const quizQuestions: (QuizQuestion | null)[] = await Promise.all(
      newsArticles.map(async (article) => {
        const gptResponse: GeneratedQuizQuestion | null =
          await getGPTChatResponse(article.content);
        if (gptResponse?.question) {
          const quizQuestion: QuizQuestion = {
            ...gptResponse,
            source: article.url,
            image: article.urlToImage,
            summary: article.description,
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
