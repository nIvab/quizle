export interface GeneratedQuizQuestion {
  question: string;
  options: string[];
  answerIndex: number;
}

export interface QuizQuestion extends GeneratedQuizQuestion {
  source: string;
  image: string;
}
