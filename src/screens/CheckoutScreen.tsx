import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, View } from 'react-native';
import type { RootStack } from '../../App';
import { useStore } from '../store';
import { colors, common, font, space } from '../theme';
import { Button, Empty, Field, Footer } from '../ui';
import { money, subtotal, VAT } from '../utils';

type Props = NativeStackScreenProps<RootStack, 'Checkout'>;

export default function CheckoutScreen({ navigation, route }: Props) {
  const { table } = route.params;
  const { dishes, servingOrder, pay } = useStore();
  const order = servingOrder(table);
  const [cash, setCash] = useState('');

  // Ghép mỗi món trong hoá đơn với thông tin món ở thực đơn.
  const lines = (order?.items ?? []).flatMap(i => {
    const dish = dishes.find(d => d.id === i.dishId);
    return dish ? [{ ...i, name: dish.name, price: dish.price }] : [];
  });
  const sub = subtotal(order?.items ?? [], dishes);
  const vat = Math.round(sub * VAT);
  const total = sub + vat;
  const given = Number(cash) || 0;
  const canPay = lines.length > 0 && given >= total;

  const confirm = () => {
    pay(order!.id);
    Alert.alert('Thanh toán thành công', `Bàn ${table} · Tiền thừa ${money(given - total)}`);
    navigation.popTo('Tables');
  };

  return (
    <View style={styles.screen}>
      <ScrollView contentContainerStyle={common.list} keyboardShouldPersistTaps="handled">
        <View style={common.card}>
          {order && <Text style={common.sub}>Mở lúc {order.createdAt}</Text>}
          <View style={[styles.line, styles.head]}>
            <Text style={[styles.name, styles.headText]}>Món</Text>
            <Text style={[styles.qty, styles.headText]}>SL</Text>
            <Text style={[styles.cell, styles.headText]}>Đơn giá</Text>
            <Text style={[styles.cell, styles.headText]}>Thành tiền</Text>
          </View>
          {lines.length === 0 && <Empty text="Hoá đơn chưa có món nào" />}
          {lines.map(l => (
            <View key={l.dishId} style={styles.line}>
              <Text style={styles.name}>{l.name}</Text>
              <Text style={styles.qty}>{l.quantity}</Text>
              <Text style={styles.cell}>{money(l.price)}</Text>
              <Text style={[styles.cell, styles.bold]}>{money(l.price * l.quantity)}</Text>
            </View>
          ))}
        </View>

        <View style={common.card}>
          <Row label="Tạm tính" value={money(sub)} />
          <Row label={`VAT ${VAT * 100}%`} value={money(vat)} />
          <View style={styles.divider} />
          <Row label="Tổng cộng" value={money(total)} big />
        </View>

        <View style={common.card}>
          <Field
            label="Tiền khách đưa (VNĐ)"
            placeholder="Nhập số tiền"
            keyboardType="numeric"
            value={cash}
            onChangeText={setCash}
            error={cash && given < total ? 'Tiền khách đưa chưa đủ' : ''}
          />
          <Row label="Tiền thừa" value={money(Math.max(given - total, 0))} big />
        </View>
      </ScrollView>

      <Footer>
        <Button title="Xác nhận thanh toán" style={styles.flex} disabled={!canPay} onPress={confirm} />
      </Footer>
    </View>
  );
}

function Row({ label, value, big }: { label: string; value: string; big?: boolean }) {
  return (
    <View style={styles.row}>
      <Text style={[styles.rowLabel, big && styles.big]}>{label}</Text>
      <Text style={[styles.rowValue, big && styles.bigValue]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  flex: { flex: 1 },
  line: {
    flexDirection: 'row',
    paddingVertical: space.sm,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  head: { marginTop: space.sm },
  headText: { color: colors.muted, fontSize: font.sm, fontWeight: '700' },
  name: { flex: 2, fontSize: font.md, color: colors.text },
  qty: { width: 32, textAlign: 'center', fontSize: font.md, color: colors.text },
  cell: { flex: 1.3, textAlign: 'right', fontSize: font.md, color: colors.text },
  bold: { fontWeight: '700' },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: space.xs,
  },
  rowLabel: { fontSize: font.md, color: colors.muted },
  rowValue: { fontSize: font.md, color: colors.text, fontWeight: '600' },
  big: { color: colors.text, fontWeight: '700', fontSize: font.lg },
  bigValue: { color: colors.primary, fontWeight: '800', fontSize: font.xl },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: colors.border,
    marginVertical: space.sm,
  },
});
