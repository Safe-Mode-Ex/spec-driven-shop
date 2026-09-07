import { useState } from 'react';
import { useCart } from '../cart/CartContext';
import { OrderForm } from './OrderForm';
import { OrderConfirmation } from './OrderConfirmation';
import { buildOrderSnapshot } from '../../utils/order';
import styles from './CheckoutPage.module.css';

function CheckoutPage() {
  const { items, getTotal, clearCart } = useCart();
  const [orderSnapshot, setOrderSnapshot] = useState(null);

  const handleOrderSubmit = (orderData) => {
    const contact = {
      name: orderData.name,
      phone: orderData.phone,
      email: orderData.email,
      address: orderData.address,
    };
    const payment = orderData.payment;
    const total = getTotal();
    const { orderItems } = buildOrderSnapshot(items, payment, total);
    const snapshot = { contact, payment, orderItems, total };
    setOrderSnapshot(snapshot);
    clearCart();
  };

  if (orderSnapshot) {
    return <OrderConfirmation orderSnapshot={orderSnapshot} />;
  }

  if (items.length === 0) {
    return (
      <div className={styles.empty}>
        <h2>Оформление заказа</h2>
        <p>Корзина пуста. Добавьте товары в каталоге.</p>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <OrderForm
        cartItems={items}
        totalPrice={getTotal()}
        onSubmit={handleOrderSubmit}
      />
    </div>
  );
}

export default CheckoutPage;
