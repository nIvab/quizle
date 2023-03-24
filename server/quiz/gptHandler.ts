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
  console.log("generating gpt response");
  const openai: OpenAIApi = new OpenAIApi(configuration);
  const prompt: string =
    "generate a multiple choice question with 4 options from the given news article in json format using the following typescript type as a schema for the json, here is the type {question: string , choices: string[], answer: number}, only respond with the json object populated with the correct data and nothing else, here is the article: ";
  const response = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: [{ role: "user", content: prompt + article }],
  });
  console.log("gpt response:", response.data.choices);
  if (response.data.choices[0].message?.content) {
    //
    const content: string = response.data.choices[0].message?.content;
    return JSON.parse(
      response.data.choices[0].message?.content
    ) as GeneratedQuizQuestion;
  } else {
    return null;
  }
};
