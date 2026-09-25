export interface QuizSummary {
  id: string;
  title: string;
  questionCount: number;
  createdAt: string;
}

export interface QuestionInput {
  text: string;
  correctAnswer: string;
}

export interface QuizQuestion {
  id: string;
  text: string;
}

export interface QuizDetail {
  id: string;
  title: string;
  questions: QuizQuestion[];
}

export interface SubmitResult {
  score: number;
  total: number;
  breakdown: {
    questionId: string;
    given: string;
    correct: boolean;
    correctAnswer: string;
  }[];
}
