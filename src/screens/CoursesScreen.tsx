import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { COURSES } from '../data/courses';
import { Course } from '../types/course';
import { CourseCard } from '../components/CourseCard';
import { useTheme } from '../context/ThemeContext';
import { useExam } from '../context/ExamContext';
import { Header } from '../components/Header';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export const CoursesScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const { colors, isDark } = useTheme();
  const { startExam } = useExam();

  const [search, setSearch] = useState('');
  const [selectedDeptFilter, setSelectedDeptFilter] = useState('ALL');

  const deptFilters = ['ALL', 'MEDICINE', 'PHARMACY', 'DENTISTRY', 'PHYSIOTHERAPY'];

  const filteredCourses = COURSES.filter((c) => {
    const matchesSearch =
      c.code.toLowerCase().includes(search.toLowerCase()) ||
      c.title.toLowerCase().includes(search.toLowerCase());

    if (!matchesSearch) return false;

    if (selectedDeptFilter === 'ALL') return true;
    if (selectedDeptFilter === 'MEDICINE') return c.departmentScope.toLowerCase().includes('med');
    if (selectedDeptFilter === 'PHARMACY') return c.departmentScope.toLowerCase().includes('pharm');
    if (selectedDeptFilter === 'DENTISTRY') return c.departmentScope.toLowerCase().includes('dent');
    if (selectedDeptFilter === 'PHYSIOTHERAPY') return c.departmentScope.toLowerCase().includes('physio');

    return true;
  });

  const handleStartExam = (course: Course) => {
    startExam({
      courseId: course.id,
      courseCode: course.code,
      courseTitle: course.title,
      durationMinutes: course.durationMinutes,
      questionLimit: course.questionLimit,
      calculatorAllowed: true,
    });
    navigation.navigate('Exam', {
      config: {
        courseId: course.id,
        courseCode: course.code,
        courseTitle: course.title,
        durationMinutes: course.durationMinutes,
        questionLimit: course.questionLimit,
      },
    });
  };

  const handlePractice = (course: Course) => {
    navigation.navigate('Practice', { courseId: course.id });
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.bg }]}>
      <Header title="Accredited Courses" subtitle="Curriculum syllabus & assessment papers" />

      {/* Search Input */}
      <View style={styles.searchWrapper}>
        <TextInput
          style={[
            styles.searchInput,
            { backgroundColor: colors.cardBg, borderColor: colors.cardBorder, color: colors.textPrimary },
          ]}
          placeholder="Search by code (e.g. MED 101, ANA 101) or title…"
          placeholderTextColor={colors.textSecondary}
          value={search}
          onChangeText={setSearch}
        />
      </View>

      {/* Department Filter Chips */}
      <View style={styles.filtersScroll}>
        {deptFilters.map((df) => {
          const isSelected = selectedDeptFilter === df;
          return (
            <TouchableOpacity
              key={df}
              style={[
                styles.chip,
                {
                  backgroundColor: isSelected ? colors.primary : isDark ? colors.slate800 : colors.slate100,
                  borderColor: isSelected ? colors.primary : colors.cardBorder,
                },
              ]}
              onPress={() => setSelectedDeptFilter(df)}
              activeOpacity={0.7}
            >
              <Text style={[styles.chipText, { color: isSelected ? '#FFF' : colors.textPrimary }]}>{df}</Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Courses List */}
      <FlatList
        data={filteredCourses}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <CourseCard course={item} onStartExam={handleStartExam} onPractice={handlePractice} />
        )}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyBox}>
            <Text style={styles.emptyIcon}>🔍</Text>
            <Text style={[styles.emptyText, { color: colors.textPrimary }]}>No courses match your filter</Text>
            <Text style={[styles.emptySub, { color: colors.textSecondary }]}>Try clearing the search or category filter.</Text>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchWrapper: {
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  searchInput: {
    borderWidth: 1.5,
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 13,
    fontWeight: '600',
  },
  filtersScroll: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 10,
    gap: 8,
  },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
  },
  chipText: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 30,
  },
  emptyBox: {
    padding: 40,
    alignItems: 'center',
  },
  emptyIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    fontWeight: '700',
  },
  emptySub: {
    fontSize: 12,
    marginTop: 4,
  },
});
