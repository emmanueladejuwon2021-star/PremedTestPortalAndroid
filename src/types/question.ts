export type QuestionOptionKey = 'A' | 'B' | 'C' | 'D';

export interface Question {
  id: string;
  topicId: string;
  courseId: string;
  text: string;
  options: {
    A: string;
    B: string;
    C: string;
    D: string;
  };
  correctOption: QuestionOptionKey;
  explanation: string;
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
