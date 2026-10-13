import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
  TextInput,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Colors } from '../constants/colors';
import { StorageService } from '../services/storageService';

export const ProfileScreen: React.FC = () => {
  const { student, updateProfile, logout } = useAuth();
  const { colors, isDark, toggleTheme } = useTheme();

  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(student?.name || '');
  const [matricNo, setMatricNo] = useState(student?.matricNo || '');
  const [department, setDepartment] = useState(student?.department || '');

  const handleSaveProfile = async () => {
    if (!name.trim() || !matricNo.trim()) {
      Alert.alert('Validation Error', 'Candidate Name and Matric Number cannot be empty.');
      return;
    }
    await updateProfile({
      name: name.trim(),
      matricNo: matricNo.trim(),
      department: department.trim(),
    });
    setIsEditing(false);
    Alert.alert('Profile Updated', 'Candidate profile details updated successfully.');
  };

  const handleClearData = () => {
    Alert.alert(
      'Clear Local Data',
      'Are you sure you want to clear your local exam history and question bookmarks? This cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear Data',
          style: 'destructive',
          onPress: async () => {
            await StorageService.clearActiveExamBackup();
            Alert.alert('Cleared', 'Local cache and bookmarks have been reset.');
          },
        },
      ]
    );
  };

  const handleLogout = () => {
    Alert.alert('Sign Out', 'Are you sure you wish to exit candidate session?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Log Out', style: 'destructive', onPress: logout },
    ]);
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} backgroundColor={colors.background} />

      {/* Screen Header */}
      <View style={[styles.header, { backgroundColor: colors.cardBg, borderBottomColor: colors.cardBorder }]}>
        <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>Candidate Profile</Text>
        <TouchableOpacity
          style={styles.editBtn}
          onPress={() => {
            if (isEditing) {
              handleSaveProfile();
            } else {
              setIsEditing(true);
            }
          }}
        >
          <Text style={styles.editBtnText}>{isEditing ? 'Save' : 'Edit'}</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Profile Card */}
        <View style={[styles.profileCard, { backgroundColor: colors.cardBg, borderColor: colors.cardBorder }]}>
          <View style={styles.avatarRow}>
            <View style={styles.avatarCircle}>
              <Text style={styles.avatarInitials}>
                {student?.name
                  ? student.name
                      .split(' ')
                      .map((n) => n[0])
                      .join('')
                      .slice(0, 2)
                      .toUpperCase()
                  : 'PM'}
              </Text>
            </View>
            <View style={styles.candidateDetails}>
              {isEditing ? (
                <TextInput
                  style={[styles.inputEdit, { color: colors.textPrimary, borderColor: colors.cardBorder }]}
                  value={name}
                  onChangeText={setName}
                  placeholder="Candidate Full Name"
                  placeholderTextColor={colors.textTertiary}
                />
              ) : (
                <Text style={[styles.candidateName, { color: colors.textPrimary }]}>
                  {student?.name || 'Premed Student'}
                </Text>
              )}

              {isEditing ? (
                <TextInput
                  style={[styles.inputEdit, { color: colors.textPrimary, borderColor: colors.cardBorder }]}
                  value={matricNo}
                  onChangeText={setMatricNo}
                  placeholder="Matriculation No"
                  placeholderTextColor={colors.textTertiary}
                />
              ) : (
                <Text style={[styles.candidateMatric, { color: colors.textSecondary }]}>
                  Matric No: {student?.matricNo || 'MED/2026/0142'}
                </Text>
              )}

              {isEditing ? (
                <TextInput
                  style={[styles.inputEdit, { color: colors.textPrimary, borderColor: colors.cardBorder }]}
                  value={department}
                  onChangeText={setDepartment}
                  placeholder="Department"
                  placeholderTextColor={colors.textTertiary}
                />
              ) : (
                <View style={styles.deptBadge}>
                  <Text style={styles.deptBadgeText}>{student?.department || 'Medicine & Surgery'}</Text>
                </View>
              )}
            </View>
          </View>

          {/* Exam Target Date Countdown */}
          <View style={styles.countdownBanner}>
            <Text style={styles.countdownIcon}>⏱</Text>
            <View style={{ flex: 1 }}>
              <Text style={styles.countdownTitle}>Accredited Board CBT Countdown</Text>
              <Text style={styles.countdownSub}>24 Days Until PMSEC Professional Qualifying Assessment</Text>
            </View>
          </View>
        </View>

        {/* Preferences Section */}
        <View style={[styles.sectionCard, { backgroundColor: colors.cardBg, borderColor: colors.cardBorder }]}>
          <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>System & Display Settings</Text>

          {/* Dark Mode Toggle */}
          <View style={[styles.settingRow, { borderBottomColor: colors.cardBorder }]}>
            <View style={styles.settingLabelGroup}>
              <Text style={[styles.settingLabel, { color: colors.textPrimary }]}>Dark Mode</Text>
              <Text style={[styles.settingDesc, { color: colors.textSecondary }]}>
                Clinical high-contrast dark theme
              </Text>
            </View>
            <Switch
              value={isDark}
              onValueChange={toggleTheme}
              trackColor={{ false: '#CBD5E1', true: Colors.primary }}
              thumbColor={'#FFFFFF'}
            />
          </View>

          {/* Sound & Speech Synthesis */}
          <View style={[styles.settingRow, { borderBottomColor: colors.cardBorder }]}>
            <View style={styles.settingLabelGroup}>
              <Text style={[styles.settingLabel, { color: colors.textPrimary }]}>Read-Aloud TTS Engine</Text>
              <Text style={[styles.settingDesc, { color: colors.textSecondary }]}>
                expo-speech question narrator active
              </Text>
            </View>
            <Text style={[styles.settingValueText, { color: Colors.success }]}>Active</Text>
          </View>

          {/* Scientific Calculator */}
          <View style={styles.settingRow}>
            <View style={styles.settingLabelGroup}>
              <Text style={[styles.settingLabel, { color: colors.textPrimary }]}>Built-in Prometric Calculator</Text>
              <Text style={[styles.settingDesc, { color: colors.textSecondary }]}>
                Trigonometry, Log, Radicals enabled
              </Text>
            </View>
            <Text style={[styles.settingValueText, { color: Colors.success }]}>Enabled</Text>
          </View>
        </View>

        {/* App Meta & Storage */}
        <View style={[styles.sectionCard, { backgroundColor: colors.cardBg, borderColor: colors.cardBorder }]}>
          <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>App Diagnostics & Cache</Text>

          <View style={styles.metaRow}>
            <Text style={[styles.metaKey, { color: colors.textSecondary }]}>Application Version</Text>
            <Text style={[styles.metaVal, { color: colors.textPrimary }]}>v1.0.0 (Android Production)</Text>
          </View>

          <View style={styles.metaRow}>
            <Text style={[styles.metaKey, { color: colors.textSecondary }]}>Question Bank Engine</Text>
            <Text style={[styles.metaVal, { color: colors.textPrimary }]}>Offline Local Vault (~7 Courses)</Text>
          </View>

          <View style={styles.metaRow}>
            <Text style={[styles.metaKey, { color: colors.textSecondary }]}>Package</Text>
            <Text style={[styles.metaVal, { color: colors.textPrimary }]}>com.premed.portal.android</Text>
          </View>

          <TouchableOpacity style={styles.clearDataBtn} onPress={handleClearData}>
            <Text style={styles.clearDataText}>Reset Local Storage & Bookmarks</Text>
          </TouchableOpacity>
        </View>

        {/* Sign Out Button */}
        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
          <Text style={styles.logoutBtnText}>Log Out of Candidate Portal</Text>
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
  headerTitle: {
    fontSize: 16,
    fontWeight: '700',
  },
  editBtn: {
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  editBtnText: {
    color: Colors.primary,
    fontWeight: '700',
    fontSize: 14,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  profileCard: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
    marginBottom: 16,
  },
  avatarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatarCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  avatarInitials: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '900',
  },
  candidateDetails: {
    flex: 1,
  },
  candidateName: {
    fontSize: 17,
    fontWeight: '800',
    marginBottom: 2,
  },
  candidateMatric: {
    fontSize: 12,
    fontWeight: '500',
    marginBottom: 6,
  },
  deptBadge: {
    backgroundColor: '#CCFBF1',
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  deptBadgeText: {
    color: '#0F766E',
    fontSize: 11,
    fontWeight: '700',
  },
  inputEdit: {
    borderWidth: 1,
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
    fontSize: 13,
    marginBottom: 6,
  },
  countdownBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EFF6FF',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#BFDBFE',
  },
  countdownIcon: {
    fontSize: 20,
    marginRight: 10,
  },
  countdownTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: '#1E40AF',
  },
  countdownSub: {
    fontSize: 10,
    color: '#3B82F6',
    marginTop: 2,
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
    marginBottom: 12,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  settingLabelGroup: {
    flex: 1,
    paddingRight: 10,
  },
  settingLabel: {
    fontSize: 13,
    fontWeight: '700',
  },
  settingDesc: {
    fontSize: 11,
    marginTop: 2,
  },
  settingValueText: {
    fontSize: 12,
    fontWeight: '700',
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  metaKey: {
    fontSize: 12,
    fontWeight: '500',
  },
  metaVal: {
    fontSize: 12,
    fontWeight: '700',
  },
  clearDataBtn: {
    borderWidth: 1,
    borderColor: '#FECDD3',
    backgroundColor: '#FFF1F2',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 12,
  },
  clearDataText: {
    color: '#E11D48',
    fontSize: 12,
    fontWeight: '700',
  },
  logoutBtn: {
    backgroundColor: '#EF4444',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  logoutBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
  },
});
