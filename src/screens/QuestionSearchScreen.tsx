import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { QUESTION_BANKS } from '../data/questionBanks';
import { COURSES } from '../data/courses';
import { Question } from '../types/question';
import { StorageService } from '../services/storageService';
import { useTheme } from '../context/ThemeContext';
import { Colors } from '../constants/colors';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export const QuestionSearchScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const { colors, isDark } = useTheme();

  const [query, setQuery] = useState('');
  const [selectedCourseId, setSelectedCourseId] = useState('ALL');
  const [allQuestions, setAllQuestions] = useState<Question[]>([]);
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>([]);
  const [expandedExplanations, setExpandedExplanations] = useState<Record<string, boolean>>({});

  useEffect(() => {
    // Gather all questions
    const pool: Question[] = Array.isArray(QUESTION_BANKS)
      ? [...QUESTION_BANKS]
      : (Object.values(QUESTION_BANKS) as any).flat();
    setAllQuestions(pool);
    loadBookmarks();
  }, []);

  const loadBookmarks = async () => {
    const bms = await StorageService.getBookmarkedIds();
    setBookmarkedIds(bms);
  };

  const handleToggleBookmark = async (qId: string) => {
    await StorageService.toggleBookmark(qId);
    await loadBookmarks();
  };

  const toggleExpand = (qId: string) => {
    setExpandedExplanations((prev) => ({
      ...prev,
      [qId]: !prev[qId],
    }));
  };

  const filteredQuestions = allQuestions.filter((q) => {
    if (selectedCourseId !== 'ALL' && q.courseId !== selectedCourseId) {
      return false;
    }
    if (!query.trim()) return true;

    const qLower = query.toLowerCase();
    const stemMatch = q.text.toLowerCase().includes(qLower);
    const topicMatch = (q.topic || q.topicId || '').toLowerCase().includes(qLower);
    const expMatch = q.explanation.toLowerCase().includes(qLower);
    return stemMatch || topicMatch || expMatch;
  });

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} backgroundColor={colors.background} />

      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.cardBg, borderBottomColor: colors.cardBorder }]}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.navigate('MainTabs')}>
          <Text style={[styles.backBtnText, { color: colors.textPrimary }]}>‹ Back</Text>
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>Question Bank Vault</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Search Bar Input */}
        <View style={[styles.searchBox, { backgroundColor: colors.cardBg, borderColor: colors.cardBorder }]}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={[styles.searchInput, { color: colors.textPrimary }]}
            placeholder="Search keywords, diseases, formulas, enzymes..."
            placeholderTextColor={colors.textTertiary}
            value={query}
            onChangeText={setQuery}
          />
          {query.length > 0 && (
            <TouchableOpacity onPress={() => setQuery('')}>
              <Text style={styles.clearIcon}>✕</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Subject Filter Chips */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipRow}>
          <TouchableOpacity
            style={[styles.filterChip, selectedCourseId === 'ALL' && styles.filterChipActive]}
            onPress={() => setSelectedCourseId('ALL')}
          >
            <Text style={[styles.filterChipText, selectedCourseId === 'ALL' && styles.filterChipTextActive]}>
              All Subjects ({allQuestions.length})
            </Text>
          </TouchableOpacity>

          {COURSES.map((course) => {
            const count = allQuestions.filter((q) => q.courseId === course.id).length;
            const isActive = selectedCourseId === course.id;
            return (
              <TouchableOpacity
                key={course.id}
                style={[styles.filterChip, isActive && styles.filterChipActive]}
                onPress={() => setSelectedCourseId(course.id)}
              >
                <Text style={[styles.filterChipText, isActive && styles.filterChipTextActive]}>
                  {course.code} ({count})
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Results Count Banner */}
        <View style={styles.resultsBanner}>
          <Text style={[styles.resultsBannerText, { color: colors.textSecondary }]}>
            Found {filteredQuestions.length} accredited question{filteredQuestions.length === 1 ? '' : 's'}
          </Text>
        </View>

        {/* Question Cards List */}
        {filteredQuestions.map((q, idx) => {
          const isBookmarked = bookmarkedIds.includes(q.id);
          const isExpanded = !!expandedExplanations[q.id];

          return (
            <View
              key={q.id}
              style={[styles.questionCard, { backgroundColor: colors.cardBg, borderColor: colors.cardBorder }]}
            >
              <View style={styles.qTopRow}>
                <View style={styles.qBadgeGroup}>
                  <View style={[styles.courseBadge, { backgroundColor: Colors.primary + '15' }]}>
                    <Text style={styles.courseBadgeText}>{q.courseId.toUpperCase()}</Text>
                  </View>
                  <View style={[styles.topicBadge, { backgroundColor: colors.cardBorder }]}>
                    <Text style={[styles.topicBadgeText, { color: colors.textSecondary }]}>{q.topic || q.topicId}</Text>
                  </View>
                </View>

                <TouchableOpacity
                  style={styles.bookmarkBtn}
                  onPress={() => handleToggleBookmark(q.id)}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                  <Text style={styles.bookmarkIcon}>{isBookmarked ? '★' : '☆'}</Text>
                </TouchableOpacity>
              </View>

              <Text style={[styles.questionStemText, { color: colors.textPrimary }]}>
                {idx + 1}. {q.text}
              </Text>

              {/* Options Preview */}
              <View style={styles.optionsPreviewGrid}>
                {(['A', 'B', 'C', 'D'] as const).map((key) => {
                  const isKey = q.correctAnswer === key;
                  return (
                    <View
                      key={key}
                      style={[
                        styles.optItem,
                        isKey && { backgroundColor: Colors.success + '15', borderColor: Colors.success },
                        !isKey && { borderColor: colors.cardBorder },
                      ]}
                    >
                      <Text
                        style={[
                          styles.optKeyText,
                          isKey ? { color: Colors.success, fontWeight: '800' } : { color: colors.textSecondary },
                        ]}
                      >
                        {key}. {q.options[key]}
                      </Text>
                    </View>
                  );
                })}
              </View>

              {/* Collapsible Clinical Rationale */}
              <TouchableOpacity
                style={[styles.rationaleToggle, { backgroundColor: Colors.primary + '10' }]}
                onPress={() => toggleExpand(q.id)}
              >
                <Text style={styles.rationaleToggleText}>
                  {isExpanded ? 'Hide Clinical Rationale ▲' : 'Show Clinical Rationale ▼'}
                </Text>
              </TouchableOpacity>

              {isExpanded && (
                <View style={[styles.rationaleBox, { backgroundColor: Colors.primary + '08' }]}>
                  <Text style={styles.rationaleTitle}>🩺 Explanation & Mechanism:</Text>
                  <Text style={[styles.rationaleBody, { color: colors.textPrimary }]}>{q.explanation}</Text>
                  {q.clinicalCorrelate && (
                    <View style={styles.pearlBox}>
                      <Text style={styles.pearlTitle}>💡 Clinical High-Yield Pearl:</Text>
                      <Text style={[styles.pearlText, { color: colors.textSecondary }]}>
                        {q.clinicalCorrelate}
                      </Text>
                    </View>
                  )}
                </View>
              )}
            </View>
          );
        })}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  backBtn: {
    paddingVertical: 4,
  },
  backBtnText: {
    fontSize: 14,
    fontWeight: '600',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '700',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 12,
  },
  searchIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    padding: 0,
  },
  clearIcon: {
    fontSize: 14,
    color: '#94A3B8',
    paddingHorizontal: 4,
  },
  chipRow: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  filterChip: {
    backgroundColor: '#E2E8F0',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
    marginRight: 8,
  },
  filterChipActive: {
    backgroundColor: Colors.primary,
  },
  filterChipText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#475569',
  },
  filterChipTextActive: {
    color: '#FFFFFF',
  },
  resultsBanner: {
    marginBottom: 12,
  },
  resultsBannerText: {
    fontSize: 12,
    fontWeight: '600',
  },
  questionCard: {
    borderRadius: 14,
    borderWidth: 1,
    padding: 14,
    marginBottom: 14,
  },
  qTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  qBadgeGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  courseBadge: {
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 6,
  },
  courseBadgeText: {
    color: Colors.primary,
    fontSize: 10,
    fontWeight: '800',
  },
  topicBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  topicBadgeText: {
    fontSize: 10,
    fontWeight: '600',
  },
  bookmarkBtn: {
    padding: 4,
  },
  bookmarkIcon: {
    fontSize: 18,
    color: '#F59E0B',
  },
  questionStemText: {
    fontSize: 13,
    fontWeight: '600',
    lineHeight: 19,
    marginBottom: 12,
  },
  optionsPreviewGrid: {
    gap: 6,
    marginBottom: 10,
  },
  optItem: {
    padding: 8,
    borderRadius: 8,
    borderWidth: 1,
  },
  optKeyText: {
    fontSize: 12,
  },
  rationaleToggle: {
    paddingVertical: 6,
    borderRadius: 6,
    alignItems: 'center',
  },
  rationaleToggleText: {
    color: Colors.primary,
    fontSize: 11,
    fontWeight: '700',
  },
  rationaleBox: {
    padding: 10,
    borderRadius: 8,
    marginTop: 8,
  },
  rationaleTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.primary,
    marginBottom: 4,
  },
  rationaleBody: {
    fontSize: 12,
    lineHeight: 17,
    marginBottom: 6,
  },
  pearlBox: {
    backgroundColor: '#FEF3C7',
    padding: 8,
    borderRadius: 6,
  },
  pearlTitle: {
    fontSize: 10,
    fontWeight: '700',
    color: '#B45309',
    marginBottom: 2,
  },
  pearlText: {
    fontSize: 11,
    lineHeight: 15,
  },
});
