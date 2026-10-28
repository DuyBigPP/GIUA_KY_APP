import { StyleSheet } from 'react-native';

export const colors = {
  primary: '#E8590C',
  primaryDark: '#C2410C',
  primarySoft: '#FFF0E6',
  bg: '#F7F5F2',
  card: '#FFFFFF',
  text: '#1F1A17',
  muted: '#857B73',
  border: '#E6E0DA',
  danger: '#D92D20',
  dangerSoft: '#FDECEA',
  disabled: '#D3CDC7',
  white: '#FFFFFF',
};

export const space = { xs: 4, sm: 8, md: 12, lg: 16, xl: 24 };

export const font = { sm: 13, md: 15, lg: 17, xl: 22 };

// Style dùng chung cho mọi màn hình: thẻ, ô nhập, nhãn, lỗi.
export const common = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: space.lg,
    elevation: 2,
    shadowColor: colors.text,
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
  },
  list: { padding: space.lg, gap: space.md },
  title: { fontSize: font.lg, fontWeight: '700', color: colors.text },
  sub: { fontSize: font.sm, color: colors.muted, marginTop: space.xs },
  pressed: { opacity: 0.7 },
  off: { opacity: 0.45 },
});
