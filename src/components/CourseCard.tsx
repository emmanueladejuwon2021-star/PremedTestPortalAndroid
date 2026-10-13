import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Course } from '../types/course';
import { Colors } from '../constants/colors';
import { useTheme } from '../context/ThemeContext';

interface CourseCardProps {
  course: Course;
  onStartExam: (course: Course) => void;
  onPractice: (course: Course) => void;
}

export const CourseCard: React.FC<CourseCardProps> = ({ course, onStartExam, onPractice }) => {
  const { colors, isDark } = useTheme();

  return (
    <View style={[styles.card, { backgroundColor: colors.cardBg, borderColor: colors.cardBorder }]}>
      {/* Header Badge */}
      <View style={styles.topRow}>
        <View style={[styles.codeBadge, { backgroundColor: course.badgeColor || Colors.primary }]}>
          <Text style={styles.codeText}>{course.code}</Text>
        </View>
        <View style={styles.metaBadge}>
          <Text style={[styles.metaText, { color: colors.textSecondary }]}>
            ⏱ {course.durationMinutes}m · ❓ {course.questionLimit} Qs
          </Text>
        </View>
      </View>

      {/* Title */}
      <Text style={[styles.title, { color: colors.textPrimary }]}>{course.title}</Text>
      <Text style={[styles.scope, { color: colors.textSecondary }]}>{course.departmentScope}</Text>

      {/* Topics Count */}
      <View style={[styles.topicsRow, { backgroundColor: isDark ? colors.slate800 : colors.slate50 }]}>
        <Text style={[styles.topicsText, { color: colors.textSecondary }]}>
          📚 {course.topics.length} Syllabus Modules: {course.topics.map((t) => t.name).join(', ')}
        </Text>
      </View>

      {/* Actions */}
      <View style={styles.actionRow}>
        <TouchableOpacity
          style={[styles.practiceBtn, { borderColor: Colors.primary }]}
          onPress={() => onPractice(course)}
          activeOpacity={0.7}
        >
          <Text style={[styles.practiceBtnText, { color: Colors.primary }]}>Study & Practice</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.examBtn, { backgroundColor: Colors.primary }]}
          onPress={() => onStartExam(course)}
          activeOpacity={0.8}
        >
          <Text style={styles.examBtnText}>Sit CBT Exam →</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 22,
    padding: 18,
    marginVertical: 8,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 10,
    elevation: 2,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  codeBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  codeText: {
    color: Colors.white,
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  metaBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  metaText: {
    fontSize: 11,
    fontWeight: '700',
    fontFamily: 'monospace',
  },
  title: {
    fontSize: 16,
    fontWeight: '800',
    lineHeight: 22,
  },
  scope: {
    fontSize: 12,
    fontWeight: '500',
    marginTop: 3,
    marginBottom: 12,
  },
  topicsRow: {
    padding: 10,
    borderRadius: 12,
    marginBottom: 14,
  },
  topicsText: {
    fontSize: 11,
    fontWeight: '500',
    lineHeight: 16,
  },
  actionRow: {
    flexDirection: 'row',
    gap: 10,
  },
  practiceBtn: {
    flex: 1,
    paddingVertical: 11,
    borderRadius: 14,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  practiceBtnText: {
    fontSize: 12,
    fontWeight: '800',
  },
  examBtn: {
    flex: 1.2,
    paddingVertical: 11,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.primary,
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 3,
  },
  examBtnText: {
    color: Colors.white,
    fontSize: 12,
    fontWeight: '800',
  },
});
