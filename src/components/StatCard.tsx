import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../context/ThemeContext';

interface StatCardProps {
  icon: string;
  label: string;
  value: string | number;
  highlightColor?: string;
  subtext?: string;
}

export const StatCard: React.FC<StatCardProps> = ({ icon, label, value, highlightColor, subtext }) => {
  const { colors } = useTheme();

  return (
    <View style={[styles.card, { backgroundColor: colors.cardBg, borderColor: colors.cardBorder }]}>
      <View style={styles.topRow}>
        <Text style={styles.icon}>{icon}</Text>
        <Text style={[styles.value, { color: highlightColor || colors.textPrimary }]}>{value}</Text>
      </View>
      <Text style={[styles.label, { color: colors.textSecondary }]}>{label}</Text>
      {subtext ? <Text style={[styles.subtext, { color: highlightColor || colors.textSecondary }]}>{subtext}</Text> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flex: 1,
    padding: 14,
    borderRadius: 18,
    borderWidth: 1,
    minWidth: 100,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  icon: {
    fontSize: 20,
  },
  value: {
    fontSize: 20,
    fontWeight: '800',
  },
  label: {
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  subtext: {
    fontSize: 10,
    fontWeight: '600',
    marginTop: 3,
  },
});
