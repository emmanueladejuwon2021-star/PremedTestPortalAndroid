import { Question, StudentAnswer, QuestionOptionKey } from './question';

export interface ExamSessionConfig {
  courseId: string;
  courseCode: string;
  courseTitle: string;
  durationMinutes: number;
  questionLimit: number;
  selectedTopicIds?: string[];
  isPracticeMode?: boolean;
  calculatorAllowed?: boolean;
}

export interface ExamResult {
  id: string;
  courseId: string;
  courseCode: string;
  courseTitle: string;
  totalScore: number;
  totalQuestions: number;
  percentage: number;
  grade: 'A' | 'B' | 'C' | 'D' | 'F';
  remark: string;
  durationMinutes: number;
  timeSpentSeconds: number;
  completedAt: string;
  answers: Record<string, QuestionOptionKey | null>;
  flaggedQuestionIds: string[];
  questionIds: string[];
  topicBreakdown: Record<string, { total: number; correct: number; percentage: number }>;
}

export interface ReadinessMetric {
  overallPercentage: number;
  projectedGrade: string;
  totalTestsCompleted: number;
  strongestCourse: string;
  weakestCourse: string;
  topicMastery: Array<{
    course: string;
    topic: string;
    masteryPercentage: number;
    status: 'Mastered' | 'Proficient' | 'Needs Review';
  }>;
}
