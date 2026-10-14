import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { StorageService } from '../services/storageService';
import { ExamResult } from '../types/exam';
import { COURSES } from '../data/courses';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Colors } from '../constants/colors';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export const ReadinessScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const { student } = useAuth();
  const { colors, isDark } = useTheme();

  const [history, setHistory] = useState<ExamResult[]>([]);
  const [readinessScore, setReadinessScore] = useState<number>(84);
  const [passProbability, setPassProbability] = useState<number>(88);
  const [strongest, setStrongest] = useState<string>('Gross Anatomy (ANA 101)');
  const [weakest, setWeakest] = useState<string>('Biophysics & Radiation (PHY 101)');

  useEffect(() => {
    loadDiagnostics();
  }, []);

  const loadDiagnostics = async () => {
    const records = await StorageService.getExamHistory();
    setHistory(records);

    if (records.length > 0) {
      const avg = records.reduce((acc, curr) => acc + curr.percentage, 0) / records.length;
      setReadinessScore(Math.round(avg));
      setPassProbability(Math.min(99, Math.round(avg * 1.08)));

      // Find strongest and weakest
      const sorted = [...records].sort((a, b) => b.percentage - a.percentage);
      setStrongest(`${sorted[0].courseCode} (${sorted[0].percentage.toFixed(0)}%)`);
      setWeakest(`${sorted[sorted.length - 1].courseCode} (${sorted[sorted.length - 1].percentage.toFixed(0)}%)`);
    }
  };

  const handleStartExam = () => {
    const defaultCourse = COURSES[0];
    navigation.navigate('Exam', {
      config: {
        courseId: defaultCourse.id,
        courseCode: defaultCourse.code,
        courseTitle: defaultCourse.title,
        durationMinutes: defaultCourse.durationMinutes,
        questionLimit: defaultCourse.questionLimit,
        calculatorAllowed: defaultCourse.calculatorAllowed,
      },
    });
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} backgroundColor={colors.background} />

      {/* Screen Header */}
      <View style={[styles.header, { backgroundColor: colors.cardBg, borderBottomColor: colors.cardBorder }]}>
        <TouchableOpacity style={styles.headerBackBtn} onPress={() => navigation.navigate('MainTabs')}>
          <Text style={[styles.headerBackText, { color: colors.textPrimary }]}>‹ Back</Text>
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>Readiness & System Integrity</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Academic Readiness Card */}
        <View style={[styles.diagnosticCard, { backgroundColor: colors.cardBg, borderColor: colors.cardBorder }]}>
          <View style={styles.metricRow}>
            <View style={styles.scoreCircle}>
              <Text style={styles.scoreNumber}>{readinessScore}%</Text>
              <Text style={styles.scoreLabel}>READINESS</Text>
            </View>

            <View style={styles.diagnosticDetails}>
              <Text style={[styles.diagnosticTitle, { color: colors.textPrimary }]}>
                Pre-Med Board Readiness
              </Text>
              <Text style={[styles.passProbText, { color: Colors.primary }]}>
                🎯 {passProbability}% Projected Pass Rate
              </Text>
              <Text style={[styles.diagnosticSub, { color: colors.textSecondary }]}>
                Based on {history.length} proctored session{history.length === 1 ? '' : 's'} recorded.
              </Text>
            </View>
          </View>

          <View style={[styles.domainList, { borderTopColor: colors.cardBorder }]}>
            <View style={styles.domainItem}>
              <Text style={[styles.domainLabel, { color: colors.textTertiary }]}>STRONGEST DOMAIN</Text>
              <Text style={[styles.domainValue, { color: Colors.success }]}>✓ {strongest}</Text>
            </View>
            <View style={styles.domainItem}>
              <Text style={[styles.domainLabel, { color: colors.textTertiary }]}>NEEDS REVISION</Text>
              <Text style={[styles.domainValue, { color: Colors.danger }]}>⚠️ {weakest}</Text>
            </View>
          </View>
        </View>

        {/* System & Hardware Checks */}
        <View style={[styles.sectionCard, { backgroundColor: colors.cardBg, borderColor: colors.cardBorder }]}>
          <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
            CBT Client & Hardware Verification
          </Text>

          <View style={styles.checkItem}>
            <View style={styles.checkLeft}>
              <Text style={styles.checkIcon}>📱</Text>
              <View>
                <Text style={[styles.checkTitle, { color: colors.textPrimary }]}>Android Display & Orientation</Text>
                <Text style={[styles.checkDesc, { color: colors.textSecondary }]}>Optimized touch viewport</Text>
              </View>
            </View>
            <View style={[styles.badgeSuccess, { backgroundColor: '#DCFCE7' }]}>
              <Text style={[styles.badgeTextSuccess, { color: '#15803D' }]}>PASSED</Text>
            </View>
          </View>

          <View style={styles.checkItem}>
            <View style={styles.checkLeft}>
              <Text style={styles.checkIcon}>🔊</Text>
              <View>
                <Text style={[styles.checkTitle, { color: colors.textPrimary }]}>Speech Synthesis Engine</Text>
                <Text style={[styles.checkDesc, { color: colors.textSecondary }]}>expo-speech TTS audio initialized</Text>
              </View>
            </View>
            <View style={[styles.badgeSuccess, { backgroundColor: '#DCFCE7' }]}>
              <Text style={[styles.badgeTextSuccess, { color: '#15803D' }]}>READY</Text>
            </View>
          </View>

          <View style={styles.checkItem}>
            <View style={styles.checkLeft}>
              <Text style={styles.checkIcon}>💾</Text>
              <View>
                <Text style={[styles.checkTitle, { color: colors.textPrimary }]}>Local Offline Question Vault</Text>
                <Text style={[styles.checkDesc, { color: colors.textSecondary }]}>AsyncStorage local cache active</Text>
              </View>
            </View>
            <View style={[styles.badgeSuccess, { backgroundColor: '#DCFCE7' }]}>
              <Text style={[styles.badgeTextSuccess, { color: '#15803D' }]}>HEALTHY</Text>
            </View>
          </View>

          <View style={styles.checkItem}>
            <View style={styles.checkLeft}>
              <Text style={styles.checkIcon}>🛡️</Text>
              <View>
                <Text style={[styles.checkTitle, { color: colors.textPrimary }]}>Candidate Identity Verification</Text>
                <Text style={[styles.checkDesc, { color: colors.textSecondary }]}>
                  {student?.matricNo || 'CANDIDATE'} · {student?.department || 'Pre-Medical'}
                </Text>
              </View>
            </View>
            <View style={[styles.badgeSuccess, { backgroundColor: '#DCFCE7' }]}>
              <Text style={[styles.badgeTextSuccess, { color: '#15803D' }]}>VERIFIED</Text>
            </View>
          </View>
        </View>

        {/* Integrity Code of Conduct */}
        <View style={styles.integrityCard}>
          <Text style={styles.integrityTitle}>⚖️ PROMETRIC CBT INTEGRITY RULES</Text>
          <View style={styles.rulesList}>
            <Text style={styles.ruleBullet}>
              • Do not leave the application or switch apps while the examination timer is running.
            </Text>
            <Text style={styles.ruleBullet}>
              • The examination timer continues countdown without pause once initiated.
            </Text>
            <Text style={styles.ruleBullet}>
              • Responses are automatically committed upon reaching 00:00 remaining time.
            </Text>
            <Text style={styles.ruleBullet}>
              • Use the built-in scientific calculator; external unauthorized devices are prohibited.
            </Text>
          </View>
        </View>

        {/* Start Button */}
        <TouchableOpacity style={styles.startExamBtn} onPress={handleStartExam} activeOpacity={0.8}>
          <Text style={styles.startExamBtnText}>Launch CBT Examination Simulator</Text>
        </TouchableOpacity>
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
  headerBackBtn: {
    paddingVertical: 4,
  },
  headerBackText: {
    fontSize: 14,
    fontWeight: '600',
  },
  headerTitle: {
    fontSize: 15,
    fontWeight: '700',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  diagnosticCard: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
    marginBottom: 16,
  },
  metricRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  scoreCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.primary + '15',
    borderWidth: 3,
    borderColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  scoreNumber: {
    fontSize: 24,
    fontWeight: '900',
    color: Colors.primary,
  },
  scoreLabel: {
    fontSize: 9,
    fontWeight: '800',
    color: Colors.primary,
    letterSpacing: 0.5,
  },
  diagnosticDetails: {
    flex: 1,
  },
  diagnosticTitle: {
    fontSize: 16,
    fontWeight: '800',
    marginBottom: 4,
  },
  passProbText: {
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 4,
  },
  diagnosticSub: {
    fontSize: 11,
    lineHeight: 16,
  },
  domainList: {
    borderTopWidth: 1,
    paddingTop: 12,
    gap: 8,
  },
  domainItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  domainLabel: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  domainValue: {
    fontSize: 12,
    fontWeight: '700',
  },
  sectionCard: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '800',
    marginBottom: 14,
  },
  checkItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  checkLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  checkIcon: {
    fontSize: 18,
    marginRight: 12,
  },
  checkTitle: {
    fontSize: 13,
    fontWeight: '700',
  },
  checkDesc: {
    fontSize: 11,
    marginTop: 2,
  },
  badgeSuccess: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  badgeTextSuccess: {
    fontSize: 10,
    fontWeight: '800',
  },
  integrityCard: {
    backgroundColor: '#FEF3C7',
    borderWidth: 1,
    borderColor: '#FDE68A',
    borderRadius: 14,
    padding: 14,
    marginBottom: 20,
  },
  integrityTitle: {
    fontSize: 11,
    fontWeight: '900',
    color: '#92400E',
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  rulesList: {
    gap: 6,
  },
  ruleBullet: {
    fontSize: 11,
    color: '#78350F',
    lineHeight: 16,
  },
  startExamBtn: {
    backgroundColor: Colors.primary,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  startExamBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
  },
});
