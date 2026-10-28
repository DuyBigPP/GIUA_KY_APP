import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import type { RootStack } from '../../App';
import { CATEGORIES, Category } from '../data';
import { useStore } from '../store';
import { colors, font, space } from '../theme';
import { Button, Field, Footer } from '../ui';

type Props = NativeStackScreenProps<RootStack, 'DishForm'>;

// Một form dùng cho cả thêm (không có id) và sửa (có id → điền sẵn dữ liệu cũ).
export default function DishFormScreen({ navigation, route }: Props) {
  const { dishes, saveDish } = useStore();
  const editing = dishes.find(d => d.id === route.params?.id);

  const [name, setName] = useState(editing?.name ?? '');
  const [category, setCategory] = useState<Category>(editing?.category ?? CATEGORIES[0]);
  const [price, setPrice] = useState(editing ? String(editing.price) : '');
  const [submitted, setSubmitted] = useState(false);

  // Mỗi hàm trả về câu báo lỗi; chuỗi rỗng nghĩa là hợp lệ.
  const getNameError = () => {
    const key = name.trim().toLowerCase();
    if (!key) {
      return 'Tên món không được để trống';
    }
    // Trùng tên món khác (không phân biệt hoa/thường, bỏ qua chính món đang sửa).
    if (dishes.some(d => d.id !== editing?.id && d.name.trim().toLowerCase() === key)) {
      return 'Tên món đã tồn tại';
    }
    return '';
  };

  const getPriceError = () => {
    if (!/^\d+$/.test(price) || Number(price) <= 0) {
      return 'Giá phải là số lớn hơn 0';
    }
    if (Number(price) % 1000 !== 0) {
      return 'Giá phải là bội số của 1.000';
    }
    return '';
  };

  const nameError = getNameError();
  const priceError = getPriceError();

  const save = () => {
    setSubmitted(true);
    if (nameError || priceError) {
      return;
    }
    saveDish({
      id: editing?.id ?? '',
      name: name.trim(),
      category,
      price: Number(price),
      available: editing?.available ?? true,
    });
    navigation.goBack();
  };

  // Lỗi hiện ngay khi người dùng đã gõ, hoặc sau khi bấm Lưu.
  return (
    <View style={styles.screen}>
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <Field
          label="Tên món"
          placeholder="VD: Phở bò tái"
          value={name}
          onChangeText={setName}
          error={submitted || name ? nameError : ''}
        />

        <Text style={styles.label}>Loại món</Text>
        <View style={styles.chips}>
          {CATEGORIES.map(c => (
            <Button key={c} title={c} outline={c !== category} style={styles.chip} onPress={() => setCategory(c)} />
          ))}
        </View>

        <Field
          label="Giá bán (VNĐ)"
          placeholder="VD: 45000"
          keyboardType="numeric"
          value={price}
          onChangeText={setPrice}
          error={submitted || price ? priceError : ''}
        />
      </ScrollView>

      <Footer>
        <Button title={editing ? 'Lưu thay đổi' : 'Thêm món'} style={styles.flex} onPress={save} />
      </Footer>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  flex: { flex: 1 },
  content: { padding: space.lg },
  label: {
    fontSize: font.sm,
    fontWeight: '600',
    color: colors.muted,
    marginBottom: space.xs,
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: space.sm,
    marginBottom: space.lg,
  },
  chip: { paddingVertical: space.sm, borderRadius: 20 },
});
