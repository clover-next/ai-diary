export const theme = {
  colors: {
    background: {
      primary: '#0F172A',   // Deep dark blue
      secondary: '#1E293B', // Slate gray-blue
      tertiary: '#334155',
    },
    text: {
      primary: '#F8FAFC',   // Off-white
      secondary: '#94A3B8', // Muted blue-gray
      muted: '#64748B',
    },
    accent: {
      indigo: '#6366F1',
      teal: '#14B8A6',
      rose: '#F43F5E',
      amber: '#F59E0B',
      pop: '#FF6B6B',      // New pop accent for recording
    },
    border: '#1E293B',
    moods: [
      '#6366F1', // Calm/Peaceful
      '#14B8A6', // Happy/Cool
      '#F59E0B', // Anxious/Warm
      '#F43F5E', // Angry/Hot
      '#8B5CF6', // Mystery/Indigo
    ]
  },
  spacing: {
    xs: 4,
    s: 8,
    m: 16,
    l: 24,
    xl: 32,
    xxl: 48,
  },
  typography: {
    sizes: {
      h1: 28,
      h2: 24,
      h3: 18,
      body: 16,
      caption: 14,
    },
    fonts: {
      // We'll use system fonts for stability in MVP
      regular: 'System',
      bold: 'System',
    }
  }
};
