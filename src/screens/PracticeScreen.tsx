import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/types';
import { QUESTION_BANK } from '../data/questionBanks';
import { COURSES } from '../data/courses';
import { OptionItem } from '../components/OptionItem';
import { Header } from '../components/Header';
import { useTheme } from '../context/ThemeContext';
import { StorageService } from '../services/storageService';
import { Colors } from '../constants/colors';
import { QuestionOptionKey } from '../types/question';

type PracticeRouteProp = RouteProp<RootStackParamList, 'Practice'>;

export const PracticeScreen: React.FC = () => {
  const route = useRoute<PracticeRouteProp>();
  const navigation = useNavigation();
  const { colors, isDark } = useTheme();

  const courseId = route.params?.courseId || 'med_cbt_101';
  const course = COURSES.find((c) => c.id === courseId) || COURSES[0];

  const questions = QUESTION_BANK.filter((q) => q.courseId === courseId);
  const [index, setIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<QuestionOptionKey | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);

  const currentQ = questions[index] || QUESTION_BANK[0];

  const handleSelectOption = (opt: QuestionOptionKey) => {
    setSelectedOption(opt);
    setRevealed(true);
  };

  const handleNext = () => {
    if (index < questions.length - 1) {
      setIndex((prev) => prev + 1);
      setSelectedOption(null);
      setRevealed(false);
    }
  };

  const handlePrev = () => {
    if (index > 0) {
      setIndex((prev) => prev - 1);
      setSelectedOption(null);
      setRevealed(false);
    }
  };

  const handleToggleBookmark = async () => {
    const saved = await StorageService.toggleBookmark(currentQ.id);
    setIsBookmarked(saved);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.bg }]}>
      <Header
        title={`${course.code} Practice`}
        subtitle={`Item ${index + 1} of ${questions.length}`}
        onBack={() => navigation.goBack()}
        rightAction={
          <TouchableOpacity onPress={handleToggleBookmark} style={styles.bookmarkBtn}>
            <Text style={styles.bookmarkText}>{isBookmarked ? '★ Saved' : '☆ Bookmark'}</Text>
          </TouchableOpacity>
        }
      />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Question Card */}
        <View style={[styles.card, { backgroundColor: colors.cardBg, borderColor: colors.cardBorder }]}>
          <Text style={[styles.stem, { color: colors.textPrimary }]}>{currentQ.text}</Text>

          <View style={styles.optionsWrap}>
            {(['A', 'B', 'C', 'D'] as QuestionOptionKey[]).map((key) => (
              <OptionItem
                key={key}
                optionKey={key}
                text={currentQ.options[key]}
                isSelected={selectedOption === key}
                isCorrect={key === currentQ.correctOption}
                showExplanation={revealed}
                onSelect={() => handleSelectOption(key)}
              />
            ))}
          </View>

          {/* Explanation Box (when revealed) */}
          {revealed && (
            <View style={[styles.explanationCard, { backgroundColor: isDark ? colors.slate800 : '#F0FDF4', borderColor: '#BBF7D0' }]}>
              <View style={styles.explHeader}>
                <Text style={styles.explIcon}>💡</Text>
                <Text style={[styles.explTitle, { color: '#15803D' }]}>
                  Verified Clinical &amp; Theoretical Solution
                </Text>
              </View>
              <Text style={[styles.explText, { color: colors.textPrimary }]}>
                {currentQ.explanation}
              </Text>
            </View>
          )}

          {!revealed && (
            <TouchableOpacity
              style={styles.revealBtn}
              onPress={() => setRevealed(true)}
              activeOpacity={0.7}
            >
              <Text style={styles.revealBtnText}>Reveal Correct Answer &amp; Explanation</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Navigation row */}
        <View style={styles.navRow}>
          <TouchableOpacity
            style={[styles.navBtn, index === 0 ? styles.navBtnDisabled : null]}
            onPress={handlePrev}
            disabled={index === 0}
          >
            <Text style={styles.navBtnText}>‹ Previous</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.navBtn, styles.nextBtn, index === questions.length - 1 ? styles.navBtnDisabled : null]}
            onPress={handleNext}
            disabled={index === questions.length - 1}
          >
            <Text style={[styles.navBtnText, { color: '#FFF' }]}>Next Item ›</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  bookmarkBtn: {
    backgroundColor: 'rgba(148, 163, 184, 0.15)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
  },
  bookmarkText: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.flagged,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  card: {
    borderRadius: 22,
    padding: 18,
    borderWidth: 1,
    marginBottom: 16,
  },
  stem: {
    fontSize: 15,
    fontWeight: '600',
    lineHeight: 23,
    marginBottom: 16,
  },
  optionsWrap: {
    marginBottom: 10,
  },
  explanationCard: {
    marginTop: 14,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1.5,
  },
  explHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  explIcon: {
    fontSize: 18,
  },
  explTitle: {
    fontSize: 13,
    fontWeight: '800',
  },
  explText: {
    fontSize: 13,
    lineHeight: 20,
    fontWeight: '500',
  },
  revealBtn: {
    alignItems: 'center',
    paddingVertical: 10,
    marginTop: 6,
  },
  revealBtnText: {
    color: Colors.primary,
    fontSize: 12,
    fontWeight: '800',
    textDecorationLine: 'underline',
  },
  navRow: {
    flexDirection: 'row',
    gap: 12,
  },
  navBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 14,
    backgroundColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  nextBtn: {
    backgroundColor: Colors.primary,
  },
  navBtnText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#334155',
  },
  navBtnDisabled: {
    opacity: 0.3,
  },
});
