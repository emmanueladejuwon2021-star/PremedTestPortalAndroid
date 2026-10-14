import React from 'react';
import { View, ActivityIndicator } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import { RootStackParamList } from './types';
import { BottomTabNavigator } from './BottomTabNavigator';
import { LoginScreen } from '../screens/LoginScreen';
import { ExamScreen } from '../screens/ExamScreen';
import { PracticeScreen } from '../screens/PracticeScreen';
import { ResultsScreen } from '../screens/ResultsScreen';
import { CombatScreen } from '../screens/CombatScreen';
import { ActiveStudyScreen } from '../screens/ActiveStudyScreen';
import { QuestionSearchScreen } from '../screens/QuestionSearchScreen';
import { ReadinessScreen } from '../screens/ReadinessScreen';
import { LeaderboardScreen } from '../screens/LeaderboardScreen';
import { HistoryScreen } from '../screens/HistoryScreen';
import { useAuth } from '../context/AuthContext';
import { Colors } from '../constants/colors';

const Stack = createNativeStackNavigator<RootStackParamList>();

export const AppNavigator: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#0F766E' }}>
        <ActivityIndicator size="large" color="#FFFFFF" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          animation: 'fade',
        }}
      >
        {!isAuthenticated ? (
          <Stack.Screen name="Auth" component={LoginScreen} />
        ) : (
          <>
            <Stack.Screen name="MainTabs" component={BottomTabNavigator} />
            <Stack.Screen
              name="Exam"
              component={ExamScreen}
              options={{ gestureEnabled: false }}
            />
            <Stack.Screen name="Practice" component={PracticeScreen} />
            <Stack.Screen
              name="Results"
              component={ResultsScreen}
              options={{ gestureEnabled: false }}
            />
            <Stack.Screen name="Combat" component={CombatScreen} />
            <Stack.Screen name="ActiveStudy" component={ActiveStudyScreen} />
            <Stack.Screen name="QuestionSearch" component={QuestionSearchScreen} />
            <Stack.Screen name="Readiness" component={ReadinessScreen} />
            <Stack.Screen name="Leaderboard" component={LeaderboardScreen} />
            <Stack.Screen name="History" component={HistoryScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};
