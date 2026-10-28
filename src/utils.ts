export const VAT = 0.08;

// 45000 -> "45.000 đ"
export const money = (n: number) =>
  `${Math.round(n)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, '.')} đ`;

const pad = (n: number) => String(n).padStart(2, '0');

// Thời điểm hiện tại dạng "hh:mm dd/mm/yyyy"
export const now = (d = new Date()) =>
  `${pad(d.getHours())}:${pad(d.getMinutes())} ${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()}`;

// Tạm tính = tổng (đơn giá × số lượng); món đã bị xoá khỏi thực đơn thì bỏ qua.
export const subtotal = (items: { dishId: string; quantity: number }[], dishes: { id: string; price: number }[]) =>
  items.reduce((sum, i) => sum + (dishes.find(d => d.id === i.dishId)?.price ?? 0) * i.quantity, 0);
