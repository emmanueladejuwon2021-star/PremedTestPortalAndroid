import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  RefreshControl,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { StorageService } from '../services/storageService';
import { ExamResult } from '../types/exam';
import { useTheme } from '../context/ThemeContext';
import { Colors } from '../constants/colors';
import { formatTimeSpent } from '../utils/formatters';
import { getGradeBadgeColor } from '../utils/grading';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export const HistoryScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const { colors, isDark } = useTheme();

  const [history, setHistory] = useState<ExamResult[]>([]);
  const [selectedCourseFilter, setSelectedCourseFilter] = useState<string>('ALL');
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    setRefreshing(true);
    const records = await StorageService.getExamHistory();
    setHistory(records);
    setRefreshing(false);
  };

  const filteredHistory = history.filter((item) => {
    if (selectedCourseFilter === 'ALL') return true;
    return item.courseCode === selectedCourseFilter;
  });

  const totalExams = history.length;
  const avgScore =
    totalExams > 0
      ? (history.reduce((acc, curr) => acc + curr.percentage, 0) / totalExams).toFixed(1)
      : '0.0';
  const highestScore =
    totalExams > 0 ? Math.max(...history.map((h) => h.percentage)).toFixed(1) : '0.0';

  const courseCodes = ['ALL', ...Array.from(new Set(history.map((h) => h.courseCode)))];

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} backgroundColor={colors.background} />

      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.cardBg, borderBottomColor: colors.cardBorder }]}>
        <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>Examination Transcripts</Text>
        <TouchableOpacity style={styles.refreshBtn} onPress={loadHistory}>
          <Text style={styles.refreshBtnText}>Refresh</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={loadHistory} />}
      >
        {/* Cumulative Performance Summary */}
        <View style={[styles.summaryCard, { backgroundColor: colors.cardBg, borderColor: colors.cardBorder }]}>
          <Text style={[styles.summaryTitle, { color: colors.textPrimary }]}>Cumulative Performance</Text>
          <View style={styles.summaryGrid}>
            <View style={styles.summaryItem}>
              <Text style={[styles.summaryValue, { color: Colors.primary }]}>{totalExams}</Text>
              <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>Tests Taken</Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={[styles.summaryValue, { color: Colors.success }]}>{avgScore}%</Text>
              <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>Average Score</Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={[styles.summaryValue, { color: Colors.accent }]}>{highestScore}%</Text>
              <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>Highest Score</Text>
            </View>
          </View>
        </View>

        {/* Filter Chips */}
        {courseCodes.length > 1 && (
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipScroll}>
            {courseCodes.map((code) => {
              const isActive = selectedCourseFilter === code;
              return (
                <TouchableOpacity
                  key={code}
                  style={[styles.filterChip, isActive && styles.filterChipActive]}
                  onPress={() => setSelectedCourseFilter(code)}
                >
                  <Text style={[styles.filterChipText, isActive && styles.filterChipTextActive]}>
                    {code}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        )}

        {/* List of Transcripts */}
        {filteredHistory.length > 0 ? (
          filteredHistory.map((item) => {
            const gradeColor = getGradeBadgeColor(item.grade);
            return (
              <TouchableOpacity
                key={item.id}
                style={[styles.transcriptCard, { backgroundColor: colors.cardBg, borderColor: colors.cardBorder }]}
                onPress={() => navigation.navigate('Results', { resultId: item.id })}
                activeOpacity={0.7}
              >
                <View style={styles.transcriptTopRow}>
                  <View style={styles.courseInfo}>
                    <View style={styles.courseCodeBadge}>
                      <Text style={styles.courseCodeBadgeText}>{item.courseCode}</Text>
                    </View>
                    <Text style={[styles.courseTitleText, { color: colors.textPrimary }]} numberOfLines={1}>
                      {item.courseTitle}
                    </Text>
                  </View>

                  <View style={[styles.gradeBadge, { backgroundColor: gradeColor + '20', borderColor: gradeColor }]}>
                    <Text style={[styles.gradeBadgeText, { color: gradeColor }]}>{item.grade}</Text>
                  </View>
                </View>

                <View style={styles.transcriptMetaRow}>
                  <Text style={[styles.percentageText, { color: colors.textPrimary }]}>
                    {item.percentage.toFixed(1)}%{' '}
                    <Text style={[styles.scoreFraction, { color: colors.textSecondary }]}>
                      ({item.totalScore}/{item.totalQuestions})
                    </Text>
                  </Text>

                  <View style={styles.metaDetails}>
                    <Text style={[styles.metaText, { color: colors.textTertiary }]}>
                      ⏱ {formatTimeSpent(item.timeSpentSeconds)}
                    </Text>
                    <Text style={[styles.metaText, { color: colors.textTertiary }]}>
                      📅 {new Date(item.completedAt).toLocaleDateString()}
                    </Text>
                  </View>
                </View>

                <View style={[styles.viewDetailsRow, { borderTopColor: colors.cardBorder }]}>
                  <Text style={styles.viewDetailsText}>View Official Transcript & Review Rationales ›</Text>
                </View>
              </TouchableOpacity>
            );
          })
        ) : (
          <View style={[styles.emptyContainer, { backgroundColor: colors.cardBg, borderColor: colors.cardBorder }]}>
            <Text style={styles.emptyIcon}>📋</Text>
            <Text style={[styles.emptyTitle, { color: colors.textPrimary }]}>No Exam History Yet</Text>
            <Text style={[styles.emptySub, { color: colors.textSecondary }]}>
              Complete your first CBT examination to generate an official transcript!
            </Text>
            <TouchableOpacity
              style={styles.takeExamBtn}
              onPress={() => navigation.navigate('MainTabs')}
            >
              <Text style={styles.takeExamBtnText}>Explore Exam Courses</Text>
            </TouchableOpacity>
          </View>
        )}
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
  headerTitle: {
    fontSize: 16,
    fontWeight: '700',
  },
  refreshBtn: {
    paddingVertical: 4,
  },
  refreshBtnText: {
    color: Colors.primary,
    fontSize: 13,
    fontWeight: '700',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  summaryCard: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
    marginBottom: 16,
  },
  summaryTitle: {
    fontSize: 14,
    fontWeight: '800',
    marginBottom: 12,
  },
  summaryGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  summaryItem: {
    alignItems: 'center',
    flex: 1,
  },
  summaryValue: {
    fontSize: 20,
    fontWeight: '900',
  },
  summaryLabel: {
    fontSize: 11,
    fontWeight: '600',
    marginTop: 2,
  },
  chipScroll: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  filterChip: {
    backgroundColor: '#E2E8F0',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
  },
  filterChipActive: {
    backgroundColor: Colors.primary,
  },
  filterChipText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#475569',
  },
  filterChipTextActive: {
    color: '#FFFFFF',
  },
  transcriptCard: {
    borderRadius: 14,
    borderWidth: 1,
    padding: 14,
    marginBottom: 12,
  },
  transcriptTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  courseInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 8,
  },
  courseCodeBadge: {
    backgroundColor: '#CCFBF1',
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 6,
    marginRight: 8,
  },
  courseCodeBadgeText: {
    color: '#0F766E',
    fontSize: 11,
    fontWeight: '800',
  },
  courseTitleText: {
    fontSize: 13,
    fontWeight: '700',
    flex: 1,
  },
  gradeBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1.5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  gradeBadgeText: {
    fontSize: 14,
    fontWeight: '900',
  },
  transcriptMetaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  percentageText: {
    fontSize: 16,
    fontWeight: '800',
  },
  scoreFraction: {
    fontSize: 12,
    fontWeight: '500',
  },
  metaDetails: {
    alignItems: 'flex-end',
    gap: 2,
  },
  metaText: {
    fontSize: 10,
    fontWeight: '500',
  },
  viewDetailsRow: {
    borderTopWidth: 1,
    paddingTop: 8,
  },
  viewDetailsText: {
    color: Colors.primary,
    fontSize: 11,
    fontWeight: '700',
  },
  emptyContainer: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 32,
    alignItems: 'center',
    marginTop: 20,
  },
  emptyIcon: {
    fontSize: 40,
    marginBottom: 12,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '800',
    marginBottom: 6,
  },
  emptySub: {
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 16,
  },
  takeExamBtn: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  takeExamBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
});
