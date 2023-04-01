export interface GeneratedQuizQuestion {
  question: string;
  choices: string[];
  answer: number;
}

export interface QuizQuestion extends GeneratedQuizQuestion {
  source: string;
  summary: string;
  image: string | null;
}
