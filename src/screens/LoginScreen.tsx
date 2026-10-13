import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useAuth } from '../context/AuthContext';
import { MedicalDepartment } from '../types/user';
import { Colors } from '../constants/colors';
import { useTheme } from '../context/ThemeContext';

const DEPARTMENTS: MedicalDepartment[] = [
  'Medicine & Surgery (MBBS)',
  'Pharmacy (PharmD / B.Pharm)',
  'Dentistry (BDS)',
  'Physiotherapy (B.Physio)',
  'Human Anatomy',
  'Medical Physiology',
  'Nursing Science',
  'Medical Laboratory Science',
];

export const LoginScreen: React.FC = () => {
  const { login } = useAuth();
  const { colors, isDark } = useTheme();

  const [matricNo, setMatricNo] = useState('');
  const [fullName, setFullName] = useState('');
  const [selectedDept, setSelectedDept] = useState<MedicalDepartment>('Medicine & Surgery (MBBS)');
  const [errorMsg, setErrorMsg] = useState('');

  const handleLogin = async () => {
    if (!matricNo.trim() || !fullName.trim()) {
      setErrorMsg('Please enter your candidate Matric No and Full Name');
      return;
    }
    setErrorMsg('');
    await login(matricNo, fullName, selectedDept);
  };

  const handleQuickDemo = async (dept: MedicalDepartment, matric: string, name: string) => {
    setMatricNo(matric);
    setFullName(name);
    setSelectedDept(dept);
    await login(matric, name, dept);
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: colors.bg }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Header Branding */}
        <View style={styles.brandBox}>
          <View style={styles.logoBadge}>
            <Text style={styles.logoText}>🩺</Text>
          </View>
          <Text style={[styles.brandTitle, { color: colors.textPrimary }]}>Apex PreMed CBT Portal</Text>
          <Text style={[styles.brandSubtitle, { color: colors.textSecondary }]}>
            Academic Examination &amp; Clinical Preparation Suite
          </Text>
        </View>

        {/* Login Form Card */}
        <View style={[styles.card, { backgroundColor: colors.cardBg, borderColor: colors.cardBorder }]}>
          <Text style={[styles.cardTitle, { color: colors.textPrimary }]}>Candidate Authentication</Text>
          <Text style={[styles.cardDesc, { color: colors.textSecondary }]}>
            Enter your university examination credentials to access your assessment dashboard.
          </Text>

          {errorMsg ? (
            <View style={styles.errorBox}>
              <Text style={styles.errorText}>⚠️ {errorMsg}</Text>
            </View>
          ) : null}

          {/* Full Name */}
          <View style={styles.fieldGroup}>
            <Text style={[styles.label, { color: colors.textSecondary }]}>FULL NAME</Text>
            <TextInput
              style={[
                styles.input,
                { backgroundColor: isDark ? colors.slate800 : colors.slate50, color: colors.textPrimary, borderColor: colors.cardBorder },
              ]}
              placeholder="e.g. Adejuwon Emmanuel"
              placeholderTextColor={colors.textSecondary}
              value={fullName}
              onChangeText={setFullName}
            />
          </View>

          {/* Matriculation No */}
          <View style={styles.fieldGroup}>
            <Text style={[styles.label, { color: colors.textSecondary }]}>MATRICULATION / CANDIDATE NO</Text>
            <TextInput
              style={[
                styles.input,
                { backgroundColor: isDark ? colors.slate800 : colors.slate50, color: colors.textPrimary, borderColor: colors.cardBorder },
              ]}
              placeholder="e.g. MED/2026/0419"
              placeholderTextColor={colors.textSecondary}
              autoCapitalize="characters"
              value={matricNo}
              onChangeText={setMatricNo}
            />
          </View>

          {/* Department Selector */}
          <View style={styles.fieldGroup}>
            <Text style={[styles.label, { color: colors.textSecondary }]}>MEDICAL FACULTY / DEPARTMENT</Text>
            <View style={styles.deptWrap}>
              {DEPARTMENTS.map((dept) => {
                const isSelected = selectedDept === dept;
                return (
                  <TouchableOpacity
                    key={dept}
                    style={[
                      styles.deptChip,
                      {
                        backgroundColor: isSelected ? Colors.primary : isDark ? colors.slate800 : colors.slate100,
                        borderColor: isSelected ? Colors.primary : colors.cardBorder,
                      },
                    ]}
                    onPress={() => setSelectedDept(dept)}
                    activeOpacity={0.7}
                  >
                    <Text style={[styles.deptChipText, { color: isSelected ? Colors.white : colors.textPrimary }]}>
                      {dept}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* Sign In Button */}
          <TouchableOpacity style={styles.submitBtn} onPress={handleLogin} activeOpacity={0.8}>
            <Text style={styles.submitBtnText}>Enter Examination Portal →</Text>
          </TouchableOpacity>
        </View>

        {/* Quick Demo Shortcuts */}
        <View style={styles.demoBox}>
          <Text style={[styles.demoTitle, { color: colors.textSecondary }]}>OR LAUNCH ONE-CLICK DEMO PROFILE</Text>
          <View style={styles.demoRow}>
            <TouchableOpacity
              style={[styles.demoBtn, { borderColor: colors.primary }]}
              onPress={() =>
                handleQuickDemo(
                  'Medicine & Surgery (MBBS)',
                  'MED/2026/0419',
                  'Adejuwon Emmanuel'
                )
              }
              activeOpacity={0.7}
            >
              <Text style={[styles.demoBtnText, { color: colors.primary }]}>MBBS Pre-Med</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.demoBtn, { borderColor: Colors.flagged }]}
              onPress={() =>
                handleQuickDemo(
                  'Pharmacy (PharmD / B.Pharm)',
                  'PHM/2026/0122',
                  'Pharmacy Candidate'
                )
              }
              activeOpacity={0.7}
            >
              <Text style={[styles.demoBtnText, { color: Colors.flagged }]}>PharmD Pre-Med</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.demoBtn, { borderColor: Colors.current }]}
              onPress={() =>
                handleQuickDemo('Dentistry (BDS)', 'DEN/2026/0881', 'Dental Candidate')
              }
              activeOpacity={0.7}
            >
              <Text style={[styles.demoBtnText, { color: Colors.current }]}>BDS Dentistry</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingTop: 50,
    alignItems: 'center',
  },
  brandBox: {
    alignItems: 'center',
    marginBottom: 24,
  },
  logoBadge: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#CCFBF1',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  logoText: {
    fontSize: 32,
  },
  brandTitle: {
    fontSize: 24,
    fontWeight: '900',
    letterSpacing: -0.5,
  },
  brandSubtitle: {
    fontSize: 12,
    fontWeight: '600',
    marginTop: 3,
    textAlign: 'center',
  },
  card: {
    width: '100%',
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 17,
    fontWeight: '800',
  },
  cardDesc: {
    fontSize: 12,
    marginTop: 2,
    marginBottom: 16,
    lineHeight: 18,
  },
  errorBox: {
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FECACA',
    padding: 10,
    borderRadius: 12,
    marginBottom: 14,
  },
  errorText: {
    color: '#991B1B',
    fontSize: 12,
    fontWeight: '600',
  },
  fieldGroup: {
    marginBottom: 14,
  },
  label: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
    marginBottom: 6,
  },
  input: {
    borderWidth: 1.5,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
    fontWeight: '600',
  },
  deptWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  deptChip: {
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 12,
    borderWidth: 1,
  },
  deptChipText: {
    fontSize: 11,
    fontWeight: '700',
  },
  submitBtn: {
    backgroundColor: Colors.primary,
    paddingVertical: 14,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    shadowColor: Colors.primary,
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  submitBtnText: {
    color: Colors.white,
    fontSize: 14,
    fontWeight: '800',
  },
  demoBox: {
    marginTop: 24,
    width: '100%',
    alignItems: 'center',
  },
  demoTitle: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
    marginBottom: 10,
  },
  demoRow: {
    flexDirection: 'row',
    gap: 8,
    width: '100%',
  },
  demoBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  demoBtnText: {
    fontSize: 11,
    fontWeight: '800',
  },
});
