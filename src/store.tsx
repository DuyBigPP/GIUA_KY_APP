import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { Dish, Order, PAID, SEED_DISHES, SEED_ORDERS, SERVING } from './data';
import { colors } from './theme';
import { now } from './utils';

// Hoá đơn "Đang phục vụ" của một bàn (mỗi bàn tối đa 1 hoá đơn như vậy).
const findServing = (orders: Order[], table: number) =>
  orders.find(o => o.tableNumber === table && o.status === SERVING);

function useRestaurant() {
  const [dishes, setDishes] = useState<Dish[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [ready, setReady] = useState(false);

  // 1) Mở app: đọc dữ liệu đã lưu. Chưa có (lần đầu) hoặc lỗi → dùng dữ liệu mẫu.
  useEffect(() => {
    const load = async () => {
      try {
        const saved = await AsyncStorage.getMany(['dishes', 'orders']);
        setDishes(saved.dishes ? JSON.parse(saved.dishes) : SEED_DISHES);
        setOrders(saved.orders ? JSON.parse(saved.orders) : SEED_ORDERS);
      } catch {
        setDishes(SEED_DISHES);
        setOrders(SEED_ORDERS);
      }
      setReady(true);
    };
    load();
  }, []);

  // 2) Mỗi khi dữ liệu đổi → lưu lại. Chờ đọc xong mới lưu, tránh ghi đè bằng mảng rỗng.
  useEffect(() => {
    if (ready) {
      AsyncStorage.setMany({ dishes: JSON.stringify(dishes), orders: JSON.stringify(orders) });
    }
  }, [ready, dishes, orders]);

  // ---- Món ăn ----

  // Thêm mới nếu chưa có id, ngược lại thì sửa món có id đó.
  const saveDish = (dish: Dish) => {
    if (dish.id) {
      setDishes(prev => prev.map(d => (d.id === dish.id ? dish : d)));
    } else {
      setDishes(prev => [...prev, { ...dish, id: Date.now().toString() }]);
    }
  };

  const toggleDish = (id: string) =>
    setDishes(prev => prev.map(d => (d.id === id ? { ...d, available: !d.available } : d)));

  const deleteDish = (id: string) => setDishes(prev => prev.filter(d => d.id !== id));

  // Món có nằm trong hoá đơn đang phục vụ nào không (nếu có thì không cho xoá).
  const isServing = (dishId: string) =>
    orders.some(o => o.status === SERVING && o.items.some(i => i.dishId === dishId));

  // ---- Hoá đơn ----

  const servingOrder = (table: number) => findServing(orders, table);

  // Bấm + (delta = 1) hoặc − (delta = -1) cho một món của bàn.
  const changeQty = (table: number, dishId: string, delta: number) =>
    setOrders(prev => {
      // Bàn chưa có khách → tạo hoá đơn mới.
      const order = findServing(prev, table) ?? {
        id: Date.now().toString(),
        tableNumber: table,
        items: [],
        status: SERVING,
        createdAt: now(),
      };

      // Món đã có → cộng/trừ số lượng; chưa có → thêm vào với số lượng = delta.
      const hasDish = order.items.some(i => i.dishId === dishId);
      let items = hasDish
        ? order.items.map(i => (i.dishId === dishId ? { ...i, quantity: i.quantity + delta } : i))
        : [...order.items, { dishId, quantity: delta }];

      // Số lượng về 0 → bỏ món khỏi hoá đơn.
      items = items.filter(i => i.quantity > 0);

      // Thay hoá đơn cũ bằng bản mới. Hết món thì bỏ hẳn hoá đơn → bàn trống lại.
      const others = prev.filter(o => o.id !== order.id);
      return items.length > 0 ? [...others, { ...order, items }] : others;
    });

  const pay = (orderId: string) =>
    setOrders(prev => prev.map(o => (o.id === orderId ? { ...o, status: PAID } : o)));

  return { dishes, orders, ready, saveDish, toggleDish, deleteDish, isServing, servingOrder, changeQty, pay };
}

// Context giúp mọi màn hình dùng chung một kho dữ liệu qua useStore().
type Store = ReturnType<typeof useRestaurant>;
const StoreContext = createContext<Store | null>(null);

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const store = useRestaurant();
  if (!store.ready) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }
  return <StoreContext.Provider value={store}>{children}</StoreContext.Provider>;
}

export const useStore = () => useContext(StoreContext) as Store;

const styles = StyleSheet.create({
  loading: { flex: 1, justifyContent: 'center', backgroundColor: colors.bg },
});
