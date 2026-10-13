import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { BottomTabParamList } from './types';
import { HomeScreen } from '../screens/HomeScreen';
import { CoursesScreen } from '../screens/CoursesScreen';
import { CombatScreen } from '../screens/CombatScreen';
import { ActiveStudyScreen } from '../screens/ActiveStudyScreen';
import { HistoryScreen } from '../screens/HistoryScreen';
import { ProfileScreen } from '../screens/ProfileScreen';
import { useTheme } from '../context/ThemeContext';
import { Colors } from '../constants/colors';

const Tab = createBottomTabNavigator<BottomTabParamList>();

export const BottomTabNavigator: React.FC = () => {
  const { colors, isDark } = useTheme();

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: colors.cardBg,
          borderTopColor: colors.cardBorder,
          height: 60,
          paddingBottom: 8,
          paddingTop: 6,
        },
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: isDark ? colors.textTertiary : '#94A3B8',
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: '700',
        },
      }}
    >
      <Tab.Screen
        name="HomeTab"
        component={HomeScreen}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 18, color }}>🏠</Text>,
        }}
      />
      <Tab.Screen
        name="CoursesTab"
        component={CoursesScreen}
        options={{
          tabBarLabel: 'Courses',
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 18, color }}>📚</Text>,
        }}
      />
      <Tab.Screen
        name="CombatTab"
        component={CombatScreen}
        options={{
          tabBarLabel: 'Combat',
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 18, color }}>⚔️</Text>,
        }}
      />
      <Tab.Screen
        name="StudyTab"
        component={ActiveStudyScreen}
        options={{
          tabBarLabel: 'AI Study',
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 18, color }}>✨</Text>,
        }}
      />
      <Tab.Screen
        name="HistoryTab"
        component={HistoryScreen}
        options={{
          tabBarLabel: 'History',
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 18, color }}>📋</Text>,
        }}
      />
      <Tab.Screen
        name="ProfileTab"
        component={ProfileScreen}
        options={{
          tabBarLabel: 'Profile',
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 18, color }}>👤</Text>,
        }}
      />
    </Tab.Navigator>
  );
};
