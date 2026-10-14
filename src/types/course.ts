export interface Topic {
  id: string;
  courseId: string;
  name: string;
  questionCount: number;
  description?: string;
  highYieldYield?: string;
}

export interface Course {
  id: string;
  code: string;
  title: string;
  departmentScope: string;
  icon: string;
  durationMinutes: number;
  questionLimit: number;
  isMock: boolean;
  topics: Topic[];
  badgeColor?: string;
  calculatorAllowed?: boolean;
}
