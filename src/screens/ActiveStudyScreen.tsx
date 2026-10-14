import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { SAMPLE_STUDY_NOTES } from '../data/sampleNotes';
import { useTheme } from '../context/ThemeContext';
import { Colors } from '../constants/colors';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

interface ChatMessage {
  id: string;
  sender: 'tutor' | 'student';
  text: string;
  timestamp: string;
}

export const ActiveStudyScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const { colors, isDark } = useTheme();

  const [activeTab, setActiveTab] = useState<'chat' | 'quiz' | 'guide'>('chat');
  const [noteContent, setNoteContent] = useState('');
  const [selectedNoteIndex, setSelectedNoteIndex] = useState<number>(0);
  const [selectedQuizAnswers, setSelectedQuizAnswers] = useState<Record<number, string>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);

  // Chat state
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      sender: 'tutor',
      text: '🩺 Welcome to the AI Clinical Study Room! Load a pre-med sample note above or paste your lecture slides. You can ask me to explain physiological mechanisms, clinical correlates, or formula derivations!',
      timestamp: '10:00 AM',
    },
  ]);
  const [inputMsg, setInputMsg] = useState('');

  const loadSampleNote = (index: number) => {
    const sample = SAMPLE_STUDY_NOTES[index];
    if (sample) {
      setSelectedNoteIndex(index);
      setNoteContent(sample.content);
      setSelectedQuizAnswers({});
      setQuizSubmitted(false);

      setChatMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          sender: 'tutor',
          text: `Loaded study note on: "${sample.title}". Ask me anything about this topic or tap "Practice Quiz" to test your recall!`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    }
  };

  const handleSendChat = () => {
    if (!inputMsg.trim()) return;

    const userText = inputMsg.trim();
    const newMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'student',
      text: userText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setChatMessages((prev) => [...prev, newMsg]);
    setInputMsg('');

    // Simulate AI clinical tutor intelligent response
    setTimeout(() => {
      let aiResponse = '';
      const lower = userText.toLowerCase();

      if (lower.includes('sodium') || lower.includes('potassium') || lower.includes('action potential')) {
        aiResponse =
          '💡 In cellular neurophysiology, the rapid depolarizing phase is mediated by voltage-gated Na⁺ channel activation (inward current). Repolarization requires Na⁺ inactivation combined with delayed rectifier K⁺ channel opening (outward current). Clinically, local anesthetics (like Lidocaine) block these Na⁺ channels inside the pore!';
      } else if (lower.includes('krebs') || lower.includes('atp') || lower.includes('citrate')) {
        aiResponse =
          '⚡ In the citric acid cycle, 1 turn produces 3 NADH, 1 FADH₂, 1 GTP (via substrate-level phosphorylation), and 2 CO₂. The rate-limiting committed enzyme is Isocitrate Dehydrogenase, which is allosterically stimulated by ADP and inhibited by ATP and NADH.';
      } else if (lower.includes('summarize') || lower.includes('overview')) {
        aiResponse =
          '📋 High-yield summary: Focus on the key rate-limiting steps, physiological equilibrium potentials, and how clinical pharmacological agents alter normal homeostasis!';
      } else {
        aiResponse = `🩺 Clinical Tutor Insight: That relates directly to the mechanisms in your active notes. Remember to contrast normal physiology with pathological dysfunction (e.g. channelopathies or metabolic enzyme deficiencies) when revising for CBT examinations!`;
      }

      setChatMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          sender: 'tutor',
          text: aiResponse,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    }, 600);
  };

  const currentSample = SAMPLE_STUDY_NOTES[selectedNoteIndex] || SAMPLE_STUDY_NOTES[0];

  const handleQuizSelect = (qIdx: number, optKey: string) => {
    if (quizSubmitted) return;
    setSelectedQuizAnswers((prev) => ({
      ...prev,
      [qIdx]: optKey,
    }));
  };

  const calculateQuizScore = () => {
    let score = 0;
    (currentSample.quizQuestions || []).forEach((q: any, idx: number) => {
      if (selectedQuizAnswers[idx] === q.correctAnswer) {
        score++;
      }
    });
    return score;
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} backgroundColor={colors.background} />

      {/* Screen Header */}
      <View style={[styles.header, { backgroundColor: colors.cardBg, borderBottomColor: colors.cardBorder }]}>
        <TouchableOpacity style={styles.headerBackBtn} onPress={() => navigation.navigate('MainTabs')}>
          <Text style={[styles.headerBackText, { color: colors.textPrimary }]}>‹ Back</Text>
        </TouchableOpacity>
        <View style={styles.headerTitleContainer}>
          <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>AI Clinical Study Room</Text>
          <Text style={styles.headerSub}>Active Recall & Tutor Assistant</Text>
        </View>
        <View style={styles.sparkleBadge}>
          <Text style={styles.sparkleBadgeText}>✨ AI Active</Text>
        </View>
      </View>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
      >
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {/* Note Ingestion Card */}
          <View style={[styles.noteIngestionCard, { backgroundColor: colors.cardBg, borderColor: colors.cardBorder }]}>
            <View style={styles.noteCardTop}>
              <Text style={styles.sectionHeaderLabel}>LECTURE NOTES / TOPIC INGESTION</Text>
              <View style={styles.sampleChipsRow}>
                {SAMPLE_STUDY_NOTES.map((sample: any, idx: number) => (
                  <TouchableOpacity
                    key={sample.id}
                    style={[
                      styles.sampleChip,
                      selectedNoteIndex === idx && styles.sampleChipActive,
                    ]}
                    onPress={() => loadSampleNote(idx)}
                  >
                    <Text
                      style={[
                        styles.sampleChipText,
                        selectedNoteIndex === idx && styles.sampleChipTextActive,
                      ]}
                    >
                      {sample.title.split(' - ')[0]}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <TextInput
              style={[
                styles.noteInput,
                {
                  backgroundColor: isDark ? colors.slate800 : '#F8FAFC',
                  color: colors.textPrimary,
                  borderColor: colors.cardBorder,
                },
              ]}
              placeholder="Paste medical lecture notes, anatomy flashcards, or physiology pathways here..."
              placeholderTextColor={colors.textTertiary}
              multiline
              numberOfLines={4}
              value={noteContent || currentSample.content}
              onChangeText={setNoteContent}
            />
          </View>

          {/* Tab Selector */}
          <View style={[styles.tabSelectorBar, { backgroundColor: isDark ? colors.slate800 : '#F1F5F9' }]}>
            <TouchableOpacity
              style={[styles.tabItem, activeTab === 'chat' && styles.tabItemActive]}
              onPress={() => setActiveTab('chat')}
            >
              <Text style={[styles.tabItemText, activeTab === 'chat' && styles.tabItemTextActive]}>
                💬 Ask AI Tutor
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.tabItem, activeTab === 'quiz' && styles.tabItemActive]}
              onPress={() => setActiveTab('quiz')}
            >
              <Text style={[styles.tabItemText, activeTab === 'quiz' && styles.tabItemTextActive]}>
                📝 Recall Quiz
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.tabItem, activeTab === 'guide' && styles.tabItemActive]}
              onPress={() => setActiveTab('guide')}
            >
              <Text style={[styles.tabItemText, activeTab === 'guide' && styles.tabItemTextActive]}>
                💡 High-Yield Points
              </Text>
            </TouchableOpacity>
          </View>

          {/* TAB 1: ASK AI TUTOR */}
          {activeTab === 'chat' && (
            <View style={[styles.chatPanel, { backgroundColor: colors.cardBg, borderColor: colors.cardBorder }]}>
              <View style={styles.chatMessageList}>
                {chatMessages.map((msg) => {
                  const isTutor = msg.sender === 'tutor';
                  return (
                    <View
                      key={msg.id}
                      style={[
                        styles.chatBubbleRow,
                        isTutor ? styles.bubbleRowLeft : styles.bubbleRowRight,
                      ]}
                    >
                      {isTutor && (
                        <View style={styles.tutorAvatar}>
                          <Text style={styles.tutorAvatarText}>🩺</Text>
                        </View>
                      )}
                      <View
                        style={[
                          styles.chatBubble,
                          isTutor
                            ? [styles.tutorBubble, { backgroundColor: isDark ? colors.slate800 : '#F0FDFA', borderColor: '#CCFBF1' }]
                            : [styles.studentBubble, { backgroundColor: Colors.primary }],
                        ]}
                      >
                        <Text
                          style={[
                            styles.chatBubbleText,
                            { color: isTutor ? (isDark ? '#F1F5F9' : '#0F766E') : '#FFFFFF' },
                          ]}
                        >
                          {msg.text}
                        </Text>
                        <Text
                          style={[
                            styles.chatTimestamp,
                            { color: isTutor ? colors.textTertiary : 'rgba(255,255,255,0.7)' },
                          ]}
                        >
                          {msg.timestamp}
                        </Text>
                      </View>
                    </View>
                  );
                })}
              </View>

              {/* Chat Input Field */}
              <View style={[styles.chatInputRow, { borderTopColor: colors.cardBorder }]}>
                <TextInput
                  style={[
                    styles.chatTextInput,
                    {
                      backgroundColor: isDark ? colors.slate800 : '#F8FAFC',
                      color: colors.textPrimary,
                      borderColor: colors.cardBorder,
                    },
                  ]}
                  placeholder="Ask a question about this topic..."
                  placeholderTextColor={colors.textTertiary}
                  value={inputMsg}
                  onChangeText={setInputMsg}
                  onSubmitEditing={handleSendChat}
                />
                <TouchableOpacity style={styles.sendBtn} onPress={handleSendChat}>
                  <Text style={styles.sendBtnText}>Send</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          {/* TAB 2: ACTIVE RECALL PRACTICE QUIZ */}
          {activeTab === 'quiz' && (
            <View style={[styles.quizPanel, { backgroundColor: colors.cardBg, borderColor: colors.cardBorder }]}>
              <View style={styles.quizHeaderRow}>
                <Text style={[styles.quizTitle, { color: colors.textPrimary }]}>
                  Active Recall: {currentSample.title}
                </Text>
                {quizSubmitted && (
                  <View style={styles.quizScoreBadge}>
                    <Text style={styles.quizScoreText}>
                      Score: {calculateQuizScore()} / {currentSample.quizQuestions.length}
                    </Text>
                  </View>
                )}
              </View>

              {(currentSample.quizQuestions || []).map((q: any, qIdx: number) => {
                const userPick = selectedQuizAnswers[qIdx];
                return (
                  <View key={q.id} style={[styles.quizQuestionCard, { borderColor: colors.cardBorder }]}>
                    <Text style={[styles.quizQuestionStem, { color: colors.textPrimary }]}>
                      {qIdx + 1}. {q.text}
                    </Text>

                    <View style={styles.quizOptionsGrid}>
                      {(['A', 'B', 'C', 'D'] as const).map((optKey) => {
                        const isChosen = userPick === optKey;
                        const isKey = q.correctAnswer === optKey;

                        let borderCol = colors.cardBorder;
                        let bgCol = 'transparent';

                        if (quizSubmitted) {
                          if (isKey) {
                            borderCol = Colors.success;
                            bgCol = Colors.success + '20';
                          } else if (isChosen) {
                            borderCol = Colors.danger;
                            bgCol = Colors.danger + '20';
                          }
                        } else if (isChosen) {
                          borderCol = Colors.primary;
                          bgCol = Colors.primary + '15';
                        }

                        return (
                          <TouchableOpacity
                            key={optKey}
                            style={[styles.quizOptionBtn, { borderColor: borderCol, backgroundColor: bgCol }]}
                            onPress={() => handleQuizSelect(qIdx, optKey)}
                            disabled={quizSubmitted}
                          >
                            <Text
                              style={[
                                styles.quizOptionKey,
                                {
                                  color: isChosen || (quizSubmitted && isKey) ? Colors.primary : colors.textPrimary,
                                  fontWeight: isChosen || (quizSubmitted && isKey) ? '800' : '600',
                                },
                              ]}
                            >
                              {optKey}. {q.options[optKey]}
                            </Text>
                          </TouchableOpacity>
                        );
                      })}
                    </View>

                    {quizSubmitted && (
                      <View style={styles.quizExplanationBox}>
                        <Text style={styles.quizExplanationText}>💡 Rationale: {q.explanation}</Text>
                      </View>
                    )}
                  </View>
                );
              })}

              {!quizSubmitted ? (
                <TouchableOpacity
                  style={styles.submitQuizBtn}
                  onPress={() => setQuizSubmitted(true)}
                  disabled={Object.keys(selectedQuizAnswers).length === 0}
                >
                  <Text style={styles.submitQuizBtnText}>Submit & Check Answers</Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  style={[styles.submitQuizBtn, { backgroundColor: Colors.secondary }]}
                  onPress={() => {
                    setSelectedQuizAnswers({});
                    setQuizSubmitted(false);
                  }}
                >
                  <Text style={styles.submitQuizBtnText}>Retake Quiz</Text>
                </TouchableOpacity>
              )}
            </View>
          )}

          {/* TAB 3: HIGH-YIELD POINTS */}
          {activeTab === 'guide' && (
            <View style={[styles.guidePanel, { backgroundColor: colors.cardBg, borderColor: colors.cardBorder }]}>
              <Text style={[styles.guidePanelTitle, { color: colors.textPrimary }]}>
                High-Yield Pre-Med Synthesized Points
              </Text>
              <Text style={[styles.guidePanelSub, { color: colors.textSecondary }]}>
                {currentSample.title}
              </Text>

              <View style={styles.yieldList}>
                {(currentSample.highYieldPoints || []).map((point: string, pIdx: number) => (
                  <View key={pIdx} style={styles.yieldItemRow}>
                    <View style={styles.yieldCheckBullet}>
                      <Text style={styles.yieldCheckIcon}>✓</Text>
                    </View>
                    <Text style={[styles.yieldText, { color: colors.textPrimary }]}>{point}</Text>
                  </View>
                ))}
              </View>

              <View style={styles.studyTipBox}>
                <Text style={styles.studyTipTitle}>🧠 Active Recall Clinical Tip</Text>
                <Text style={styles.studyTipContent}>
                  After reading each high-yield pearl, close your eyes and explain the underlying physiological mechanism out loud as if explaining to a junior medical student.
                </Text>
              </View>
            </View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
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
  headerBackBtn: {
    paddingVertical: 4,
  },
  headerBackText: {
    fontSize: 14,
    fontWeight: '600',
  },
  headerTitleContainer: {
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 15,
    fontWeight: '700',
  },
  headerSub: {
    fontSize: 10,
    color: '#0D9488',
    fontWeight: '600',
  },
  sparkleBadge: {
    backgroundColor: '#CCFBF1',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  sparkleBadgeText: {
    color: '#0F766E',
    fontSize: 10,
    fontWeight: '800',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  noteIngestionCard: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 14,
    marginBottom: 14,
  },
  noteCardTop: {
    marginBottom: 10,
  },
  sectionHeaderLabel: {
    fontSize: 10,
    fontWeight: '900',
    color: '#0F766E',
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  sampleChipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  sampleChip: {
    backgroundColor: '#E2E8F0',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 14,
  },
  sampleChipActive: {
    backgroundColor: Colors.primary,
  },
  sampleChipText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#475569',
  },
  sampleChipTextActive: {
    color: '#FFFFFF',
  },
  noteInput: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    fontSize: 12,
    lineHeight: 18,
    textAlignVertical: 'top',
    height: 90,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  tabSelectorBar: {
    flexDirection: 'row',
    borderRadius: 12,
    padding: 4,
    marginBottom: 14,
  },
  tabItem: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
  },
  tabItemActive: {
    backgroundColor: '#FFFFFF',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 2,
    shadowOffset: { width: 0, height: 1 },
  },
  tabItemText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#64748B',
  },
  tabItemTextActive: {
    color: Colors.primary,
  },
  chatPanel: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 14,
  },
  chatMessageList: {
    minHeight: 220,
    marginBottom: 12,
  },
  chatBubbleRow: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  bubbleRowLeft: {
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },
  bubbleRowRight: {
    justifyContent: 'flex-end',
  },
  tutorAvatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#CCFBF1',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
    marginTop: 2,
  },
  tutorAvatarText: {
    fontSize: 14,
  },
  chatBubble: {
    maxWidth: '82%',
    padding: 12,
    borderRadius: 14,
  },
  tutorBubble: {
    borderTopLeftRadius: 2,
    borderWidth: 1,
  },
  studentBubble: {
    borderTopRightRadius: 2,
  },
  chatBubbleText: {
    fontSize: 12,
    lineHeight: 18,
    fontWeight: '500',
  },
  chatTimestamp: {
    fontSize: 9,
    marginTop: 4,
    alignSelf: 'flex-end',
  },
  chatInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 10,
    borderTopWidth: 1,
    gap: 8,
  },
  chatTextInput: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 12,
  },
  sendBtn: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
  },
  sendBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  quizPanel: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 14,
  },
  quizHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  quizTitle: {
    fontSize: 14,
    fontWeight: '700',
    flex: 1,
  },
  quizScoreBadge: {
    backgroundColor: '#CCFBF1',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
  quizScoreText: {
    color: '#0F766E',
    fontWeight: '800',
    fontSize: 12,
  },
  quizQuestionCard: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
  },
  quizQuestionStem: {
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 10,
    lineHeight: 18,
  },
  quizOptionsGrid: {
    gap: 6,
  },
  quizOptionBtn: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
  },
  quizOptionKey: {
    fontSize: 12,
  },
  quizExplanationBox: {
    marginTop: 8,
    backgroundColor: '#FEF3C7',
    padding: 8,
    borderRadius: 6,
  },
  quizExplanationText: {
    fontSize: 11,
    color: '#92400E',
    lineHeight: 16,
    fontWeight: '500',
  },
  submitQuizBtn: {
    backgroundColor: Colors.primary,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 8,
  },
  submitQuizBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 13,
  },
  guidePanel: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
  },
  guidePanelTitle: {
    fontSize: 15,
    fontWeight: '800',
    marginBottom: 2,
  },
  guidePanelSub: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 16,
  },
  yieldList: {
    gap: 12,
    marginBottom: 16,
  },
  yieldItemRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  yieldCheckBullet: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#CCFBF1',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
    marginTop: 2,
  },
  yieldCheckIcon: {
    color: '#0F766E',
    fontSize: 11,
    fontWeight: '900',
  },
  yieldText: {
    flex: 1,
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '500',
  },
  studyTipBox: {
    backgroundColor: '#EFF6FF',
    borderLeftWidth: 3,
    borderLeftColor: '#3B82F6',
    padding: 12,
    borderRadius: 8,
  },
  studyTipTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: '#1E40AF',
    marginBottom: 4,
  },
  studyTipContent: {
    fontSize: 11,
    color: '#1E3A8A',
    lineHeight: 16,
  },
});
