import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  StatusBar,
  Image,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { useExam } from '../context/ExamContext';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Colors } from '../constants/colors';
import { formatTimer } from '../utils/formatters';
import { OptionItem } from '../components/OptionItem';
import { QuestionPaletteModal } from '../components/QuestionPaletteModal';
import { CalculatorModal } from '../components/CalculatorModal';
import { DiagramModal } from '../components/DiagramModal';
import { SubmitConfirmationModal } from '../components/SubmitConfirmationModal';
import { SpeechService } from '../services/speechService';
import { QuestionOptionKey } from '../types/question';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export const ExamScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const { student } = useAuth();
  const {
    questions,
    currentIndex,
    answers,
    flaggedIds,
    secondsRemaining,
    fontSizeScale,
    currentConfig,
    selectOption,
    clearSelection,
    toggleFlag,
    nextQuestion,
    prevQuestion,
    toggleFontSize,
    submitExam,
  } = useExam();
  const { colors, isDark } = useTheme();

  // Modals state
  const [paletteVisible, setPaletteVisible] = useState(false);
  const [calcVisible, setCalcVisible] = useState(false);
  const [diagramVisible, setDiagramVisible] = useState(false);
  const [submitModalVisible, setSubmitModalVisible] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const currentQ = questions[currentIndex];
  const totalQuestions = questions.length;
  const answeredCount = Object.values(answers).filter((a) => a !== null).length;
  const isFlagged = currentQ ? flaggedIds.includes(currentQ.id) : false;
  const isTimerCritical = secondsRemaining <= 300; // Under 5 minutes

  if (!currentQ) {
    return (
      <View style={[styles.centerContainer, { backgroundColor: colors.bg }]}>
        <Text style={[styles.errorText, { color: colors.textPrimary }]}>No active examination session.</Text>
        <TouchableOpacity
          style={styles.returnBtn}
          onPress={() => navigation.goBack()}
          activeOpacity={0.8}
        >
          <Text style={styles.returnBtnText}>Return to Courses</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const handleSpeak = async () => {
    if (isSpeaking) {
      await SpeechService.stop();
      setIsSpeaking(false);
    } else {
      setIsSpeaking(true);
      const textToRead = `${currentQ.text}. Option A: ${currentQ.options.A}. Option B: ${currentQ.options.B}. Option C: ${currentQ.options.C}. Option D: ${currentQ.options.D}.`;
      await SpeechService.speak(textToRead, () => setIsSpeaking(false));
    }
  };

  const handleConfirmSubmit = async () => {
    setSubmitModalVisible(false);
    await SpeechService.stop();
    const result = await submitExam();
    navigation.replace('Results', { resultId: result.id });
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: isDark ? colors.slate900 : Colors.primary }]}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.primary} />

      {/* Top Prometric CBT Examination Header */}
      <View style={styles.cbtHeader}>
        <View style={styles.cbtHeaderLeft}>
          <Text style={styles.councilLabel}>PMSEC PROCTORED EXAMINATION</Text>
          <Text style={styles.candidateMatricHeader}>
            {student?.matricNo || 'CANDIDATE'} · {currentConfig?.courseCode || 'MED 101'}
          </Text>
        </View>

        {/* Digital Countdown Timer */}
        <View style={[styles.timerPill, isTimerCritical ? styles.timerCriticalPill : null]}>
          <Text style={styles.timerIcon}>⏱</Text>
          <Text style={[styles.timerValue, isTimerCritical ? styles.timerCriticalText : null]}>
            {formatTimer(secondsRemaining)}
          </Text>
        </View>
      </View>

      {/* CBT Tool Ribbon */}
      <View style={[styles.toolRibbon, { backgroundColor: colors.cardBg, borderBottomColor: colors.cardBorder }]}>
        <View style={styles.toolLeft}>
          <View style={styles.questionNumBadge}>
            <Text style={styles.questionNumText}>
              Q{currentIndex + 1} of {totalQuestions}
            </Text>
          </View>

          {/* Tools */}
          <TouchableOpacity
            style={[styles.toolIconBtn, isSpeaking ? styles.toolActive : null]}
            onPress={handleSpeak}
            accessibilityLabel="Read Aloud"
            activeOpacity={0.7}
          >
            <Text style={styles.toolIconText}>{isSpeaking ? '🔊' : '🔈'}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.toolIconBtn}
            onPress={() => setCalcVisible(true)}
            accessibilityLabel="Scientific Calculator"
            activeOpacity={0.7}
          >
            <Text style={styles.toolIconText}>🧮</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.toolIconBtn}
            onPress={toggleFontSize}
            accessibilityLabel="Adjust Font Size"
            activeOpacity={0.7}
          >
            <Text style={styles.toolIconText}>A±</Text>
          </TouchableOpacity>
        </View>

        {/* Red Submit Exam Button */}
        <TouchableOpacity
          style={styles.submitExamBtn}
          onPress={() => setSubmitModalVisible(true)}
          activeOpacity={0.8}
        >
          <Text style={styles.submitExamBtnText}>SUBMIT EXAM</Text>
        </TouchableOpacity>
      </View>

      {/* Main Question Stem & Options Scroll Area */}
      <ScrollView contentContainerStyle={styles.mainScroll} showsVerticalScrollIndicator={false}>
        <View style={[styles.questionCard, { backgroundColor: colors.cardBg, borderColor: colors.cardBorder }]}>
          {/* Question Stem */}
          <Text
            style={[
              styles.questionStem,
              {
                color: colors.textPrimary,
                fontSize: 16 * fontSizeScale,
                lineHeight: 24 * fontSizeScale,
              },
            ]}
          >
            {currentQ.text}
          </Text>

          {/* Diagram Preview (if present) */}
          {currentQ.diagramUrl ? (
            <TouchableOpacity
              style={styles.diagramContainer}
              onPress={() => setDiagramVisible(true)}
              activeOpacity={0.85}
            >
              <Image source={{ uri: currentQ.diagramUrl }} style={styles.diagramThumb} resizeMode="contain" />
              <Text style={styles.diagramHint}>🔍 Tap diagram to enlarge</Text>
            </TouchableOpacity>
          ) : null}

          {/* Response Choices (Radio CBT Style) */}
          <View style={styles.optionsList}>
            {(['A', 'B', 'C', 'D'] as QuestionOptionKey[]).map((optKey) => (
              <OptionItem
                key={optKey}
                optionKey={optKey}
                text={currentQ.options[optKey]}
                isSelected={answers[currentQ.id] === optKey}
                onSelect={() => selectOption(currentQ.id, optKey)}
              />
            ))}
          </View>
        </View>
      </ScrollView>

      {/* Bottom CBT Navigation Action Bar */}
      <View style={[styles.bottomBar, { backgroundColor: colors.cardBg, borderTopColor: colors.cardBorder }]}>
        <View style={styles.navBtnsRow}>
          <TouchableOpacity
            style={[styles.navBtn, styles.prevBtn, currentIndex === 0 ? styles.navBtnDisabled : null]}
            onPress={prevQuestion}
            disabled={currentIndex === 0}
            activeOpacity={0.7}
          >
            <Text style={styles.prevBtnText}>‹ PREV</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.paletteTriggerBtn, { borderColor: Colors.primary }]}
            onPress={() => setPaletteVisible(true)}
            activeOpacity={0.7}
          >
            <Text style={styles.paletteTriggerText}>
              Grid ({answeredCount}/{totalQuestions})
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.navBtn, styles.nextBtn, currentIndex === totalQuestions - 1 ? styles.navBtnDisabled : null]}
            onPress={nextQuestion}
            disabled={currentIndex === totalQuestions - 1}
            activeOpacity={0.7}
          >
            <Text style={styles.nextBtnText}>NEXT ›</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.subActionsRow}>
          <TouchableOpacity onPress={() => clearSelection(currentQ.id)} activeOpacity={0.6}>
            <Text style={[styles.clearText, { color: colors.textSecondary }]}>Clear Choice</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.flagBtn, isFlagged ? styles.flagBtnActive : null]}
            onPress={() => toggleFlag(currentQ.id)}
            activeOpacity={0.7}
          >
            <Text style={[styles.flagBtnText, isFlagged ? styles.flagBtnActiveText : null]}>
              {isFlagged ? '★ FLAGGED' : '☆ BOOKMARK'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Palette Modal */}
      <QuestionPaletteModal visible={paletteVisible} onClose={() => setPaletteVisible(false)} />

      {/* Calculator Modal */}
      <CalculatorModal visible={calcVisible} onClose={() => setCalcVisible(false)} />

      {/* Diagram Zoom Modal */}
      <DiagramModal
        visible={diagramVisible}
        imageUrl={currentQ.diagramUrl}
        onClose={() => setDiagramVisible(false)}
      />

      {/* Submit Confirmation Modal */}
      <SubmitConfirmationModal
        visible={submitModalVisible}
        totalQuestions={totalQuestions}
        answeredCount={answeredCount}
        flaggedCount={flaggedIds.length}
        onConfirm={handleConfirmSubmit}
        onCancel={() => setSubmitModalVisible(false)}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  centerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 16,
  },
  returnBtn: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 14,
  },
  returnBtnText: {
    color: Colors.white,
    fontWeight: '800',
  },
  cbtHeader: {
    backgroundColor: Colors.primary,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  cbtHeaderLeft: {
    flex: 1,
  },
  councilLabel: {
    color: '#CCFBF1',
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  candidateMatricHeader: {
    color: Colors.white,
    fontSize: 13,
    fontWeight: '800',
    fontFamily: 'monospace',
    marginTop: 2,
  },
  timerPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.25)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 6,
  },
  timerCriticalPill: {
    backgroundColor: '#FEF2F2',
    borderColor: '#EF4444',
    borderWidth: 1.5,
  },
  timerIcon: {
    fontSize: 14,
  },
  timerValue: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: '800',
    fontFamily: 'monospace',
  },
  timerCriticalText: {
    color: '#DC2626',
    fontWeight: '900',
  },
  toolRibbon: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
  },
  toolLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  questionNumBadge: {
    backgroundColor: '#CCFBF1',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
  },
  questionNumText: {
    color: '#0F766E',
    fontSize: 12,
    fontWeight: '800',
    fontFamily: 'monospace',
  },
  toolIconBtn: {
    width: 34,
    height: 34,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F8FAFC',
  },
  toolActive: {
    backgroundColor: '#CCFBF1',
    borderColor: Colors.primary,
  },
  toolIconText: {
    fontSize: 14,
    fontWeight: '700',
  },
  submitExamBtn: {
    backgroundColor: '#E11D48',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 12,
    shadowColor: '#E11D48',
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 3,
  },
  submitExamBtnText: {
    color: Colors.white,
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  mainScroll: {
    padding: 16,
    paddingBottom: 20,
  },
  questionCard: {
    borderRadius: 22,
    padding: 18,
    borderWidth: 1,
  },
  questionStem: {
    fontWeight: '600',
    marginBottom: 16,
  },
  diagramContainer: {
    alignItems: 'center',
    marginBottom: 16,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 8,
    backgroundColor: '#F8FAFC',
  },
  diagramThumb: {
    width: '100%',
    height: 180,
  },
  diagramHint: {
    fontSize: 11,
    color: Colors.primary,
    fontWeight: '600',
    marginTop: 4,
  },
  optionsList: {
    marginTop: 6,
  },
  bottomBar: {
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 20,
    borderTopWidth: 1,
  },
  navBtnsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  navBtn: {
    flex: 1,
    paddingVertical: 11,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  prevBtn: {
    backgroundColor: Colors.slate800,
  },
  prevBtnText: {
    color: Colors.white,
    fontSize: 12,
    fontWeight: '800',
  },
  nextBtn: {
    backgroundColor: Colors.primary,
  },
  nextBtnText: {
    color: Colors.white,
    fontSize: 12,
    fontWeight: '800',
  },
  navBtnDisabled: {
    opacity: 0.3,
  },
  paletteTriggerBtn: {
    flex: 1.2,
    paddingVertical: 10,
    borderRadius: 14,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  paletteTriggerText: {
    color: Colors.primary,
    fontSize: 12,
    fontWeight: '800',
  },
  subActionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  clearText: {
    fontSize: 11,
    fontWeight: '600',
  },
  flagBtn: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    backgroundColor: '#F1F5F9',
  },
  flagBtnActive: {
    backgroundColor: '#FEF3C7',
  },
  flagBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#64748B',
  },
  flagBtnActiveText: {
    color: '#B45309',
  },
});
