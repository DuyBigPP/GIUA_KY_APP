import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import React from 'react';
import { Alert, Pressable, SectionList, StyleSheet, Switch, Text, View } from 'react-native';
import type { RootStack } from '../../App';
import { CATEGORIES, Dish, SERVING, TABLE_COUNT } from '../data';
import { useStore } from '../store';
import { colors, common, font, space } from '../theme';
import { Button, Empty, Footer } from '../ui';
import { money } from '../utils';

type Props = NativeStackScreenProps<RootStack, 'Menu'>;

export default function MenuScreen({ navigation }: Props) {
  const { dishes, orders, toggleDish, deleteDish, isServing } = useStore();
  const busyTables = orders.filter(o => o.status === SERVING).length;

  // Nhóm món theo loại, bỏ nhóm không có món nào.
  const sections = CATEGORIES.map(title => ({
    title,
    data: dishes.filter(d => d.category === title),
  })).filter(s => s.data.length > 0);

  const confirmDelete = (dish: Dish) => {
    if (isServing(dish.id)) {
      Alert.alert('Không thể xoá', `"${dish.name}" đang có trong hoá đơn đang phục vụ.`);
      return;
    }
    Alert.alert('Xoá món', `Bạn có chắc muốn xoá "${dish.name}"?`, [
      { text: 'Huỷ', style: 'cancel' },
      { text: 'Xoá', style: 'destructive', onPress: () => deleteDish(dish.id) },
    ]);
  };

  return (
    <View style={styles.screen}>
      <Text style={styles.summary}>
        {dishes.length} món · {busyTables}/{TABLE_COUNT} bàn có khách
      </Text>

      <SectionList
        sections={sections}
        keyExtractor={d => d.id}
        contentContainerStyle={common.list}
        stickySectionHeadersEnabled={false}
        ListEmptyComponent={<Empty text="Chưa có món nào trong thực đơn" />}
        renderSectionHeader={({ section }) => <Text style={styles.section}>{section.title}</Text>}
        renderItem={({ item }) => (
          <Pressable
            onPress={() => navigation.navigate('DishForm', { id: item.id })}
            onLongPress={() => confirmDelete(item)}
            style={({ pressed }) => [common.card, styles.row, !item.available && common.off, pressed && common.pressed]}
          >
            <View style={styles.info}>
              <Text style={common.title}>{item.name}</Text>
              <Text style={styles.price}>{money(item.price)}</Text>
            </View>
            {!item.available && <Text style={styles.badge}>Hết món</Text>}
            <Switch
              value={item.available}
              onValueChange={() => toggleDish(item.id)}
              trackColor={{ true: colors.primary, false: colors.disabled }}
              thumbColor={colors.white}
            />
          </Pressable>
        )}
      />

      <Footer>
        <Button title="Sơ đồ bàn" outline style={styles.flex} onPress={() => navigation.navigate('Tables')} />
        <Button title="+ Thêm món" style={styles.flex} onPress={() => navigation.navigate('DishForm')} />
      </Footer>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  flex: { flex: 1 },
  summary: {
    paddingHorizontal: space.lg,
    paddingVertical: space.md,
    backgroundColor: colors.primarySoft,
    color: colors.primaryDark,
    fontSize: font.md,
    fontWeight: '600',
  },
  section: {
    fontSize: font.sm,
    fontWeight: '700',
    color: colors.muted,
    textTransform: 'uppercase',
    marginTop: space.sm,
  },
  row: { flexDirection: 'row', alignItems: 'center', gap: space.sm },
  info: { flex: 1 },
  price: {
    fontSize: font.md,
    color: colors.primary,
    fontWeight: '600',
    marginTop: space.xs,
  },
  badge: {
    fontSize: font.sm,
    color: colors.danger,
    fontWeight: '700',
    backgroundColor: colors.dangerSoft,
    paddingHorizontal: space.sm,
    paddingVertical: 2,
    borderRadius: 6,
  },
});
