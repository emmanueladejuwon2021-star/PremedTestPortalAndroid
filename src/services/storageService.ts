import AsyncStorage from '@react-native-async-storage/async-storage';
import { StudentProfile } from '../types/user';
import { ExamResult } from '../types/exam';

const KEYS = {
  USER_PROFILE: '@premed_user_profile',
  EXAM_HISTORY: '@premed_exam_history',
  BOOKMARKED_QUESTIONS: '@premed_bookmarked_questions',
  THEME_MODE: '@premed_theme_mode',
  ACTIVE_EXAM_BACKUP: '@premed_active_exam_backup',
};

export const StorageService = {
  async saveProfile(profile: StudentProfile): Promise<void> {
    try {
      await AsyncStorage.setItem(KEYS.USER_PROFILE, JSON.stringify(profile));
    } catch (e) {
      console.error('Failed to save profile', e);
    }
  },

  async getProfile(): Promise<StudentProfile | null> {
    try {
      const data = await AsyncStorage.getItem(KEYS.USER_PROFILE);
      return data ? JSON.parse(data) : null;
    } catch (e) {
      console.error('Failed to get profile', e);
      return null;
    }
  },

  async clearProfile(): Promise<void> {
    try {
      await AsyncStorage.removeItem(KEYS.USER_PROFILE);
    } catch (e) {
      console.error('Failed to clear profile', e);
    }
  },

  async saveExamResult(result: ExamResult): Promise<void> {
    try {
      const history = await this.getExamHistory();
      const updated = [result, ...history];
      await AsyncStorage.setItem(KEYS.EXAM_HISTORY, JSON.stringify(updated));
    } catch (e) {
      console.error('Failed to save exam result', e);
    }
  },

  async getExamHistory(): Promise<ExamResult[]> {
    try {
      const data = await AsyncStorage.getItem(KEYS.EXAM_HISTORY);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      console.error('Failed to get exam history', e);
      return [];
    }
  },

  async getResultById(resultId: string): Promise<ExamResult | null> {
    const history = await this.getExamHistory();
    return history.find((r) => r.id === resultId) || null;
  },

  async toggleBookmark(questionId: string): Promise<boolean> {
    try {
      const bookmarks = await this.getBookmarkedIds();
      const index = bookmarks.indexOf(questionId);
      let isSaved = false;
      let nextBookmarks: string[];

      if (index > -1) {
        nextBookmarks = bookmarks.filter((id) => id !== questionId);
        isSaved = false;
      } else {
        nextBookmarks = [...bookmarks, questionId];
        isSaved = true;
      }

      await AsyncStorage.setItem(KEYS.BOOKMARKED_QUESTIONS, JSON.stringify(nextBookmarks));
      return isSaved;
    } catch (e) {
      console.error('Failed to toggle bookmark', e);
      return false;
    }
  },

  async getBookmarkedIds(): Promise<string[]> {
    try {
      const data = await AsyncStorage.getItem(KEYS.BOOKMARKED_QUESTIONS);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      console.error('Failed to get bookmarks', e);
      return [];
    }
  },

  async saveActiveExamBackup(backup: any): Promise<void> {
    try {
      await AsyncStorage.setItem(KEYS.ACTIVE_EXAM_BACKUP, JSON.stringify(backup));
    } catch (e) {
      console.error('Failed to backup exam', e);
    }
  },

  async clearActiveExamBackup(): Promise<void> {
    try {
      await AsyncStorage.removeItem(KEYS.ACTIVE_EXAM_BACKUP);
    } catch (e) {
      console.error('Failed to clear exam backup', e);
    }
  },
};
