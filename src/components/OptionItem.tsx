import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { QuestionOptionKey } from '../types/question';
import { Colors } from '../constants/colors';
import { useTheme } from '../context/ThemeContext';

interface OptionItemProps {
  optionKey: QuestionOptionKey;
  text: string;
  isSelected: boolean;
  onSelect: () => void;
  // Practice / Review mode states
  isPracticeMode?: boolean;
  isCorrect?: boolean;
  showExplanation?: boolean;
  disabled?: boolean;
}

export const OptionItem: React.FC<OptionItemProps> = ({
  optionKey,
  text,
  isSelected,
  onSelect,
  isPracticeMode = false,
  isCorrect = false,
  showExplanation = false,
  disabled = false,
}) => {
  const { colors, isDark } = useTheme();

  let borderColor = isDark ? colors.slate700 : colors.slate200;
  let bg = isDark ? colors.slate800 : colors.white;
  let pillBg = isDark ? colors.slate700 : colors.slate100;
  let pillText = colors.textPrimary;

  if (isSelected) {
    borderColor = Colors.primary;
    bg = isDark ? 'rgba(20, 184, 166, 0.15)' : '#F0FDFA';
    pillBg = Colors.primary;
    pillText = Colors.white;
  }

  if (showExplanation) {
    if (isCorrect) {
      borderColor = Colors.answered;
      bg = isDark ? 'rgba(16, 185, 129, 0.15)' : '#ECFDF5';
      pillBg = Colors.answered;
      pillText = Colors.white;
    } else if (isSelected && !isCorrect) {
      borderColor = Colors.danger;
      bg = isDark ? 'rgba(239, 68, 68, 0.15)' : '#FEF2F2';
      pillBg = Colors.danger;
      pillText = Colors.white;
    }
  }

  return (
    <TouchableOpacity
      style={[styles.container, { backgroundColor: bg, borderColor }]}
      onPress={onSelect}
      disabled={disabled}
      activeOpacity={0.7}
    >
      <View style={[styles.pill, { backgroundColor: pillBg }]}>
        <Text style={[styles.pillText, { color: pillText }]}>{optionKey}</Text>
      </View>
      <Text style={[styles.text, { color: colors.textPrimary }]}>{text}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 16,
    borderWidth: 1.5,
    marginVertical: 5,
  },
  pill: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  pillText: {
    fontSize: 14,
    fontWeight: '800',
  },
  text: {
    flex: 1,
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 20,
  },
});
