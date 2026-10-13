import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { ThemeProvider } from './src/context/ThemeContext';
import { AuthProvider } from './src/context/AuthContext';
import { ExamProvider } from './src/context/ExamContext';
import { AppNavigator } from './src/navigation/AppNavigator';

export default function App() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <AuthProvider>
          <ExamProvider>
            <StatusBar style="auto" />
            <AppNavigator />
          </ExamProvider>
        </AuthProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
