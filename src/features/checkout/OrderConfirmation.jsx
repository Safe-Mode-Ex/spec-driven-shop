import { PAYMENT_METHODS } from './PaymentMethodSelect';
import styles from './OrderConfirmation.module.css';

export function OrderConfirmation({ orderSnapshot }) {
  const { contact, payment, orderItems, total } = orderSnapshot;
  const methodLabel =
    PAYMENT_METHODS.find((method) => method.value === payment.method)?.label ||
    payment.method;

  return (
    <div className={styles.confirmation}>
      <h2>Заказ оформлен</h2>
      <p className={styles.thanks}>Спасибо за покупку! Мы свяжемся с вами для подтверждения.</p>

      <section className={styles.section} aria-label="Состав заказа">
        <h3>Состав заказа</h3>
        {orderItems.length === 0 ? (
          <p className={styles.empty}>Состав заказа пуст</p>
        ) : (
          <ul className={styles.items}>
            {orderItems.map((item) => (
              <li key={item.id} className={styles.item}>
                <span className={styles.itemName}>{item.name}</span>
                <span className={styles.itemDetails}>
                  {item.price} ₽ × {item.quantity}
                </span>
                <span className={styles.itemTotal}>{item.price * item.quantity} ₽</span>
              </li>
            ))}
          </ul>
        )}
        <p className={styles.total}>Итого: {total} ₽</p>
      </section>

      <section className={styles.section} aria-label="Способ оплаты">
        <h3>Способ оплаты</h3>
        <p>{methodLabel}</p>
      </section>

      <section className={styles.section} aria-label="Контактные данные">
        <h3>Контактные данные</h3>
        <p>{contact.name}</p>
        <p>{contact.phone}</p>
        <p>{contact.email}</p>
        <p>{contact.address}</p>
      </section>
    </div>
  );
}