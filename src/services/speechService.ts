import * as Speech from 'expo-speech';

let isSpeakingCurrently = false;

export const SpeechService = {
  async speak(text: string, onDone?: () => void): Promise<void> {
    try {
      if (isSpeakingCurrently) {
        await Speech.stop();
      }

      isSpeakingCurrently = true;
      Speech.speak(text, {
        language: 'en-US',
        pitch: 1.0,
        rate: 0.95,
        onDone: () => {
          isSpeakingCurrently = false;
          if (onDone) onDone();
        },
        onError: () => {
          isSpeakingCurrently = false;
        },
      });
    } catch (e) {
      console.warn('Speech synthesis not available or failed', e);
      isSpeakingCurrently = false;
    }
  },

  async stop(): Promise<void> {
    try {
      await Speech.stop();
      isSpeakingCurrently = false;
    } catch (e) {
      console.warn('Failed to stop speech', e);
    }
  },

  isSpeaking(): boolean {
    return isSpeakingCurrently;
  },
};
