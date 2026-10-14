export type QuestionOptionKey = 'A' | 'B' | 'C' | 'D';

export interface Question {
  id: string;
  topicId: string;
  topic?: string;
  courseId: string;
  text: string;
  options: {
    A: string;
    B: string;
    C: string;
    D: string;
  };
  correctOption: QuestionOptionKey;
  correctAnswer?: QuestionOptionKey;
  explanation: string;
  clinicalCorrelate?: string;
  diagramUrl?: string;
  difficulty?: 'easy' | 'medium' | 'hard';
  highYield?: boolean;
}

export interface StudentAnswer {
  questionId: string;
  selectedOption: QuestionOptionKey | null;
  isFlagged: boolean;
  timeSpentSeconds: number;
}
