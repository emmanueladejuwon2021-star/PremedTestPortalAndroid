import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity } from 'react-native';
import { Colors } from '../constants/colors';
import { useTheme } from '../context/ThemeContext';

interface SubmitConfirmationModalProps {
  visible: boolean;
  totalQuestions: number;
  answeredCount: number;
  flaggedCount: number;
  onConfirm: () => void;
  onCancel: () => void;
}

export const SubmitConfirmationModal: React.FC<SubmitConfirmationModalProps> = ({
  visible,
  totalQuestions,
  answeredCount,
  flaggedCount,
  onConfirm,
  onCancel,
}) => {
  const { colors, isDark } = useTheme();
  const unansweredCount = totalQuestions - answeredCount;

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onCancel}>
      <View style={styles.overlay}>
        <View style={[styles.card, { backgroundColor: colors.cardBg, borderColor: colors.cardBorder }]}>
          {/* Header Icon */}
          <View style={styles.iconCircle}>
            <Text style={styles.iconText}>📝</Text>
          </View>

          <Text style={[styles.title, { color: colors.textPrimary }]}>Submit Examination Paper?</Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            Review your completion tally before irreversible grading:
          </Text>

          {/* Stats Breakdown Grid */}
          <View style={[styles.statsRow, { backgroundColor: isDark ? colors.slate800 : colors.slate50 }]}>
            <View style={styles.statCol}>
              <Text style={[styles.statValue, { color: Colors.answered }]}>{answeredCount}</Text>
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Answered</Text>
            </View>

            <View style={styles.statCol}>
              <Text style={[styles.statValue, { color: unansweredCount > 0 ? Colors.danger : Colors.answered }]}>
                {unansweredCount}
              </Text>
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Unanswered</Text>
            </View>

            <View style={styles.statCol}>
              <Text style={[styles.statValue, { color: Colors.flagged }]}>{flaggedCount}</Text>
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Flagged</Text>
            </View>
          </View>

          {unansweredCount > 0 && (
            <View style={styles.warningBox}>
              <Text style={styles.warningText}>
                ⚠️ Attention: You still have {unansweredCount} unattempted question{unansweredCount === 1 ? '' : 's'}.
                Unanswered items will score zero marks.
              </Text>
            </View>
          )}

          {/* Action Buttons */}
          <View style={styles.actionRow}>
            <TouchableOpacity style={styles.cancelBtn} onPress={onCancel} activeOpacity={0.7}>
              <Text style={styles.cancelText}>Review Paper</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.confirmBtn} onPress={onConfirm} activeOpacity={0.8}>
              <Text style={styles.confirmText}>Submit & Grade →</Text>
            </TouchableOpacity>
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
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  card: {
    width: '100%',
    maxWidth: 380,
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
  },
  iconCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#CCFBF1',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  iconText: {
    fontSize: 26,
  },
  title: {
    fontSize: 18,
    fontWeight: '800',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 12,
    textAlign: 'center',
    marginTop: 4,
    marginBottom: 16,
  },
  statsRow: {
    flexDirection: 'row',
    width: '100%',
    paddingVertical: 14,
    borderRadius: 16,
    justifyContent: 'space-around',
    marginBottom: 14,
  },
  statCol: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 18,
    fontWeight: '800',
  },
  statLabel: {
    fontSize: 11,
    fontWeight: '600',
    marginTop: 2,
  },
  warningBox: {
    backgroundColor: '#FEF2F2',
    borderColor: '#FECACA',
    borderWidth: 1,
    borderRadius: 12,
    padding: 10,
    width: '100%',
    marginBottom: 16,
  },
  warningText: {
    color: '#991B1B',
    fontSize: 11,
    fontWeight: '600',
    lineHeight: 16,
  },
  actionRow: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  cancelBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 14,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#475569',
  },
  confirmBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 14,
    backgroundColor: Colors.danger,
    alignItems: 'center',
    justifyContent: 'center',
  },
  confirmText: {
    fontSize: 13,
    fontWeight: '800',
    color: Colors.white,
  },
});
