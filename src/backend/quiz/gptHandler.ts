import { Configuration, OpenAIApi } from "openai";
import { GeneratedQuizQuestion } from "../../types/QuizQuestion";

const configuration: Configuration = new Configuration({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
});

export const getGPTChatResponse = async (
  article: string
): Promise<GeneratedQuizQuestion | null> => {
  /**
   * Using the fetched news article, generate some quiz questions from it utilising chatGPT
   */
  const openai: OpenAIApi = new OpenAIApi(configuration);
  const prompt =
    "generate a multiple choice question with 4 options from the given news article in json format using the following typescript type as a schema for the json, here is the type {question: string , choices: string[], answer: number}, only respond with the json object populated with the correct data and nothing else, also ensure that the question generated is broad enough so that the reader may gain context about the news article from the question itself, here is the article: ";
  const response = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: [{ role: "user", content: prompt + article }],
  });
  if (response.data.choices[0].message?.content) {
    //
    return JSON.parse(
      response.data.choices[0].message?.content
    ) as GeneratedQuizQuestion;
  } else {
    return null;
  }
};

export const getCustomGPTChatResponse = async (
  prompt: string
): Promise<string | null> => {
  /**
   * Using the fetched news article, generate some quiz questions from it utilising chatGPT
   */
  const openai: OpenAIApi = new OpenAIApi(configuration);
  const response = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: [{ role: "user", content: prompt }],
  });
  if (response.data.choices[0].message?.content) {
    //
    return JSON.parse(response.data.choices[0].message?.content) as string;
  } else {
    return null;
  }
};
