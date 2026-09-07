import { PAYMENT_METHODS } from '../features/checkout/payment-methods';

const PAYMENT_METHOD_VALUES = PAYMENT_METHODS.map((method) => method.value);

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