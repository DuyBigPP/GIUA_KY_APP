import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import React from 'react';
import { FlatList, Pressable, StyleSheet, Text } from 'react-native';
import type { RootStack } from '../../App';
import { TABLE_COUNT } from '../data';
import { useStore } from '../store';
import { colors, common, font, space } from '../theme';
import { money, subtotal } from '../utils';

type Props = NativeStackScreenProps<RootStack, 'Tables'>;

const TABLES = Array.from({ length: TABLE_COUNT }, (_, i) => i + 1);

export default function TablesScreen({ navigation }: Props) {
  const { dishes, servingOrder } = useStore();

  return (
    <FlatList
      data={TABLES}
      numColumns={2}
      keyExtractor={t => String(t)}
      contentContainerStyle={common.list}
      columnWrapperStyle={styles.columns}
      renderItem={({ item }) => {
        const order = servingOrder(item);
        return (
          <Pressable
            onPress={() => navigation.navigate('Order', { table: item })}
            style={({ pressed }) => [common.card, styles.table, order && styles.busy, pressed && common.pressed]}
          >
            <Text style={[styles.number, order && styles.busyText]}>Bàn {item}</Text>
            <Text style={[styles.status, order && styles.busyText]}>
              {order ? money(subtotal(order.items, dishes)) : 'Trống'}
            </Text>
            {order && <Text style={styles.time}>Từ {order.createdAt}</Text>}
          </Pressable>
        );
      }}
    />
  );
}

const styles = StyleSheet.create({
  columns: { gap: space.md },
  table: { flex: 1, minHeight: 110, justifyContent: 'center' },
  busy: { backgroundColor: colors.primary },
  number: { fontSize: font.xl, fontWeight: '800', color: colors.text },
  status: { fontSize: font.md, color: colors.muted, marginTop: space.xs },
  busyText: { color: colors.white, fontWeight: '700' },
  time: { fontSize: font.sm, color: colors.primarySoft, marginTop: space.xs },
});
