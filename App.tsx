import React, { Component, ErrorInfo, ReactNode } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { ThemeProvider } from './src/context/ThemeContext';
import { AuthProvider } from './src/context/AuthContext';
import { ExamProvider } from './src/context/ExamContext';
import { AppNavigator } from './src/navigation/AppNavigator';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('PremedPortal ErrorBoundary caught an exception:', error, errorInfo);
  }

  handleRestart = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <SafeAreaView style={styles.errorContainer}>
          <View style={styles.errorCard}>
            <View style={styles.errorBadge}>
              <Text style={styles.errorIcon}>🩺</Text>
            </View>
            <Text style={styles.errorTitle}>Portal Diagnostic Recovery</Text>
            <Text style={styles.errorSubtitle}>
              Apex PreMed CBT encountered an unexpected runtime event. Your assessment progress is safely persisted in offline storage.
            </Text>

            {this.state.error && (
              <ScrollView style={styles.errorDetailsBox} showsVerticalScrollIndicator={false}>
                <Text style={styles.errorDetailsText}>{this.state.error.toString()}</Text>
              </ScrollView>
            )}

            <TouchableOpacity style={styles.restartBtn} onPress={this.handleRestart} activeOpacity={0.8}>
              <Text style={styles.restartBtnText}>Restart CBT Portal →</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      );
    }

    return this.props.children;
  }
}

export default function App() {
  return (
    <SafeAreaProvider>
      <ErrorBoundary>
        <ThemeProvider>
          <AuthProvider>
            <ExamProvider>
              <StatusBar style="auto" />
              <AppNavigator />
            </ExamProvider>
          </AuthProvider>
        </ThemeProvider>
      </ErrorBoundary>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  errorContainer: {
    flex: 1,
    backgroundColor: '#0F172A',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorCard: {
    backgroundColor: '#1E293B',
    borderRadius: 24,
    padding: 24,
    width: '100%',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#334155',
  },
  errorBadge: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#0F766E25',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  errorIcon: {
    fontSize: 32,
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#F8FAFC',
    textAlign: 'center',
    marginBottom: 8,
  },
  errorSubtitle: {
    fontSize: 13,
    color: '#94A3B8',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 16,
  },
  errorDetailsBox: {
    maxHeight: 120,
    width: '100%',
    backgroundColor: '#0F172A',
    borderRadius: 12,
    padding: 12,
    marginBottom: 20,
  },
  errorDetailsText: {
    color: '#EF4444',
    fontSize: 11,
    fontFamily: 'monospace',
  },
  restartBtn: {
    backgroundColor: '#0F766E',
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 14,
    width: '100%',
    alignItems: 'center',
  },
  restartBtnText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 14,
  },
});
