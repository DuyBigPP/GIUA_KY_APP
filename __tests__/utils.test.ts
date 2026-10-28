import { money, now, subtotal } from '../src/utils';

test('money định dạng VNĐ', () => {
  expect(money(45000)).toBe('45.000 đ');
  expect(money(1250000)).toBe('1.250.000 đ');
  expect(money(0)).toBe('0 đ');
});

test('now định dạng hh:mm dd/mm/yyyy', () => {
  expect(now(new Date(2026, 9, 5, 8, 7))).toBe('08:07 05/10/2026');
});

test('subtotal cộng đơn giá × số lượng, bỏ qua món đã xoá', () => {
  const dishes = [
    { id: 'a', price: 30000 },
    { id: 'b', price: 5000 },
  ];
  const items = [
    { dishId: 'a', quantity: 2 },
    { dishId: 'b', quantity: 1 },
    { dishId: 'deleted', quantity: 3 },
  ];
  expect(subtotal(items, dishes)).toBe(65000);
});
