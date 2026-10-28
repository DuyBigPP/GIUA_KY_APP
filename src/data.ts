import { now } from './utils';

export const CATEGORIES = ['Khai vị', 'Món chính', 'Tráng miệng', 'Đồ uống'] as const;
export type Category = (typeof CATEGORIES)[number];

export const TABLE_COUNT = 10;
export const SERVING = 'Đang phục vụ';
export const PAID = 'Đã thanh toán';

export type Dish = {
  id: string;
  name: string;
  category: Category;
  price: number;
  available: boolean;
};

export type OrderItem = { dishId: string; quantity: number };

export type Order = {
  id: string;
  tableNumber: number;
  items: OrderItem[];
  status: typeof SERVING | typeof PAID;
  createdAt: string;
};

// Dữ liệu mẫu cho lần chạy đầu tiên: 10 món đủ 4 loại + 1 hoá đơn đang phục vụ.
export const SEED_DISHES: Dish[] = [
  { id: 'd1', name: 'Gỏi cuốn tôm thịt', category: 'Khai vị', price: 45000, available: true },
  { id: 'd2', name: 'Chả giò rế', category: 'Khai vị', price: 50000, available: true },
  { id: 'd3', name: 'Phở bò tái', category: 'Món chính', price: 65000, available: true },
  { id: 'd4', name: 'Cơm tấm sườn bì', category: 'Món chính', price: 55000, available: true },
  { id: 'd5', name: 'Bún chả Hà Nội', category: 'Món chính', price: 60000, available: true },
  { id: 'd6', name: 'Chè khúc bạch', category: 'Tráng miệng', price: 30000, available: true },
  { id: 'd7', name: 'Bánh flan', category: 'Tráng miệng', price: 25000, available: true },
  { id: 'd8', name: 'Cà phê sữa đá', category: 'Đồ uống', price: 29000, available: true },
  { id: 'd9', name: 'Trà đào cam sả', category: 'Đồ uống', price: 35000, available: true },
  { id: 'd10', name: 'Nước ép dưa hấu', category: 'Đồ uống', price: 32000, available: false },
];

export const SEED_ORDERS: Order[] = [
  {
    id: 'o1',
    tableNumber: 3,
    items: [
      { dishId: 'd3', quantity: 2 },
      { dishId: 'd8', quantity: 2 },
    ],
    status: SERVING,
    createdAt: now(),
  },
];
