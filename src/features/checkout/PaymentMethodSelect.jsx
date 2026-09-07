import styles from './PaymentMethodSelect.module.css';

export const PAYMENT_METHODS = [
  { value: 'card', label: 'Картой при оформлении' },
  { value: 'cod', label: 'Наличными при получении' },
  { value: 'online', label: 'Онлайн-перевод' },
];

export function PaymentMethodSelect({ value = '', onChange, error, touched }) {
  const showError = touched && Boolean(error);

  return (
    <fieldset className={styles.group}>
      <legend className={styles.legend}>Способ оплаты</legend>
      {PAYMENT_METHODS.map((method) => (
        <label key={method.value} className={styles.option}>
          <input
            type="radio"
            name="paymentMethod"
            value={method.value}
            checked={value === method.value}
            onChange={() => onChange(method.value)}
            aria-checked={value === method.value}
            className={styles.radio}
          />
          <span>{method.label}</span>
        </label>
      ))}
      {showError && (
        <span id="payment-error" className={styles.error} role="alert">
          {error}
        </span>
      )}
    </fieldset>
  );
}
