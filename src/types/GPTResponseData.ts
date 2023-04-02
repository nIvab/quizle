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
