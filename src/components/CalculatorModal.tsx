import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity } from 'react-native';
import { evaluateExpression } from '../utils/calculator';
import { Colors } from '../constants/colors';
import { useTheme } from '../context/ThemeContext';

interface CalculatorModalProps {
  visible: boolean;
  onClose: () => void;
}

export const CalculatorModal: React.FC<CalculatorModalProps> = ({ visible, onClose }) => {
  const { colors, isDark } = useTheme();
  const [expression, setExpression] = useState('');
  const [result, setResult] = useState('0');

  const handlePress = (val: string) => {
    if (val === 'AC') {
      setExpression('');
      setResult('0');
    } else if (val === 'DEL') {
      setExpression((prev) => prev.slice(0, -1));
    } else if (val === '=') {
      if (!expression) return;
      const res = evaluateExpression(expression);
      setResult(res);
    } else if (['sin', 'cos', 'tan', 'sqrt', 'ln', 'log'].includes(val)) {
      setExpression((prev) => prev + `${val}(`);
    } else {
      setExpression((prev) => prev + val);
    }
  };

  const buttons = [
    ['sin', 'cos', 'tan', 'AC', 'DEL'],
    ['sqrt', '^', '(', ')', '÷'],
    ['ln', '7', '8', '9', '×'],
    ['log', '4', '5', '6', '-'],
    ['π', '1', '2', '3', '+'],
    ['e', '0', '.', '=']
  ];

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={[styles.container, { backgroundColor: colors.cardBg, borderColor: colors.cardBorder }]}>
          {/* Header */}
          <View style={[styles.header, { borderBottomColor: colors.cardBorder }]}>
            <Text style={[styles.title, { color: colors.textPrimary }]}>Scientific Calculator</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Text style={styles.closeText}>✕</Text>
            </TouchableOpacity>
          </View>

          {/* Screen Display */}
          <View style={[styles.displayBox, { backgroundColor: isDark ? colors.slate800 : colors.slate100 }]}>
            <Text style={[styles.exprText, { color: colors.textSecondary }]} numberOfLines={1}>
              {expression || '0'}
            </Text>
            <Text style={[styles.resultText, { color: colors.primary }]} numberOfLines={1}>
              = {result}
            </Text>
          </View>

          {/* Keypad */}
          <View style={styles.keypad}>
            {buttons.map((row, rIdx) => (
              <View key={`row_${rIdx}`} style={styles.row}>
                {row.map((btn) => {
                  const isAction = ['AC', 'DEL'].includes(btn);
                  const isOp = ['÷', '×', '-', '+', '='].includes(btn);
                  const isFunc = ['sin', 'cos', 'tan', 'sqrt', 'ln', 'log', '^', '(', ')', 'π', 'e'].includes(btn);

                  let btnBg = isDark ? colors.slate700 : colors.slate50;
                  let textColor = colors.textPrimary;

                  if (isAction) {
                    btnBg = Colors.danger;
                    textColor = Colors.white;
                  } else if (btn === '=') {
                    btnBg = Colors.primary;
                    textColor = Colors.white;
                  } else if (isOp) {
                    btnBg = isDark ? colors.slate600 : colors.slate200;
                    textColor = Colors.primary;
                  } else if (isFunc) {
                    btnBg = isDark ? colors.slate800 : colors.slate100;
                    textColor = isDark ? colors.primaryLight : Colors.primaryDark;
                  }

                  const flexVal = btn === '=' ? 2 : 1;

                  return (
                    <TouchableOpacity
                      key={btn}
                      style={[styles.btn, { backgroundColor: btnBg, flex: flexVal }]}
                      onPress={() => handlePress(btn)}
                      activeOpacity={0.7}
                    >
                      <Text style={[styles.btnText, { color: textColor }]}>{btn}</Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            ))}
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
    padding: 16,
  },
  container: {
    width: '100%',
    maxWidth: 380,
    borderRadius: 24,
    padding: 16,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 10,
    borderBottomWidth: 1,
  },
  title: {
    fontSize: 15,
    fontWeight: '800',
  },
  closeBtn: {
    padding: 4,
  },
  closeText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#64748B',
  },
  displayBox: {
    borderRadius: 16,
    padding: 14,
    marginVertical: 12,
    alignItems: 'flex-end',
  },
  exprText: {
    fontSize: 14,
    fontFamily: 'monospace',
    marginBottom: 4,
  },
  resultText: {
    fontSize: 22,
    fontWeight: '800',
    fontFamily: 'monospace',
  },
  keypad: {
    gap: 8,
  },
  row: {
    flexDirection: 'row',
    gap: 8,
  },
  btn: {
    height: 42,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnText: {
    fontSize: 13,
    fontWeight: '700',
  },
});
