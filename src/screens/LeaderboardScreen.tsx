import React, { useState } from 'react';
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
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Colors } from '../constants/colors';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

interface LeaderboardEntry {
  rank: number;
  name: string;
  matricNo: string;
  department: string;
  avgScore: number;
  testsCompleted: number;
  streak: number;
  isCurrentUser?: boolean;
}

const LEADERBOARD_DATA: LeaderboardEntry[] = [
  {
    rank: 1,
    name: 'Oluwaseun Balogun',
    matricNo: 'MED/2026/0014',
    department: 'Medicine & Surgery',
    avgScore: 98.4,
    testsCompleted: 34,
    streak: 18,
  },
  {
    rank: 2,
    name: 'Chiamaka Okonkwo',
    matricNo: 'PHA/2026/0042',
    department: 'Pharmacy',
    avgScore: 96.8,
    testsCompleted: 29,
    streak: 14,
  },
  {
    rank: 3,
    name: 'Ibrahim Danjuma',
    matricNo: 'MED/2026/0088',
    department: 'Medicine & Surgery',
    avgScore: 95.2,
    testsCompleted: 31,
    streak: 11,
  },
  {
    rank: 4,
    name: 'Emmanuel Adejuwon',
    matricNo: 'MED/2026/0142',
    department: 'Medicine & Surgery',
    avgScore: 94.6,
    testsCompleted: 26,
    streak: 9,
    isCurrentUser: true,
  },
  {
    rank: 5,
    name: 'Fatima Aliyu',
    matricNo: 'DEN/2026/0019',
    department: 'BDS Dentistry',
    avgScore: 93.0,
    testsCompleted: 22,
    streak: 8,
  },
  {
    rank: 6,
    name: 'David Adeleke',
    matricNo: 'NUR/2026/0061',
    department: 'Nursing Science',
    avgScore: 91.5,
    testsCompleted: 20,
    streak: 6,
  },
  {
    rank: 7,
    name: 'Blessing Eze',
    matricNo: 'MLS/2026/0033',
    department: 'Medical Lab Science',
    avgScore: 89.8,
    testsCompleted: 19,
    streak: 5,
  },
  {
    rank: 8,
    name: 'Tunde Bakare',
    matricNo: 'MED/2026/0201',
    department: 'Medicine & Surgery',
    avgScore: 88.4,
    testsCompleted: 18,
    streak: 4,
  },
];

