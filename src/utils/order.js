const VALID_PAYMENT_METHODS = ['card', 'cod', 'online'];

export function buildOrderSnapshot(cartItems, contact, payment, total) {
  if (!payment || !VALID_PAYMENT_METHODS.includes(payment.method)) {
    throw new Error(
      `Invalid payment method: must be one of ${VALID_PAYMENT_METHODS.join(', ')}`,
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
