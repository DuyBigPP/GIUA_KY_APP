import React from 'react';
import { Pressable, StyleProp, StyleSheet, Text, TextInput, TextInputProps, View, ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, font, space } from './theme';

type ButtonProps = {
  title: string;
  onPress: () => void;
  disabled?: boolean;
  outline?: boolean;
  style?: StyleProp<ViewStyle>;
};

// Nút dùng chung: tối màu khi nhấn, xám khi bị vô hiệu hoá.
export function Button({ title, onPress, disabled, outline, style }: ButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.button,
        outline && styles.outline,
        pressed && (outline ? styles.outlinePressed : styles.pressed),
        disabled && styles.disabled,
        style,
      ]}
    >
      <Text style={[styles.buttonText, outline && styles.outlineText, disabled && styles.disabledText]}>{title}</Text>
    </Pressable>
  );
}

// Ô nhập kèm nhãn và thông báo lỗi ngay bên dưới (viền đỏ khi lỗi).
export function Field({ label, error, ...input }: TextInputProps & { label: string; error?: string }) {
  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      <TextInput style={[styles.input, !!error && styles.inputError]} placeholderTextColor={colors.muted} {...input} />
      {!!error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
}

export function Empty({ text }: { text: string }) {
  return <Text style={styles.empty}>{text}</Text>;
}

// Thanh dưới cùng màn hình, chừa khoảng an toàn (thanh điều hướng của máy).
export function Footer({ children }: { children: React.ReactNode }) {
  const { bottom } = useSafeAreaInsets();
  return <View style={[styles.footer, { paddingBottom: space.md + bottom }]}>{children}</View>;
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: colors.primary,
    borderRadius: 10,
    paddingVertical: space.md,
    paddingHorizontal: space.lg,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.primary,
  },
  pressed: { backgroundColor: colors.primaryDark },
  outline: { backgroundColor: colors.card },
  outlinePressed: { backgroundColor: colors.primarySoft },
  disabled: { backgroundColor: colors.disabled, borderColor: colors.disabled },
  buttonText: { color: colors.white, fontSize: font.md, fontWeight: '700' },
  outlineText: { color: colors.primary },
  disabledText: { color: colors.white },
  field: { marginBottom: space.lg },
  label: {
    fontSize: font.sm,
    fontWeight: '600',
    color: colors.muted,
    marginBottom: space.xs,
  },
  input: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    paddingHorizontal: space.md,
    paddingVertical: space.md,
    fontSize: font.md,
    color: colors.text,
  },
  inputError: { borderColor: colors.danger },
  error: { color: colors.danger, fontSize: font.sm, marginTop: space.xs },
  empty: {
    textAlign: 'center',
    color: colors.muted,
    fontSize: font.md,
    marginTop: space.xl,
  },
  footer: {
    flexDirection: 'row',
    gap: space.md,
    paddingHorizontal: space.lg,
    paddingTop: space.md,
    backgroundColor: colors.card,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.border,
  },
});