export const LeaderboardScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const { student } = useAuth();
  const { colors, isDark } = useTheme();

  const [selectedDept, setSelectedDept] = useState('ALL');

  const departments = [
    'ALL',
    'Medicine & Surgery',
    'Pharmacy',
    'BDS Dentistry',
    'Nursing Science',
    'Medical Lab Science',
  ];

  const filteredEntries = LEADERBOARD_DATA.filter((entry) => {
    if (selectedDept === 'ALL') return true;
    return entry.department === selectedDept;
  });

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} backgroundColor={colors.background} />

      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.cardBg, borderBottomColor: colors.cardBorder }]}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.navigate('MainTabs')}>
          <Text style={[styles.backBtnText, { color: colors.textPrimary }]}>‹ Back</Text>
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>Pre-Med Cohort Rankings</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Current Student Ranking Card */}
        <View style={[styles.myRankCard, { backgroundColor: Colors.primary }]}>
          <View style={styles.myRankTop}>
            <View>
              <Text style={styles.myRankLabel}>YOUR COHORT STANDING</Text>
              <Text style={styles.myRankName}>{student?.name || 'Emmanuel Adejuwon'}</Text>
              <Text style={styles.myRankMatric}>{student?.matricNo || 'MED/2026/0142'}</Text>
            </View>
            <View style={styles.myRankCircle}>
              <Text style={styles.myRankHash}>#4</Text>
              <Text style={styles.myRankSub}>OF 480</Text>
            </View>
          </View>
          <View style={styles.myRankStatsRow}>
            <Text style={styles.myRankStatItem}>📊 Avg: 94.6%</Text>
            <Text style={styles.myRankStatItem}>📝 26 Tests</Text>
            <Text style={styles.myRankStatItem}>🔥 9x Streak</Text>
          </View>
        </View>

        {/* Department Filter Chips */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.deptChipRow}>
          {departments.map((dept) => {
            const isActive = selectedDept === dept;
            return (
              <TouchableOpacity
                key={dept}
                style={[styles.deptChip, isActive && styles.deptChipActive]}
                onPress={() => setSelectedDept(dept)}
              >
                <Text style={[styles.deptChipText, isActive && styles.deptChipTextActive]}>
                  {dept === 'ALL' ? 'All Departments' : dept}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Podium Top 3 */}
        {selectedDept === 'ALL' && (
          <View style={styles.podiumContainer}>
            {/* 2nd Place */}
            <View style={[styles.podiumCard, { backgroundColor: colors.cardBg, borderColor: colors.cardBorder }]}>
              <Text style={styles.silverMedal}>🥈</Text>
              <Text style={[styles.podiumName, { color: colors.textPrimary }]} numberOfLines={1}>
                {LEADERBOARD_DATA[1].name}
              </Text>
              <Text style={styles.podiumScore}>{LEADERBOARD_DATA[1].avgScore}%</Text>
              <Text style={[styles.podiumRankText, { color: colors.textTertiary }]}>2nd Place</Text>
            </View>

            {/* 1st Place */}
            <View
              style={[
                styles.podiumCard,
                styles.podiumGoldCard,
                { backgroundColor: colors.cardBg, borderColor: '#F59E0B' },
              ]}
            >
              <Text style={styles.goldMedal}>👑 🥇</Text>
              <Text style={[styles.podiumName, { color: colors.textPrimary }]} numberOfLines={1}>
                {LEADERBOARD_DATA[0].name}
              </Text>
              <Text style={[styles.podiumScore, { color: '#D97706' }]}>{LEADERBOARD_DATA[0].avgScore}%</Text>
              <Text style={[styles.podiumRankText, { color: '#D97706' }]}>1st Place</Text>
            </View>

            {/* 3rd Place */}
            <View style={[styles.podiumCard, { backgroundColor: colors.cardBg, borderColor: colors.cardBorder }]}>
              <Text style={styles.bronzeMedal}>🥉</Text>
              <Text style={[styles.podiumName, { color: colors.textPrimary }]} numberOfLines={1}>
                {LEADERBOARD_DATA[2].name}
              </Text>
              <Text style={styles.podiumScore}>{LEADERBOARD_DATA[2].avgScore}%</Text>
              <Text style={[styles.podiumRankText, { color: colors.textTertiary }]}>3rd Place</Text>
            </View>
          </View>
        )}

        {/* Leaderboard Table List */}
        <View style={[styles.listContainer, { backgroundColor: colors.cardBg, borderColor: colors.cardBorder }]}>
          {filteredEntries.map((entry) => {
            const isMe = entry.isCurrentUser;
            return (
              <View
                key={entry.matricNo}
                style={[
                  styles.entryRow,
                  isMe && { backgroundColor: Colors.primary + '10' },
                  { borderBottomColor: colors.cardBorder },
                ]}
              >
                <View style={styles.rankBadge}>
                  <Text style={[styles.rankNumber, { color: entry.rank <= 3 ? Colors.primary : colors.textSecondary }]}>
                    #{entry.rank}
                  </Text>
                </View>

                <View style={styles.entryDetails}>
                  <View style={styles.entryNameRow}>
                    <Text style={[styles.entryName, { color: colors.textPrimary }]} numberOfLines={1}>
                      {entry.name} {isMe && '(You)'}
                    </Text>
                  </View>
                  <Text style={[styles.entryDept, { color: colors.textSecondary }]}>
                    {entry.matricNo} · {entry.department}
                  </Text>
                </View>

                <View style={styles.entryScoreCol}>
                  <Text style={[styles.entryAvgScore, { color: Colors.primary }]}>{entry.avgScore}%</Text>
                  <Text style={[styles.entryStreakText, { color: '#EA580C' }]}>🔥 {entry.streak}x</Text>
                </View>
              </View>
            );
          })}
        </View>
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
  myRankCard: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    elevation: 3,
  },
  myRankTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  myRankLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: '#CCFBF1',
    letterSpacing: 0.5,
  },
  myRankName: {
    fontSize: 17,
    fontWeight: '800',
    color: '#FFFFFF',
    marginTop: 2,
  },
  myRankMatric: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 1,
  },
  myRankCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  myRankHash: {
    fontSize: 20,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  myRankSub: {
    fontSize: 8,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  myRankStatsRow: {
    flexDirection: 'row',
    gap: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.2)',
    paddingTop: 10,
  },
  myRankStatItem: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  deptChipRow: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  deptChip: {
    backgroundColor: '#E2E8F0',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
    marginRight: 8,
  },
  deptChipActive: {
    backgroundColor: Colors.primary,
  },
  deptChipText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#475569',
  },
  deptChipTextActive: {
    color: '#FFFFFF',
  },
  podiumContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: 16,
    gap: 8,
  },
  podiumCard: {
    flex: 1,
    borderRadius: 14,
    borderWidth: 1,
    padding: 10,
    alignItems: 'center',
  },
  podiumGoldCard: {
    borderWidth: 2,
    transform: [{ scale: 1.05 }],
  },
  goldMedal: {
    fontSize: 22,
    marginBottom: 4,
  },
  silverMedal: {
    fontSize: 20,
    marginBottom: 4,
  },
  bronzeMedal: {
    fontSize: 20,
    marginBottom: 4,
  },
  podiumName: {
    fontSize: 11,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 2,
  },
  podiumScore: {
    fontSize: 13,
    fontWeight: '900',
    color: Colors.primary,
  },
  podiumRankText: {
    fontSize: 9,
    fontWeight: '700',
    marginTop: 2,
  },
  listContainer: {
    borderRadius: 16,
    borderWidth: 1,
    overflow: 'hidden',
  },
  entryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
  },
  rankBadge: {
    width: 32,
    alignItems: 'center',
    marginRight: 8,
  },
  rankNumber: {
    fontSize: 13,
    fontWeight: '800',
  },
  entryDetails: {
    flex: 1,
    marginRight: 8,
  },
  entryNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  entryName: {
    fontSize: 13,
    fontWeight: '700',
  },
  entryDept: {
    fontSize: 11,
    marginTop: 2,
  },
  entryScoreCol: {
    alignItems: 'flex-end',
  },
  entryAvgScore: {
    fontSize: 14,
    fontWeight: '900',
  },
  entryStreakText: {
    fontSize: 10,
    fontWeight: '800',
    marginTop: 2,
  },
});
