import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { useAuth } from '../context/AuthContext';
import { useExam } from '../context/ExamContext';
import { useTheme } from '../context/ThemeContext';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '../constants/colors';
import { COURSES } from '../data/courses';
import { ANNOUNCEMENTS } from '../data/announcements';
import { Course } from '../types/course';
import { CourseCard } from '../components/CourseCard';
import { StatCard } from '../components/StatCard';
import { StorageService } from '../services/storageService';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export const HomeScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const insets = useSafeAreaInsets();
  const { student } = useAuth();
  const { startExam } = useExam();
  const { colors, isDark, toggleTheme } = useTheme();

  const [testCount, setTestCount] = useState(0);
  const [avgScore, setAvgScore] = useState(0);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    const history = await StorageService.getExamHistory();
    setTestCount(history.length);
    if (history.length > 0) {
      const sum = history.reduce((acc, cur) => acc + cur.percentage, 0);
      setAvgScore(Math.round(sum / history.length));
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadStats();
    setRefreshing(false);
  };

  const handleStartExam = (course: Course) => {
    startExam({
      courseId: course.id,
      courseCode: course.code,
      courseTitle: course.title,
      durationMinutes: course.durationMinutes,
      questionLimit: course.questionLimit,
      calculatorAllowed: true,
    });
    navigation.navigate('Exam', {
      config: {
        courseId: course.id,
        courseCode: course.code,
        courseTitle: course.title,
        durationMinutes: course.durationMinutes,
        questionLimit: course.questionLimit,
      },
    });
  };

  const handlePractice = (course: Course) => {
    navigation.navigate('Practice', { courseId: course.id });
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.bg }]}>
      {/* Top App Header */}
      <View
        style={[
          styles.topBar,
          {
            backgroundColor: colors.cardBg,
            borderBottomColor: colors.cardBorder,
            paddingTop: insets.top > 0 ? insets.top + 8 : 12,
          },
        ]}
      >
        <View style={styles.topBarLeft}>
          <Text style={[styles.appName, { color: colors.textPrimary }]}>
            Apex <Text style={{ color: Colors.primary }}>PreMed CBT</Text>
          </Text>
          <Text style={[styles.academicYear, { color: colors.textSecondary }]}>
            Session 2026/2027 · Official Portal
          </Text>
        </View>

        <TouchableOpacity onPress={toggleTheme} style={styles.themeToggleBtn} activeOpacity={0.7}>
          <Text style={styles.themeToggleText}>{isDark ? '☀️' : '🌙'}</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {/* Candidate Banner Card */}
        <View style={[styles.candidateCard, { backgroundColor: Colors.primary }]}>
          <View style={styles.candidateRow}>
            <View style={styles.candidateDetails}>
              <Text style={styles.candidateName}>{student?.fullName || 'Candidate'}</Text>
              <Text style={styles.candidateMatric}>{student?.matricNo || 'MED/2026/0419'}</Text>
              <Text style={styles.candidateDept}>{student?.department}</Text>
            </View>

            <View style={styles.streakBadge}>
              <Text style={styles.streakFire}>🔥</Text>
              <Text style={styles.streakCount}>{student?.streakDays || 1}d</Text>
              <Text style={styles.streakLabel}>Streak</Text>
            </View>
          </View>

          {/* Quick Notice in banner */}
          <View style={styles.bannerNotice}>
            <Text style={styles.bannerNoticeText}>
              ✓ Candidate Verified · Examination Council Hardware &amp; Biometrics Active
            </Text>
          </View>
        </View>

        {/* Stats Row */}
        <View style={styles.statsRow}>
          <StatCard
            icon="🎯"
            label="Readiness"
            value={`${avgScore > 0 ? avgScore : 78}%`}
            highlightColor={avgScore >= 70 ? Colors.answered : Colors.primary}
            subtext="Target: 80%+"
          />
          <StatCard
            icon="📝"
            label="Mocks Taken"
            value={testCount}
            subtext="All courses"
          />
          <StatCard
            icon="⭐"
            label="Average"
            value={`${avgScore}%`}
            subtext={avgScore >= 70 ? 'Grade A' : 'Grade B'}
          />
        </View>

        {/* High-Yield Quick Actions Grid */}
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>Core Academic Hub</Text>
          <Text style={[styles.sectionSubtitle, { color: colors.textSecondary }]}>High-yield clinical study modes</Text>
        </View>

        <View style={styles.actionsGrid}>
          {/* Action 1: Med Combat */}
          <TouchableOpacity
            style={[styles.actionCard, { backgroundColor: isDark ? colors.slate800 : '#EFF6FF', borderColor: '#BFDBFE' }]}
            onPress={() => navigation.navigate('Combat')}
            activeOpacity={0.7}
          >
            <Text style={styles.actionIcon}>⚔️</Text>
            <Text style={[styles.actionTitle, { color: '#1D4ED8' }]}>Med Combat Arena</Text>
            <Text style={[styles.actionDesc, { color: colors.textSecondary }]}>
              Squad battle duel with live HP bars &amp; clinical trivia
            </Text>
          </TouchableOpacity>

          {/* Action 2: AI Study Room */}
          <TouchableOpacity
            style={[styles.actionCard, { backgroundColor: isDark ? colors.slate800 : '#F0FDF4', borderColor: '#BBF7D0' }]}
            onPress={() => navigation.navigate('ActiveStudy')}
            activeOpacity={0.7}
          >
            <Text style={styles.actionIcon}>✨</Text>
            <Text style={[styles.actionTitle, { color: '#15803D' }]}>AI Study Room</Text>
            <Text style={[styles.actionDesc, { color: colors.textSecondary }]}>
              Turn clinical notes into active recall flash questions
            </Text>
          </TouchableOpacity>

          {/* Action 3: Question Search */}
          <TouchableOpacity
            style={[styles.actionCard, { backgroundColor: isDark ? colors.slate800 : '#FFFBEB', borderColor: '#FDE68A' }]}
            onPress={() => navigation.navigate('QuestionSearch')}
            activeOpacity={0.7}
          >
            <Text style={styles.actionIcon}>🔍</Text>
            <Text style={[styles.actionTitle, { color: '#B45309' }]}>Question Bank</Text>
            <Text style={[styles.actionDesc, { color: colors.textSecondary }]}>
              Search thousands of questions with verified rationales
            </Text>
          </TouchableOpacity>

          {/* Action 4: Readiness Diagnostic */}
          <TouchableOpacity
            style={[styles.actionCard, { backgroundColor: isDark ? colors.slate800 : '#FAF5FF', borderColor: '#E9D5FF' }]}
            onPress={() => navigation.navigate('Readiness')}
            activeOpacity={0.7}
          >
            <Text style={styles.actionIcon}>📊</Text>
            <Text style={[styles.actionTitle, { color: '#7E22CE' }]}>Exam Readiness</Text>
            <Text style={[styles.actionDesc, { color: colors.textSecondary }]}>
              Weak topic diagnostic &amp; score projection model
            </Text>
          </TouchableOpacity>
        </View>

        {/* Assessment Center Courses */}
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>CBT Examination Papers</Text>
          <Text style={[styles.sectionSubtitle, { color: colors.textSecondary }]}>
            Accredited pre-med and medical board mock tests
          </Text>
        </View>

        {COURSES.map((course) => (
          <CourseCard
            key={course.id}
            course={course}
            onStartExam={handleStartExam}
            onPractice={handlePractice}
          />
        ))}

        {/* Institutional Announcements Banner */}
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>Council Notices</Text>
          <Text style={[styles.sectionSubtitle, { color: colors.textSecondary }]}>Official administrative alerts</Text>
        </View>

        {ANNOUNCEMENTS.map((ann) => (
          <View
            key={ann.id}
            style={[styles.announcementCard, { backgroundColor: colors.cardBg, borderColor: colors.cardBorder }]}
          >
            <View style={styles.annBadge}>
              <Text style={styles.annBadgeText}>{ann.type.toUpperCase()}</Text>
            </View>
            <Text style={[styles.annTitle, { color: colors.textPrimary }]}>{ann.title}</Text>
            <Text style={[styles.annContent, { color: colors.textSecondary }]}>{ann.content}</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 45,
    paddingBottom: 12,
    borderBottomWidth: 1,
  },
  topBarLeft: {
    flex: 1,
  },
  appName: {
    fontSize: 18,
    fontWeight: '900',
    letterSpacing: -0.4,
  },
  academicYear: {
    fontSize: 11,
    fontWeight: '600',
    marginTop: 2,
  },
  themeToggleBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(148, 163, 184, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  themeToggleText: {
    fontSize: 16,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  candidateCard: {
    borderRadius: 24,
    padding: 20,
    marginBottom: 16,
    shadowColor: Colors.primary,
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 4,
  },
  candidateRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  candidateDetails: {
    flex: 1,
  },
  candidateName: {
    color: Colors.white,
    fontSize: 18,
    fontWeight: '800',
  },
  candidateMatric: {
    color: '#CCFBF1',
    fontSize: 13,
    fontWeight: '700',
    fontFamily: 'monospace',
    marginTop: 3,
  },
  candidateDept: {
    color: 'rgba(255, 255, 255, 0.85)',
    fontSize: 12,
    fontWeight: '600',
    marginTop: 4,
  },
  streakBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    alignItems: 'center',
  },
  streakFire: {
    fontSize: 18,
  },
  streakCount: {
    color: Colors.white,
    fontSize: 14,
    fontWeight: '900',
  },
  streakLabel: {
    color: '#CCFBF1',
    fontSize: 9,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  bannerNotice: {
    marginTop: 14,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.2)',
  },
  bannerNoticeText: {
    color: '#E6FFFA',
    fontSize: 10,
    fontWeight: '600',
  },
  statsRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 20,
  },
  sectionHeader: {
    marginTop: 10,
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: -0.3,
  },
  sectionSubtitle: {
    fontSize: 11,
    fontWeight: '500',
    marginTop: 2,
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 16,
  },
  actionCard: {
    width: '48.5%',
    padding: 14,
    borderRadius: 18,
    borderWidth: 1.5,
  },
  actionIcon: {
    fontSize: 22,
    marginBottom: 8,
  },
  actionTitle: {
    fontSize: 13,
    fontWeight: '800',
    marginBottom: 4,
  },
  actionDesc: {
    fontSize: 10,
    lineHeight: 14,
    fontWeight: '500',
  },
  announcementCard: {
    padding: 16,
    borderRadius: 18,
    borderWidth: 1,
    marginBottom: 10,
  },
  annBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    marginBottom: 6,
  },
  annBadgeText: {
    color: '#92400E',
    fontSize: 9,
    fontWeight: '800',
  },
  annTitle: {
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 4,
  },
  annContent: {
    fontSize: 11,
    lineHeight: 16,
  },
});
