// Corporate Enterprise Color Palette (Navy, Slate, Corporate Emerald, Crimson & Amber)
export const colors = {
  // Brand & Primary
  primary: '#0B1E36',       // Deep Navy Corporate
  primaryDark: '#071324',   // Darker Navy for headers
  primaryLight: '#1B365D',  // Slate Blue for active cards/tabs
  accent: '#0284C7',        // Cyan / Cerulean Blue
  accentLight: '#E0F2FE',   // Subtle Cyan background
  
  // Backgrounds & Surfaces
  background: '#F1F5F9',   // Light corporate slate background
  surface: '#FFFFFF',      // Pure white card surfaces
  surfaceHover: '#F8FAFC', // Crisp soft white
  cardBorder: '#E2E8F0',   // Subtle border for cards
  divider: '#CBD5E1',      // Section divider

  // Typography
  textPrimary: '#0F172A',   // High-contrast slate-900
  textSecondary: '#475569', // Muted slate-600
  textMuted: '#94A3B8',     // Subtext slate-400
  textInverse: '#FFFFFF',   // White text

  // Compliance Statuses
  pass: '#059669',          // Compliant Green (Emerald)
  passBg: '#ECFDF5',
  passBorder: '#A7F3D0',

  fail: '#DC2626',          // Non-Compliant Red (Crimson)
  failBg: '#FEF2F2',
  failBorder: '#FECACA',

  flag: '#D97706',          // Observation / Flagged Amber
  flagBg: '#FFFBEB',
  flagBorder: '#FDE68A',

  untested: '#64748B',      // Not Started / Slate
  untestedBg: '#F1F5F9',
  untestedBorder: '#CBD5E1',

  // Risk Tags
  riskHigh: '#B91C1C',
  riskHighBg: '#FEE2E2',
  riskMedium: '#B45309',
  riskMediumBg: '#FEF3C7',
  riskLow: '#047857',
  riskLowBg: '#D1FAE5',

  // Sync & Cloud Indicators
  synced: '#2563EB',
  syncedBg: '#EFF6FF',
  pendingSync: '#E11D48',
  pendingSyncBg: '#FFE4E6',
  offlineBg: '#FEF3C7',
  offlineText: '#92400E',
  onlineBg: '#D1FAE5',
  onlineText: '#065F46',

  // Overlay / Forensic Stamp
  overlayBg: 'rgba(11, 30, 54, 0.88)',
  stampBorder: '#38BDF8',
  stampText: '#F0F9FF',
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
};

export const borderRadius = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  full: 9999,
};
