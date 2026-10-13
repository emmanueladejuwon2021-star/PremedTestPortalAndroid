import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, ScrollView } from 'react-native';
import { useExam } from '../context/ExamContext';
import { Colors } from '../constants/colors';
import { useTheme } from '../context/ThemeContext';

interface QuestionPaletteModalProps {
  visible: boolean;
  onClose: () => void;
}

export const QuestionPaletteModal: React.FC<QuestionPaletteModalProps> = ({ visible, onClose }) => {
  const { questions, currentIndex, answers, flaggedIds, goToQuestion } = useExam();
  const { colors, isDark } = useTheme();

  const totalQuestions = questions.length;
  const answeredCount = Object.values(answers).filter((a) => a !== null).length;
  const flaggedCount = flaggedIds.length;
  const remainingCount = totalQuestions - answeredCount;

  const handleSelectQuestion = (index: number) => {
    goToQuestion(index);
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={[styles.container, { backgroundColor: colors.cardBg, borderColor: colors.cardBorder }]}>
          {/* Header */}
          <View style={[styles.header, { borderBottomColor: colors.cardBorder }]}>
            <View>
              <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>Question Navigation Palette</Text>
              <Text style={[styles.headerSubtitle, { color: colors.textSecondary }]}>
                Tap any question number to navigate instantly
              </Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn} activeOpacity={0.7}>
              <Text style={styles.closeBtnText}>✕</Text>
            </TouchableOpacity>
          </View>

          {/* Legend */}
          <View style={[styles.legendRow, { backgroundColor: isDark ? colors.slate800 : colors.slate50 }]}>
            <View style={styles.legendItem}>
              <View style={[styles.legendBox, { backgroundColor: Colors.answered }]} />
              <Text style={[styles.legendText, { color: colors.textSecondary }]}>Answered</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendBox, { backgroundColor: Colors.current }]} />
              <Text style={[styles.legendText, { color: colors.textSecondary }]}>Current</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendBox, { backgroundColor: Colors.flagged }]} />
              <Text style={[styles.legendText, { color: colors.textSecondary }]}>Flagged</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendBox, { backgroundColor: Colors.slate300 }]} />
              <Text style={[styles.legendText, { color: colors.textSecondary }]}>Unanswered</Text>
            </View>
          </View>

          {/* Grid Scroll */}
          <ScrollView contentContainerStyle={styles.gridContainer} showsVerticalScrollIndicator={false}>
            {questions.map((q, idx) => {
              const isAnswered = answers[q.id] !== null;
              const isCurrent = idx === currentIndex;
              const isFlagged = flaggedIds.includes(q.id);

              let bgColor = isDark ? colors.slate700 : colors.slate200;
              let textColor = colors.textPrimary;
              let borderColor = 'transparent';

              if (isAnswered) {
                bgColor = Colors.answered;
                textColor = Colors.white;
              }
              if (isFlagged) {
                bgColor = Colors.flagged;
                textColor = Colors.white;
              }
              if (isCurrent) {
                bgColor = Colors.current;
                textColor = Colors.white;
                borderColor = Colors.primaryLight;
              }

              return (
                <TouchableOpacity
                  key={q.id}
                  style={[
                    styles.gridItem,
                    {
                      backgroundColor: bgColor,
                      borderColor: borderColor,
                    },
                  ]}
                  onPress={() => handleSelectQuestion(idx)}
                  activeOpacity={0.7}
                >
                  <Text style={[styles.gridText, { color: textColor }]}>{idx + 1}</Text>
                  {isFlagged && <View style={styles.flagDot} />}
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          {/* Summary Footer */}
          <View style={[styles.footer, { borderTopColor: colors.cardBorder }]}>
            <Text style={[styles.summaryText, { color: Colors.answered }]}>Ans: {answeredCount}</Text>
            <Text style={[styles.summaryText, { color: Colors.flagged }]}>Flagged: {flaggedCount}</Text>
            <Text style={[styles.summaryText, { color: colors.textSecondary }]}>Left: {remainingCount}</Text>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.75)',
    justifyContent: 'flex-end',
  },
  container: {
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    maxHeight: '80%',
    padding: 20,
    borderWidth: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 14,
    borderBottomWidth: 1,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '800',
  },
  headerSubtitle: {
    fontSize: 11,
    marginTop: 2,
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(148, 163, 184, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeBtnText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#64748B',
  },
  legendRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 12,
    padding: 10,
    borderRadius: 14,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  legendBox: {
    width: 12,
    height: 12,
    borderRadius: 3,
  },
  legendText: {
    fontSize: 11,
    fontWeight: '600',
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    paddingVertical: 10,
    justifyContent: 'flex-start',
  },
  gridItem: {
    width: '17.5%',
    aspectRatio: 1,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    position: 'relative',
  },
  gridText: {
    fontSize: 14,
    fontWeight: '800',
  },
  flagDot: {
    position: 'absolute',
    top: 4,
    right: 4,
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#FFF',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 14,
    borderTopWidth: 1,
    marginTop: 8,
  },
  summaryText: {
    fontSize: 13,
    fontWeight: '800',
  },
});
