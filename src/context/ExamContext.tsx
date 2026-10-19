import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { Question, QuestionOptionKey } from '../types/question';
import { ExamResult, ExamSessionConfig } from '../types/exam';
import { calculateGrade } from '../utils/grading';
import { StorageService } from '../services/storageService';
import { QUESTION_BANK } from '../data/questionBanks';

interface ExamContextType {
  isExamActive: boolean;
  currentConfig: ExamSessionConfig | null;
  questions: Question[];
  currentIndex: number;
  answers: Record<string, QuestionOptionKey | null>;
  flaggedIds: string[];
  secondsRemaining: number;
  fontSizeScale: number;
  lastResult: ExamResult | null;
  startExam: (config: ExamSessionConfig) => void;
  selectOption: (questionId: string, option: QuestionOptionKey) => void;
  clearSelection: (questionId: string) => void;
  toggleFlag: (questionId: string) => void;
  goToQuestion: (index: number) => void;
  nextQuestion: () => void;
  prevQuestion: () => void;
  toggleFontSize: () => void;
  submitExam: () => Promise<ExamResult>;
  cancelExam: () => void;
}

const ExamContext = createContext<ExamContextType>({} as ExamContextType);

export const ExamProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isExamActive, setIsExamActive] = useState(false);
  const [currentConfig, setCurrentConfig] = useState<ExamSessionConfig | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, QuestionOptionKey | null>>({});
  const [flaggedIds, setFlaggedIds] = useState<string[]>([]);
  const [secondsRemaining, setSecondsRemaining] = useState(0);
  const [fontSizeScale, setFontSizeScale] = useState(1.0);
  const [lastResult, setLastResult] = useState<ExamResult | null>(null);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Restore backup on mount if present
  useEffect(() => {
    restoreBackupIfAvailable();
  }, []);

  const restoreBackupIfAvailable = async () => {
    try {
      const backup = await StorageService.getActiveExamBackup();
      if (backup && backup.isExamActive && backup.questions && backup.questions.length > 0) {
        setQuestions(backup.questions);
        setCurrentIndex(backup.currentIndex || 0);
        setAnswers(backup.answers || {});
        setFlaggedIds(backup.flaggedIds || []);
        setCurrentConfig(backup.currentConfig || null);
        setSecondsRemaining(backup.secondsRemaining || 1800);
        setIsExamActive(true);
      }
    } catch (e) {
      console.warn('Failed to restore active exam backup', e);
    }
  };

  // Sync active exam backup
  useEffect(() => {
    if (isExamActive && questions.length > 0) {
      StorageService.saveActiveExamBackup({
        isExamActive,
        currentConfig,
        questions,
        currentIndex,
        answers,
        flaggedIds,
        secondsRemaining,
      });
    }
  }, [isExamActive, currentIndex, answers, flaggedIds, secondsRemaining]);

  // Timer Countdown Effect
  useEffect(() => {
    if (isExamActive && secondsRemaining > 0) {
      timerRef.current = setInterval(() => {
        setSecondsRemaining((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current!);
            submitExam();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isExamActive, secondsRemaining]);

  const startExam = (config: ExamSessionConfig) => {
    // Filter questions for the selected course / topics
    let pool = QUESTION_BANK.filter((q) => q.courseId === config.courseId);

    if (config.selectedTopicIds && config.selectedTopicIds.length > 0) {
      pool = pool.filter((q) => config.selectedTopicIds!.includes(q.topicId));
    }

    // Fallback if topic filtering yields fewer items than limit
    if (pool.length === 0) {
      pool = QUESTION_BANK;
    }

    // Shuffle pool
    const shuffled = [...pool].sort(() => Math.random() - 0.5);
    const selected = shuffled.slice(0, Math.min(config.questionLimit, shuffled.length));

    const initialAnswers: Record<string, QuestionOptionKey | null> = {};
    selected.forEach((q) => {
      initialAnswers[q.id] = null;
    });

    setQuestions(selected);
    setCurrentIndex(0);
    setAnswers(initialAnswers);
    setFlaggedIds([]);
    setCurrentConfig(config);
    setSecondsRemaining(config.durationMinutes * 60);
    setIsExamActive(true);
  };

  const selectOption = (questionId: string, option: QuestionOptionKey) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: option,
    }));
  };

  const clearSelection = (questionId: string) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: null,
    }));
  };

  const toggleFlag = (questionId: string) => {
    setFlaggedIds((prev) =>
      prev.includes(questionId) ? prev.filter((id) => id !== questionId) : [...prev, questionId]
    );
  };

  const goToQuestion = (index: number) => {
    if (index >= 0 && index < questions.length) {
      setCurrentIndex(index);
    }
  };

  const nextQuestion = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const prevQuestion = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const toggleFontSize = () => {
    setFontSizeScale((prev) => (prev === 1.0 ? 1.15 : prev === 1.15 ? 1.3 : 1.0));
  };

  const submitExam = async (): Promise<ExamResult> => {
    if (timerRef.current) clearInterval(timerRef.current);
    await StorageService.clearActiveExamBackup();

    let score = 0;
    const topicBreakdown: Record<string, { total: number; correct: number; percentage: number }> = {};

    questions.forEach((q) => {
      const targetOption = q.correctOption || q.correctAnswer;
      const isCorrect = answers[q.id] === targetOption;
      if (isCorrect) score += 1;

      if (!topicBreakdown[q.topicId]) {
        topicBreakdown[q.topicId] = { total: 0, correct: 0, percentage: 0 };
      }
      topicBreakdown[q.topicId].total += 1;
      if (isCorrect) topicBreakdown[q.topicId].correct += 1;
    });

    Object.keys(topicBreakdown).forEach((tId) => {
      const data = topicBreakdown[tId];
      data.percentage = Math.round((data.correct / data.total) * 100);
    });

    const total = questions.length;
    const grading = calculateGrade(score, total);
    const duration = currentConfig ? currentConfig.durationMinutes : 30;
    const timeSpent = duration * 60 - secondsRemaining;

    const result: ExamResult = {
      id: `res_${Date.now()}`,
      courseId: currentConfig ? currentConfig.courseId : 'med_cbt_101',
      courseCode: currentConfig ? currentConfig.courseCode : 'MED 101',
      courseTitle: currentConfig ? currentConfig.courseTitle : 'Comprehensive Pre-Medical Sciences',
      totalScore: score,
      totalQuestions: total,
      percentage: grading.percentage,
      grade: grading.grade,
      remark: grading.remark,
      durationMinutes: duration,
      timeSpentSeconds: Math.max(1, timeSpent),
      completedAt: new Date().toISOString(),
      answers,
      flaggedQuestionIds: flaggedIds,
      questionIds: questions.map((q) => q.id),
      topicBreakdown,
    };

    await StorageService.saveExamResult(result);
    setLastResult(result);
    setIsExamActive(false);

    return result;
  };

  const cancelExam = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    StorageService.clearActiveExamBackup();
    setIsExamActive(false);
    setCurrentConfig(null);
  };

  return (
    <ExamContext.Provider
      value={{
        isExamActive,
        currentConfig,
        questions,
        currentIndex,
        answers,
        flaggedIds,
        secondsRemaining,
        fontSizeScale,
        lastResult,
        startExam,
        selectOption,
        clearSelection,
        toggleFlag,
        goToQuestion,
        nextQuestion,
        prevQuestion,
        toggleFontSize,
        submitExam,
        cancelExam,
      }}
    >
      {children}
    </ExamContext.Provider>
  );
};

export const useExam = () => useContext(ExamContext);
