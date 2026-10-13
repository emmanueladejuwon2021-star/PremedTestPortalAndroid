import { ExamSessionConfig } from '../types/exam';

export type RootStackParamList = {
  Auth: undefined;
  MainTabs: undefined;
  Exam: { config: ExamSessionConfig };
  Practice: { courseId: string; topicIds?: string[] };
  Results: { resultId: string };
  Combat: undefined;
  ActiveStudy: undefined;
  QuestionSearch: undefined;
  Readiness: undefined;
  Leaderboard: undefined;
  History: undefined;
};

export type BottomTabParamList = {
  HomeTab: undefined;
  CoursesTab: undefined;
  CombatTab: undefined;
  StudyTab: undefined;
  HistoryTab: undefined;
  ProfileTab: undefined;
};
