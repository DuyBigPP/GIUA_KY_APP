import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import React from 'react';
import { Alert, FlatList, StyleSheet, Text, View } from 'react-native';
import type { RootStack } from '../../App';
import { Dish } from '../data';
import { useStore } from '../store';
import { colors, common, font, space } from '../theme';
import { Button, Empty, Footer } from '../ui';
import { money, subtotal } from '../utils';

type Props = NativeStackScreenProps<RootStack, 'Order'>;

export default function OrderScreen({ navigation, route }: Props) {
  const { table } = route.params;
  const { dishes, servingOrder, changeQty } = useStore();
  // Bàn đã có khách → mở lại đúng hoá đơn đang phục vụ của bàn đó.
  const order = servingOrder(table);
  const qtyOf = (dishId: string) => order?.items.find(i => i.dishId === dishId)?.quantity ?? 0;

  // Giảm về 0 = bỏ món khỏi hoá đơn → là thao tác xoá nên phải hỏi xác nhận.
  const decrease = (dish: Dish, qty: number) => {
    if (qty > 1) {
      return changeQty(table, dish.id, -1);
    }
    Alert.alert('Bỏ món', `Bỏ "${dish.name}" khỏi hoá đơn?`, [
      { text: 'Huỷ', style: 'cancel' },
      { text: 'Bỏ', style: 'destructive', onPress: () => changeQty(table, dish.id, -1) },
    ]);
  };

  return (
    <View style={styles.screen}>
      <FlatList
        data={dishes}
        keyExtractor={d => d.id}
        contentContainerStyle={common.list}
        ListEmptyComponent={<Empty text="Thực đơn đang trống" />}
        renderItem={({ item }) => {
          const qty = qtyOf(item.id);
          return (
            <View style={[common.card, styles.row, !item.available && common.off]}>
              <View style={styles.info}>
                <Text style={common.title}>{item.name}</Text>
                <Text style={common.sub}>{item.available ? money(item.price) : 'Hết món'}</Text>
              </View>
              <Button
                title="−"
                outline
                style={styles.qtyButton}
                disabled={qty === 0}
                onPress={() => decrease(item, qty)}
              />
              <Text style={styles.qty}>{qty}</Text>
              <Button
                title="+"
                style={styles.qtyButton}
                disabled={!item.available}
                onPress={() => changeQty(table, item.id, 1)}
              />
            </View>
          );
        }}
      />

      <Footer>
        <View style={styles.flex}>
          <Text style={common.sub}>Tạm tính</Text>
          <Text style={styles.total}>{money(order ? subtotal(order.items, dishes) : 0)}</Text>
        </View>
        <Button title="Thanh toán" disabled={!order} onPress={() => navigation.navigate('Checkout', { table })} />
      </Footer>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  flex: { flex: 1 },
  row: { flexDirection: 'row', alignItems: 'center', gap: space.sm },
  info: { flex: 1 },
  qtyButton: { width: 40, paddingHorizontal: 0, paddingVertical: space.sm },
  qty: {
    minWidth: 28,
    textAlign: 'center',
    fontSize: font.lg,
    fontWeight: '700',
    color: colors.text,
  },
  total: { fontSize: font.xl, fontWeight: '800', color: colors.primary },
});
