export interface GeneratedQuizQuestion {
  question: string;
  choices: string[];
  answerIndex: number;
}

export interface QuizQuestion extends GeneratedQuizQuestion {
  source: string;
  image: string;
}
