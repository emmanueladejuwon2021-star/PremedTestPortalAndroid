import { Colors } from './colors';

export const Theme = {
  colors: Colors,
  typography: {
    title: {
      fontSize: 22,
      fontWeight: '800' as const,
      color: Colors.slate900,
      letterSpacing: -0.5,
    },
    subtitle: {
      fontSize: 14,
      fontWeight: '600' as const,
      color: Colors.slate500,
    },
    body: {
      fontSize: 14,
      fontWeight: '400' as const,
      color: Colors.slate800,
      lineHeight: 22,
    },
    cbtStem: {
      fontSize: 16,
      fontWeight: '500' as const,
      color: Colors.slate900,
      lineHeight: 26,
    },
    timer: {
      fontSize: 18,
      fontWeight: '800' as const,
      fontFamily: 'monospace',
    },
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    xxl: 24,
  },
  borderRadius: {
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    full: 9999,
  },
  shadow: {
    card: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.05,
      shadowRadius: 8,
      elevation: 2,
    },
    button: {
      shadowColor: Colors.primary,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.2,
      shadowRadius: 10,
      elevation: 4,
    },
  },
};
