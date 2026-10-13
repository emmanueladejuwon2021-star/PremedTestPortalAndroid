import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { QUESTION_BANKS } from '../data/questionBanks';
import { Question, QuestionOptionKey } from '../types/question';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Colors } from '../constants/colors';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

interface CombatLog {
  id: string;
  text: string;
  type: 'hit' | 'miss' | 'info';
}

export const CombatScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const { student } = useAuth();
  const { colors, isDark } = useTheme();

  // Combine questions for arena
  const [battleQuestions, setBattleQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [hpBlue, setHpBlue] = useState(100);
  const [hpRed, setHpRed] = useState(100);
  const [scoreBlue, setScoreBlue] = useState(0);
  const [scoreRed, setScoreRed] = useState(0);
  const [turn, setTurn] = useState<'blue' | 'red'>('blue');
  const [streak, setStreak] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [winner, setWinner] = useState<string | null>(null);
  const [logs, setLogs] = useState<CombatLog[]>([
    { id: '1', text: '⚔️ Med Combat initiated. Squad Blue (You) attacks first!', type: 'info' },
  ]);
  const [selectedOpt, setSelectedOpt] = useState<QuestionOptionKey | null>(null);
  const [isEvaluating, setIsEvaluating] = useState(false);

  useEffect(() => {
    startNewBattle();
  }, []);

  const startNewBattle = () => {
    // Gather all questions from all banks and shuffle 10 questions
    const allQuestions: Question[] = [];
    Object.values(QUESTION_BANKS).forEach((list) => {
      allQuestions.push(...list);
    });
    const shuffled = [...allQuestions].sort(() => 0.5 - Math.random()).slice(0, 10);
    setBattleQuestions(shuffled);
    setCurrentIndex(0);
    setHpBlue(100);
    setHpRed(100);
    setScoreBlue(0);
    setScoreRed(0);
    setTurn('blue');
    setStreak(0);
    setGameOver(false);
    setWinner(null);
    setSelectedOpt(null);
    setIsEvaluating(false);
    setLogs([
      { id: Date.now().toString(), text: '⚔️ Med Combat Arena ready! Answer clinical questions to strike opponent.', type: 'info' },
    ]);
  };

  const handlePickAnswer = (pick: QuestionOptionKey) => {
    if (isEvaluating || gameOver || battleQuestions.length === 0) return;
    setIsEvaluating(true);
    setSelectedOpt(pick);

    const q = battleQuestions[currentIndex];
    const isCorrect = pick === q.correctAnswer;

    setTimeout(() => {
      if (turn === 'blue') {
        if (isCorrect) {
          const newStreak = streak + 1;
          setStreak(newStreak);
          const damage = 20 + newStreak * 5;
          const nextRedHp = Math.max(0, hpRed - damage);
          setHpRed(nextRedHp);
          setScoreBlue((prev) => prev + 15 + newStreak * 5);

          addLog(`💥 DIRECT HIT! Squad Blue landed Option ${pick}! Dealt ${damage} damage! 🔥 Streak: ${newStreak}x`, 'hit');

          if (nextRedHp <= 0) {
            finishCombat('Squad Blue (You)');
            return;
          }
        } else {
          setStreak(0);
          const nextBlueHp = Math.max(0, hpBlue - 15);
          setHpBlue(nextBlueHp);
          addLog(`⚠️ MISFIRE! Squad Blue picked ${pick} (Key: ${q.correctAnswer}). Recoil took 15 HP!`, 'miss');

          if (nextBlueHp <= 0) {
            finishCombat('Squad Red (Challenger)');
            return;
          }
        }
      } else {
        // Red squad turn (Simulated challenger response)
        // Red has a 75% accuracy rate
        const redIsCorrect = Math.random() < 0.75;
        if (redIsCorrect) {
          const damage = 20;
          const nextBlueHp = Math.max(0, hpBlue - damage);
          setHpBlue(nextBlueHp);
          setScoreRed((prev) => prev + 15);
          addLog(`🚨 Squad Red executed a clinical counter-strike! Dealt ${damage} damage to Blue!`, 'miss');

          if (nextBlueHp <= 0) {
            finishCombat('Squad Red (Challenger)');
            return;
          }
        } else {
          const nextRedHp = Math.max(0, hpRed - 10);
          setHpRed(nextRedHp);
          addLog(`🛡️ Squad Red misidentified the diagnosis! Lost 10 HP.`, 'hit');

          if (nextRedHp <= 0) {
            finishCombat('Squad Blue (You)');
            return;
          }
        }
      }

      // Next round
      const nextIdx = currentIndex + 1;
      if (nextIdx >= battleQuestions.length) {
        // Determine by remaining HP and score
        if (hpBlue > hpRed) finishCombat('Squad Blue (You)');
        else if (hpRed > hpBlue) finishCombat('Squad Red (Challenger)');
        else finishCombat('Stalemate / Draw');
      } else {
        setCurrentIndex(nextIdx);
        setTurn((prev) => (prev === 'blue' ? 'red' : 'blue'));
        setSelectedOpt(null);
        setIsEvaluating(false);
      }
    }, 700);
  };

  const finishCombat = (winnerName: string) => {
    setGameOver(true);
    setWinner(winnerName);
    setIsEvaluating(false);
    addLog(`🏆 BATTLE CONCLUDED! Winner: ${winnerName}`, 'info');
  };

  const addLog = (text: string, type: 'hit' | 'miss' | 'info') => {
    setLogs((prev) => [{ id: Math.random().toString(), text, type }, ...prev.slice(0, 15)]);
  };

  const currentQ = battleQuestions[currentIndex];

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} backgroundColor={colors.background} />

      {/* Arena Navigation Header */}
      <View style={[styles.navHeader, { backgroundColor: colors.cardBg, borderBottomColor: colors.cardBorder }]}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.navigate('MainTabs')}>
          <Text style={[styles.backBtnText, { color: colors.textPrimary }]}>‹ Exit Arena</Text>
        </TouchableOpacity>
        <View style={styles.arenaBadge}>
          <Text style={styles.arenaBadgeText}>⚔️ MED COMBAT ARENA</Text>
        </View>
        <TouchableOpacity style={styles.resetBtn} onPress={startNewBattle}>
          <Text style={styles.resetBtnText}>Restart</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Squad Status Header with Live HP Bars */}
        <View style={styles.battleHeaderGrid}>
          {/* Squad Blue (Player) */}
          <View style={[styles.squadBox, styles.blueSquadBox]}>
            <View style={styles.squadTopRow}>
              <Text style={styles.blueSquadTitle}>🛡️ SQUAD BLUE (YOU)</Text>
              <Text style={styles.blueHpText}>{hpBlue} / 100 HP</Text>
            </View>
            <View style={styles.hpTrack}>
              <View style={[styles.blueHpFill, { width: `${hpBlue}%` }]} />
            </View>
            <View style={styles.scoreStreakRow}>
              <Text style={styles.squadScoreText}>Score: {scoreBlue} pts</Text>
              {streak > 1 && <Text style={styles.streakBadge}>🔥 {streak}x Combo</Text>}
            </View>
          </View>

          {/* Squad Red (Rival) */}
          <View style={[styles.squadBox, styles.redSquadBox]}>
            <View style={styles.squadTopRow}>
              <Text style={styles.redSquadTitle}>🔥 SQUAD RED (RIVAL)</Text>
              <Text style={styles.redHpText}>{hpRed} / 100 HP</Text>
            </View>
            <View style={styles.hpTrack}>
              <View style={[styles.redHpFill, { width: `${hpRed}%` }]} />
            </View>
            <View style={styles.scoreStreakRow}>
              <Text style={styles.squadScoreText}>Score: {scoreRed} pts</Text>
            </View>
          </View>
        </View>

        {/* Turn & Round Indicator */}
        <View style={[styles.turnBanner, { backgroundColor: turn === 'blue' ? '#EFF6FF' : '#FFF1F2' }]}>
          <Text
            style={[
              styles.turnBannerText,
              { color: turn === 'blue' ? Colors.secondary : Colors.danger },
            ]}
          >
            {turn === 'blue' ? '🎯 YOUR TURN TO STRIKE' : '⚡ OPPONENT COUNTER-ATTACK'}
          </Text>
          <Text style={styles.roundText}>
            Round {currentIndex + 1} of {battleQuestions.length || 10}
          </Text>
        </View>

        {/* Question Card or Victory Card */}
        {!gameOver && currentQ ? (
          <View style={[styles.questionCard, { backgroundColor: colors.cardBg, borderColor: colors.cardBorder }]}>
            <View style={styles.qMetaRow}>
              <View style={[styles.topicPill, { backgroundColor: Colors.primary + '15' }]}>
                <Text style={styles.topicPillText}>{currentQ.topic}</Text>
              </View>
              <Text style={[styles.qDifficulty, { color: colors.textSecondary }]}>
                {currentQ.difficulty.toUpperCase()}
              </Text>
            </View>

            <Text style={[styles.questionStem, { color: colors.textPrimary }]}>{currentQ.text}</Text>

            {/* Answer Options */}
            <View style={styles.optionsGrid}>
              {(['A', 'B', 'C', 'D'] as const).map((key) => {
                const isSelected = selectedOpt === key;
                return (
                  <TouchableOpacity
                    key={key}
                    style={[
                      styles.combatOptionBtn,
                      { borderColor: isSelected ? Colors.primary : colors.cardBorder },
                      isSelected && { backgroundColor: Colors.primary + '15' },
                    ]}
                    onPress={() => handlePickAnswer(key)}
                    disabled={isEvaluating}
                    activeOpacity={0.7}
                  >
                    <View
                      style={[
                        styles.optionKeyBadge,
                        { backgroundColor: isSelected ? Colors.primary : colors.cardBorder },
                      ]}
                    >
                      <Text
                        style={[
                          styles.optionKeyText,
                          { color: isSelected ? '#FFFFFF' : colors.textPrimary },
                        ]}
                      >
                        {key}
                      </Text>
                    </View>
                    <Text
                      style={[
                        styles.combatOptionText,
                        { color: colors.textPrimary },
                      ]}
                      numberOfLines={3}
                    >
                      {currentQ.options[key]}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        ) : (
          <View style={[styles.victoryCard, { backgroundColor: colors.cardBg, borderColor: colors.cardBorder }]}>
            <Text style={styles.trophyIcon}>🏆</Text>
            <Text style={[styles.victoryTitle, { color: colors.textPrimary }]}>Duel Concluded!</Text>
            <Text style={styles.winnerSubtitle}>Victor: {winner}</Text>
            <Text style={[styles.finalScores, { color: colors.textSecondary }]}>
              Final Score: {scoreBlue} (Blue) vs {scoreRed} (Red)
            </Text>

            <View style={styles.victoryActionRow}>
              <TouchableOpacity style={styles.playAgainBtn} onPress={startNewBattle}>
                <Text style={styles.playAgainText}>⚔️ Duel Again</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.portalReturnBtn, { borderColor: colors.cardBorder }]}
                onPress={() => navigation.navigate('MainTabs')}
              >
                <Text style={[styles.portalReturnText, { color: colors.textPrimary }]}>Return to Portal</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Combat Feed Terminal */}
        <View style={styles.terminalContainer}>
          <View style={styles.terminalHeader}>
            <Text style={styles.terminalTitle}>TERMINAL COMBAT FEED</Text>
            <View style={styles.liveIndicator}>
              <View style={styles.greenPulseDot} />
              <Text style={styles.liveText}>LIVE</Text>
            </View>
          </View>
          <ScrollView style={styles.logsScroll} nestedScrollEnabled showsVerticalScrollIndicator={false}>
            {logs.map((log) => {
              const logColor =
                log.type === 'hit' ? '#34D399' : log.type === 'miss' ? '#F87171' : '#94A3B8';
              return (
                <Text key={log.id} style={[styles.logText, { color: logColor }]}>
                  &gt; {log.text}
                </Text>
              );
            })}
          </ScrollView>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  navHeader: {
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
  arenaBadge: {
    backgroundColor: '#FFE4E6',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FECDD3',
  },
  arenaBadgeText: {
    color: '#E11D48',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  resetBtn: {
    paddingVertical: 4,
  },
  resetBtnText: {
    color: Colors.primary,
    fontSize: 13,
    fontWeight: '700',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  battleHeaderGrid: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 12,
  },
  squadBox: {
    flex: 1,
    borderRadius: 16,
    padding: 12,
    borderWidth: 1,
  },
  blueSquadBox: {
    backgroundColor: '#EFF6FF',
    borderColor: '#BFDBFE',
  },
  redSquadBox: {
    backgroundColor: '#FFF1F2',
    borderColor: '#FECDD3',
  },
  squadTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  blueSquadTitle: {
    fontSize: 10,
    fontWeight: '900',
    color: '#1E40AF',
  },
  blueHpText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#1E40AF',
  },
  redSquadTitle: {
    fontSize: 10,
    fontWeight: '900',
    color: '#9F1239',
  },
  redHpText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#9F1239',
  },
  hpTrack: {
    height: 8,
    backgroundColor: 'rgba(0,0,0,0.08)',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 6,
  },
  blueHpFill: {
    height: '100%',
    backgroundColor: '#2563EB',
    borderRadius: 4,
  },
  redHpFill: {
    height: '100%',
    backgroundColor: '#E11D48',
    borderRadius: 4,
  },
  scoreStreakRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  squadScoreText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#475569',
  },
  streakBadge: {
    fontSize: 10,
    fontWeight: '900',
    color: '#EA580C',
  },
  turnBanner: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 10,
    marginBottom: 14,
  },
  turnBannerText: {
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  roundText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#64748B',
  },
  questionCard: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
    marginBottom: 14,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
  },
  qMetaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  topicPill: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  topicPillText: {
    color: Colors.primary,
    fontSize: 11,
    fontWeight: '700',
  },
  qDifficulty: {
    fontSize: 11,
    fontWeight: '700',
  },
  questionStem: {
    fontSize: 15,
    lineHeight: 22,
    fontWeight: '600',
    marginBottom: 16,
  },
  optionsGrid: {
    gap: 8,
  },
  combatOptionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 10,
    borderWidth: 1.5,
  },
  optionKeyBadge: {
    width: 24,
    height: 24,
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  optionKeyText: {
    fontSize: 11,
    fontWeight: '800',
  },
  combatOptionText: {
    flex: 1,
    fontSize: 13,
    fontWeight: '600',
  },
  victoryCard: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 24,
    alignItems: 'center',
    marginBottom: 14,
  },
  trophyIcon: {
    fontSize: 48,
    marginBottom: 8,
  },
  victoryTitle: {
    fontSize: 22,
    fontWeight: '800',
    marginBottom: 4,
  },
  winnerSubtitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.primary,
    marginBottom: 8,
  },
  finalScores: {
    fontSize: 13,
    fontWeight: '500',
    marginBottom: 20,
  },
  victoryActionRow: {
    flexDirection: 'row',
    gap: 12,
  },
  playAgainBtn: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 10,
  },
  playAgainText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 13,
  },
  portalReturnBtn: {
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 10,
  },
  portalReturnText: {
    fontWeight: '600',
    fontSize: 13,
  },
  terminalContainer: {
    backgroundColor: '#0F172A',
    borderRadius: 16,
    padding: 14,
  },
  terminalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#1E293B',
    marginBottom: 10,
  },
  terminalTitle: {
    color: '#64748B',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1,
  },
  liveIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  greenPulseDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#10B981',
  },
  liveText: {
    color: '#10B981',
    fontSize: 9,
    fontWeight: '900',
  },
  logsScroll: {
    maxHeight: 140,
  },
  logText: {
    fontSize: 11,
    fontFamily: 'monospace',
    lineHeight: 18,
  },
});
