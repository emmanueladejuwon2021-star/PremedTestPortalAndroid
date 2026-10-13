import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  ActivityIndicator,
  Share,
} from 'react-native';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { ExamResult } from '../types/exam';
import { Question } from '../types/question';
import { StorageService } from '../services/storageService';
import { QUESTION_BANKS } from '../data/questionBanks';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Colors } from '../constants/colors';
import { formatTimeSpent } from '../utils/formatters';
import { getGradeBadgeColor } from '../utils/grading';

type ResultsScreenRouteProp = RouteProp<RootStackParamList, 'Results'>;
type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

type FilterType = 'all' | 'correct' | 'incorrect' | 'flagged';

export const ResultsScreen: React.FC = () => {
  const route = useRoute<ResultsScreenRouteProp>();
  const navigation = useNavigation<NavigationProp>();
  const { resultId } = route.params;
  const { student } = useAuth();
  const { colors, isDark } = useTheme();

  const [result, setResult] = useState<ExamResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<FilterType>('all');
  const [expandedQuestions, setExpandedQuestions] = useState<Record<string, boolean>>({});

  useEffect(() => {
    loadResult();
  }, [resultId]);

  const loadResult = async () => {
    try {
      setLoading(true);
      const res = await StorageService.getResultById(resultId);
      setResult(res);
    } catch (e) {
      console.error('Failed to load result', e);
    } finally {
      setLoading(false);
    }
  };

  const toggleExpand = (qId: string) => {
    setExpandedQuestions((prev) => ({
      ...prev,
      [qId]: !prev[qId],
    }));
  };

  const handleShare = async () => {
    if (!result) return;
    try {
      await Share.share({
        message: `Premed CBT Portal Result Transcript: ${student?.name} (${student?.matricNo}) achieved Grade ${result.grade} (${result.percentage}%) on ${result.courseCode} - ${result.courseTitle}. Remark: ${result.remark}`,
        title: 'Premed Exam Result',
      });
    } catch (e) {
      console.error(e);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={[styles.centerContainer, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={Colors.primary} />
        <Text style={[styles.loadingText, { color: colors.textSecondary }]}>Loading official transcript...</Text>
      </SafeAreaView>
    );
  }

  if (!result) {
    return (
      <SafeAreaView style={[styles.centerContainer, { backgroundColor: colors.background }]}>
        <Text style={[styles.errorTitle, { color: colors.textPrimary }]}>Transcript Not Found</Text>
        <Text style={[styles.errorSub, { color: colors.textSecondary }]}>
          Unable to locate results record for ID: {resultId}
        </Text>
        <TouchableOpacity style={styles.primaryBtn} onPress={() => navigation.navigate('MainTabs')}>
          <Text style={styles.primaryBtnText}>Return to Dashboard</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  // Get question bank for the course to show explanations
  const courseQuestions = QUESTION_BANKS[result.courseId] || [];
  const questionMap = new Map<string, Question>();
  courseQuestions.forEach((q) => questionMap.set(q.id, q));

  // Also include questions that may be in result.questionIds
  const questionsToReview = result.questionIds
    .map((qId) => questionMap.get(qId))
    .filter((q): q is Question => q !== undefined);

  const filteredQuestions = questionsToReview.filter((q) => {
    const userAnswer = result.answers[q.id];
    const isCorrect = userAnswer === q.correctAnswer;
    const isFlagged = result.flaggedQuestionIds.includes(q.id);

    if (filter === 'correct') return isCorrect;
    if (filter === 'incorrect') return !isCorrect;
    if (filter === 'flagged') return isFlagged;
    return true;
  });

  const correctCount = result.totalScore;
  const incorrectCount = result.totalQuestions - result.totalScore;
  const flaggedCount = result.flaggedQuestionIds.length;
  const gradeColor = getGradeBadgeColor(result.grade);

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} backgroundColor={colors.background} />

      {/* Screen Header */}
      <View style={[styles.header, { backgroundColor: colors.cardBg, borderBottomColor: colors.cardBorder }]}>
        <TouchableOpacity style={styles.headerBackBtn} onPress={() => navigation.navigate('MainTabs')}>
          <Text style={[styles.headerBackText, { color: colors.textPrimary }]}>‹ Dashboard</Text>
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>Official Transcript</Text>
        <TouchableOpacity style={styles.shareBtn} onPress={handleShare}>
          <Text style={styles.shareBtnText}>Share</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Verification Banner */}
        <View style={styles.verifiedBanner}>
          <Text style={styles.verifiedIcon}>✓</Text>
          <Text style={styles.verifiedText}>PMSEC CBT ACCREDITED EXAMINATION TRANSCRIPT</Text>
        </View>

        {/* Score Stamp Card */}
        <View style={[styles.scoreCard, { backgroundColor: colors.cardBg, borderColor: colors.cardBorder }]}>
          <View style={styles.scoreRow}>
            <View style={[styles.gradeCircle, { backgroundColor: gradeColor + '20', borderColor: gradeColor }]}>
              <Text style={[styles.gradeLetter, { color: gradeColor }]}>{result.grade}</Text>
              <Text style={[styles.gradeLabel, { color: gradeColor }]}>GRADE</Text>
            </View>

            <View style={styles.scoreDetails}>
              <Text style={[styles.courseCodeText, { color: Colors.primary }]}>{result.courseCode}</Text>
              <Text style={[styles.courseTitleText, { color: colors.textPrimary }]} numberOfLines={2}>
                {result.courseTitle}
              </Text>
              <View style={styles.scorePercentageRow}>
                <Text style={[styles.percentageValue, { color: colors.textPrimary }]}>
                  {result.percentage.toFixed(1)}%
                </Text>
                <Text style={[styles.scoreFraction, { color: colors.textSecondary }]}>
                  ({result.totalScore} / {result.totalQuestions})
                </Text>
              </View>
              <View style={[styles.remarkBadge, { backgroundColor: gradeColor + '15' }]}>
                <Text style={[styles.remarkText, { color: gradeColor }]}>{result.remark}</Text>
              </View>
            </View>
          </View>

          {/* Student Info Bar */}
          <View style={[styles.candidateInfoBar, { borderTopColor: colors.cardBorder }]}>
            <View style={styles.candidateMetaItem}>
              <Text style={[styles.metaLabel, { color: colors.textTertiary }]}>CANDIDATE</Text>
              <Text style={[styles.metaValue, { color: colors.textPrimary }]}>{student?.name || 'Premed Student'}</Text>
            </View>
            <View style={styles.candidateMetaItem}>
              <Text style={[styles.metaLabel, { color: colors.textTertiary }]}>MATRIC NO</Text>
              <Text style={[styles.metaValue, { color: colors.textPrimary }]}>{student?.matricNo || 'MED/2026/0142'}</Text>
            </View>
            <View style={styles.candidateMetaItem}>
              <Text style={[styles.metaLabel, { color: colors.textTertiary }]}>TIME SPENT</Text>
              <Text style={[styles.metaValue, { color: colors.textPrimary }]}>{formatTimeSpent(result.timeSpentSeconds)}</Text>
            </View>
          </View>
        </View>

        {/* Quick Stats Grid */}
        <View style={styles.statsGrid}>
          <View style={[styles.miniStatCard, { backgroundColor: colors.cardBg, borderColor: colors.cardBorder }]}>
            <Text style={[styles.miniStatNum, { color: Colors.success }]}>{correctCount}</Text>
            <Text style={[styles.miniStatLabel, { color: colors.textSecondary }]}>Correct</Text>
          </View>
          <View style={[styles.miniStatCard, { backgroundColor: colors.cardBg, borderColor: colors.cardBorder }]}>
            <Text style={[styles.miniStatNum, { color: Colors.danger }]}>{incorrectCount}</Text>
            <Text style={[styles.miniStatLabel, { color: colors.textSecondary }]}>Incorrect</Text>
          </View>
          <View style={[styles.miniStatCard, { backgroundColor: colors.cardBg, borderColor: colors.cardBorder }]}>
            <Text style={[styles.miniStatNum, { color: Colors.warning }]}>{flaggedCount}</Text>
            <Text style={[styles.miniStatLabel, { color: colors.textSecondary }]}>Flagged</Text>
          </View>
          <View style={[styles.miniStatCard, { backgroundColor: colors.cardBg, borderColor: colors.cardBorder }]}>
            <Text style={[styles.miniStatNum, { color: Colors.primary }]}>{result.durationMinutes}m</Text>
            <Text style={[styles.miniStatLabel, { color: colors.textSecondary }]}>Allocated</Text>
          </View>
        </View>

        {/* Topic Breakdown Card */}
        {Object.keys(result.topicBreakdown || {}).length > 0 && (
          <View style={[styles.sectionCard, { backgroundColor: colors.cardBg, borderColor: colors.cardBorder }]}>
            <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>Topic Performance Diagnostics</Text>
            {Object.entries(result.topicBreakdown).map(([topic, data]) => {
              const perc = data.percentage || 0;
              const barColor = perc >= 70 ? Colors.success : perc >= 50 ? Colors.warning : Colors.danger;
              return (
                <View key={topic} style={styles.topicRow}>
                  <View style={styles.topicHeader}>
                    <Text style={[styles.topicName, { color: colors.textPrimary }]}>{topic}</Text>
                    <Text style={[styles.topicScore, { color: barColor }]}>
                      {data.correct}/{data.total} ({perc.toFixed(0)}%)
                    </Text>
                  </View>
                  <View style={[styles.progressBarTrack, { backgroundColor: colors.cardBorder }]}>
                    <View style={[styles.progressBarFill, { width: `${Math.min(100, perc)}%`, backgroundColor: barColor }]} />
                  </View>
                </View>
              );
            })}
          </View>
        )}

        {/* Question Review Section */}
        <View style={styles.reviewHeader}>
          <Text style={[styles.sectionTitle, { color: colors.textPrimary, marginBottom: 0 }]}>
            Clinical Question Review
          </Text>
          <Text style={[styles.reviewCountText, { color: colors.textSecondary }]}>
            Showing {filteredQuestions.length} of {questionsToReview.length}
          </Text>
        </View>

        {/* Filter Chips */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterChipScroll}>
          <TouchableOpacity
            style={[styles.filterChip, filter === 'all' && styles.filterChipActive]}
            onPress={() => setFilter('all')}
          >
            <Text style={[styles.filterChipText, filter === 'all' && styles.filterChipTextActive]}>
              All ({questionsToReview.length})
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.filterChip, filter === 'correct' && styles.filterChipActive]}
            onPress={() => setFilter('correct')}
          >
            <Text style={[styles.filterChipText, filter === 'correct' && styles.filterChipTextActive]}>
              Correct ({correctCount})
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.filterChip, filter === 'incorrect' && styles.filterChipActive]}
            onPress={() => setFilter('incorrect')}
          >
            <Text style={[styles.filterChipText, filter === 'incorrect' && styles.filterChipTextActive]}>
              Incorrect ({incorrectCount})
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.filterChip, filter === 'flagged' && styles.filterChipActive]}
            onPress={() => setFilter('flagged')}
          >
            <Text style={[styles.filterChipText, filter === 'flagged' && styles.filterChipTextActive]}>
              Flagged ({flaggedCount})
            </Text>
          </TouchableOpacity>
        </ScrollView>

        {/* Question List */}
        {filteredQuestions.map((q, idx) => {
          const userAnswer = result.answers[q.id];
          const isCorrect = userAnswer === q.correctAnswer;
          const isExpanded = !!expandedQuestions[q.id];

          return (
            <View
              key={q.id}
              style={[
                styles.questionReviewCard,
                { backgroundColor: colors.cardBg, borderColor: isCorrect ? Colors.success + '40' : Colors.danger + '40' },
              ]}
            >
              {/* Question Top Header */}
              <View style={styles.qCardHeader}>
                <View style={styles.qBadgeRow}>
                  <View style={[styles.statusBadge, { backgroundColor: isCorrect ? Colors.success + '20' : Colors.danger + '20' }]}>
                    <Text style={[styles.statusBadgeText, { color: isCorrect ? Colors.success : Colors.danger }]}>
                      {isCorrect ? '✓ Correct' : '✕ Incorrect'}
                    </Text>
                  </View>
                  <View style={[styles.topicBadge, { backgroundColor: colors.cardBorder }]}>
                    <Text style={[styles.topicBadgeText, { color: colors.textSecondary }]}>{q.topic}</Text>
                  </View>
                </View>
                <Text style={[styles.qIndexNumber, { color: colors.textTertiary }]}>#{idx + 1}</Text>
              </View>

              {/* Question Text */}
              <Text style={[styles.questionText, { color: colors.textPrimary }]}>{q.text}</Text>

              {/* Options Breakdown */}
              <View style={styles.optionsList}>
                {(['A', 'B', 'C', 'D'] as const).map((key) => {
                  const isUserSelection = userAnswer === key;
                  const isCorrectAnswer = q.correctAnswer === key;

                  let optBorderColor = colors.cardBorder;
                  let optBgColor = 'transparent';
                  let optTextColor = colors.textPrimary;

                  if (isCorrectAnswer) {
                    optBorderColor = Colors.success;
                    optBgColor = Colors.success + '15';
                    optTextColor = Colors.success;
                  } else if (isUserSelection && !isCorrect) {
                    optBorderColor = Colors.danger;
                    optBgColor = Colors.danger + '15';
                    optTextColor = Colors.danger;
                  }

                  return (
                    <View
                      key={key}
                      style={[
                        styles.optionRow,
                        { borderColor: optBorderColor, backgroundColor: optBgColor },
                      ]}
                    >
                      <View
                        style={[
                          styles.optionKeyCircle,
                          {
                            backgroundColor: isCorrectAnswer
                              ? Colors.success
                              : isUserSelection
                              ? Colors.danger
                              : colors.cardBorder,
                          },
                        ]}
                      >
                        <Text style={styles.optionKeyLetter}>{key}</Text>
                      </View>
                      <Text style={[styles.optionValueText, { color: optTextColor }]} numberOfLines={3}>
                        {q.options[key]}
                      </Text>
                      {isCorrectAnswer && (
                        <Text style={styles.correctMarker}>✓ Key</Text>
                      )}
                      {isUserSelection && !isCorrect && (
                        <Text style={styles.userWrongMarker}>Your Pick</Text>
                      )}
                    </View>
                  );
                })}
              </View>

              {/* Toggle Explanation Button */}
              <TouchableOpacity
                style={[styles.explanationToggleBtn, { backgroundColor: Colors.primary + '10' }]}
                onPress={() => toggleExpand(q.id)}
              >
                <Text style={styles.explanationToggleText}>
                  {isExpanded ? 'Hide Clinical Rationale ▲' : 'View Clinical Rationale ▼'}
                </Text>
              </TouchableOpacity>

              {/* Collapsible Clinical Rationale */}
              {isExpanded && (
                <View style={[styles.rationaleContainer, { backgroundColor: Colors.primary + '08' }]}>
                  <Text style={styles.rationaleTitle}>🩺 Medical Analysis & Rationale:</Text>
                  <Text style={[styles.rationaleBody, { color: colors.textPrimary }]}>{q.explanation}</Text>
                  {q.clinicalCorrelate && (
                    <View style={styles.clinicalCorrelateBox}>
                      <Text style={styles.clinicalCorrelateTitle}>💡 Clinical Pearl:</Text>
                      <Text style={[styles.clinicalCorrelateText, { color: colors.textSecondary }]}>
                        {q.clinicalCorrelate}
                      </Text>
                    </View>
                  )}
                </View>
              )}
            </View>
          );
        })}

        {/* Footer Navigation Buttons */}
        <View style={styles.footerActions}>
          <TouchableOpacity
            style={styles.primaryActionBtn}
            onPress={() => navigation.navigate('MainTabs')}
          >
            <Text style={styles.primaryActionBtnText}>Return to Portal Dashboard</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.secondaryActionBtn, { borderColor: Colors.primary }]}
            onPress={() => navigation.navigate('Practice', { courseId: result.courseId })}
          >
            <Text style={styles.secondaryActionBtnText}>Practice Similar Questions</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    fontWeight: '500',
  },
  errorTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 8,
  },
  errorSub: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 20,
  },
  primaryBtn: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  primaryBtnText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 14,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  headerBackBtn: {
    paddingVertical: 4,
    paddingRight: 8,
  },
  headerBackText: {
    fontSize: 15,
    fontWeight: '600',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '700',
  },
  shareBtn: {
    paddingVertical: 4,
    paddingLeft: 8,
  },
  shareBtnText: {
    color: Colors.primary,
    fontWeight: '700',
    fontSize: 14,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 48,
  },
  verifiedBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primaryDark,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    marginBottom: 16,
    justifyContent: 'center',
  },
  verifiedIcon: {
    color: '#10B981',
    fontWeight: '900',
    fontSize: 14,
    marginRight: 6,
  },
  verifiedText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  scoreCard: {
    borderRadius: 14,
    borderWidth: 1,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
  },
  scoreRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  gradeCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 3,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  gradeLetter: {
    fontSize: 34,
    fontWeight: '900',
    lineHeight: 38,
  },
  gradeLabel: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1,
  },
  scoreDetails: {
    flex: 1,
  },
  courseCodeText: {
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  courseTitleText: {
    fontSize: 15,
    fontWeight: '700',
    marginTop: 2,
    marginBottom: 4,
  },
  scorePercentageRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 6,
  },
  percentageValue: {
    fontSize: 22,
    fontWeight: '800',
  },
  scoreFraction: {
    fontSize: 13,
    marginLeft: 6,
    fontWeight: '500',
  },
  remarkBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  remarkText: {
    fontSize: 11,
    fontWeight: '700',
  },
  candidateInfoBar: {
    borderTopWidth: 1,
    paddingTop: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  candidateMetaItem: {
    flex: 1,
  },
  metaLabel: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  metaValue: {
    fontSize: 12,
    fontWeight: '600',
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  miniStatCard: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
    marginHorizontal: 3,
  },
  miniStatNum: {
    fontSize: 18,
    fontWeight: '800',
  },
  miniStatLabel: {
    fontSize: 11,
    fontWeight: '600',
    marginTop: 2,
  },
  sectionCard: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 12,
  },
  topicRow: {
    marginBottom: 12,
  },
  topicHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  topicName: {
    fontSize: 13,
    fontWeight: '600',
    flex: 1,
  },
  topicScore: {
    fontSize: 12,
    fontWeight: '700',
  },
  progressBarTrack: {
    height: 6,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 3,
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  reviewCountText: {
    fontSize: 12,
    fontWeight: '500',
  },
  filterChipScroll: {
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
  questionReviewCard: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 14,
    marginBottom: 14,
  },
  qCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  qBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    marginRight: 8,
  },
  statusBadgeText: {
    fontSize: 11,
    fontWeight: '700',
  },
  topicBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  topicBadgeText: {
    fontSize: 11,
    fontWeight: '500',
  },
  qIndexNumber: {
    fontSize: 12,
    fontWeight: '700',
  },
  questionText: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '600',
    marginBottom: 12,
  },
  optionsList: {
    marginBottom: 8,
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginBottom: 6,
  },
  optionKeyCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  optionKeyLetter: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
  },
  optionValueText: {
    flex: 1,
    fontSize: 13,
    fontWeight: '500',
  },
  correctMarker: {
    color: Colors.success,
    fontSize: 11,
    fontWeight: '700',
    marginLeft: 6,
  },
  userWrongMarker: {
    color: Colors.danger,
    fontSize: 11,
    fontWeight: '700',
    marginLeft: 6,
  },
  explanationToggleBtn: {
    paddingVertical: 8,
    borderRadius: 6,
    alignItems: 'center',
    marginTop: 4,
  },
  explanationToggleText: {
    color: Colors.primary,
    fontSize: 12,
    fontWeight: '700',
  },
  rationaleContainer: {
    padding: 12,
    borderRadius: 8,
    marginTop: 8,
  },
  rationaleTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.primary,
    marginBottom: 4,
  },
  rationaleBody: {
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 8,
  },
  clinicalCorrelateBox: {
    backgroundColor: '#FEF3C7',
    padding: 8,
    borderRadius: 6,
    borderLeftWidth: 3,
    borderLeftColor: '#F59E0B',
  },
  clinicalCorrelateTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: '#B45309',
    marginBottom: 2,
  },
  clinicalCorrelateText: {
    fontSize: 12,
    lineHeight: 16,
  },
  footerActions: {
    marginTop: 16,
  },
  primaryActionBtn: {
    backgroundColor: Colors.primary,
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 10,
  },
  primaryActionBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  secondaryActionBtn: {
    borderWidth: 1.5,
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  secondaryActionBtnText: {
    color: Colors.primary,
    fontSize: 14,
    fontWeight: '700',
  },
});
