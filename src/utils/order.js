import { PAYMENT_METHODS } from '../features/checkout/payment-methods';

const PAYMENT_METHOD_VALUES = PAYMENT_METHODS.map((method) => method.value);

/**
 * Строит снапшот заказа из текущего состава корзины.
 * Замораживает копии товаров и итоговую сумму в момент отправки формы,
 * чтобы подтверждение не менялось при последующем редактировании корзины.
 * Итог не пересчитывается: `total` принимается готовым из `useCart.getTotal()`.
 * @param {Array<{ id: number, name: string, price: number, quantity: number }>} cartItems - состав корзины
 * @param {{ method: 'card' | 'cod' | 'online' }} payment - выбранный способ оплаты
 * @param {number} total - итоговая сумма заказа из корзины
 * @returns {{ orderItems: Array<{ id: number, name: string, price: number, quantity: number }>, total: number }} снапшот заказа
 * @throws {Error} если `payment.method` не входит в допустимые способы оплаты (PAYMENT_METHODS)
 */
export function buildOrderSnapshot(cartItems, payment, total) {
  if (!payment || !PAYMENT_METHOD_VALUES.includes(payment.method)) {
    throw new Error(
      `Invalid payment method: must be one of ${PAYMENT_METHOD_VALUES.join(', ')}`,
    );
  }

  const orderItems = cartItems.map((item) => ({
    id: item.id,
    name: item.name,
    price: item.price,
    quantity: item.quantity,
  }));

  return { orderItems, total };
}