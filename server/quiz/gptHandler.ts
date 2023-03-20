import { Configuration, OpenAIApi } from "openai";

export type GPTUsage = {
  prompt_tokens: number;
  completion_tokens: number;
  total_tokens: number;
};
export type GPTMessageData = {
  role: string;
  content: string;
};
export type GPTChoiceData = {
  message: GPTMessageData;
  finish_reason: string;
  index: number;
};

export type GPTResponseData = {
  id: string;
  object: string;
  created: number;
  model: string;
  usage: GPTUsage;
  choices: GPTChoiceData[];
};

export interface GeneratedQuizQuestion {
  question: string;
  options: string[];
  answerIndex: number;
}

const configuration: Configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

export const getGPTChatResponse = async (
  article: string
): Promise<GeneratedQuizQuestion | null> => {
  const openai: OpenAIApi = new OpenAIApi(configuration);
  const prompt: string =
    "generate a multiple choice question with 4 options from this article in json format using this ts export type {question: string , choices: string[], answer: number} while keeping the question broad enough that the general population can answer it: ";
  const response = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: [{ role: "user", content: prompt + article }],
  });
  if (response.data.choices[0].message?.content) {
    const content: string = response.data.choices[0].message?.content;
    return JSON.parse(
      response.data.choices[0].message?.content
    ) as GeneratedQuizQuestion;
  } else {
    return null;
  }
};

/*
example response 
{
  "id": "chatcmpl-123",
  "object": "chat.completion",
  "created": 1677652288,
  "choices": [{
    "index": 0,
    "message": {
      "role": "assistant",
      "content": "\n\nHello there, how may I assist you today?",
    },
    "finish_reason": "stop"
  }],
  "usage": {
    "prompt_tokens": 9,
    "completion_tokens": 12,
    "total_tokens": 21
  }
}
*/
