import { describe, it, expect } from 'vitest';
import { buildOrderSnapshot } from '../order.js';
import { PAYMENT_METHODS } from '../../features/checkout/payment-methods';

const cartItems = [
  { id: 1, name: 'Футболка', price: 2490, quantity: 2 },
  { id: 2, name: 'Кроссовки', price: 8990, quantity: 1 },
];

const validPayment = { method: 'card' };

describe('buildOrderSnapshot', () => {
  it('возвращает orderItems с копиями товаров', () => {
    const result = buildOrderSnapshot(cartItems, validPayment, 13970);

    expect(result.orderItems).toHaveLength(2);
    expect(result.orderItems[0]).toEqual({
      id: 1,
      name: 'Футболка',
      price: 2490,
      quantity: 2,
    });
    expect(result.orderItems[1]).toEqual({
      id: 2,
      name: 'Кроссовки',
      price: 8990,
      quantity: 1,
    });
  });

  it('принимает total из аргумента, не считает сам', () => {
    const result = buildOrderSnapshot(cartItems, validPayment, 9999);
    expect(result.total).toBe(9999);
  });

  it('не мутирует входной массив cartItems', () => {
    const original = cartItems.map((item) => ({ ...item }));
    buildOrderSnapshot(cartItems, validPayment, 13970);

    expect(cartItems).toEqual(original);
    expect(cartItems[0]).toEqual(original[0]);
    expect(cartItems[1]).toEqual(original[1]);
  });

  it('создаёт новые объекты товаров, а не ссылки', () => {
    const result = buildOrderSnapshot(cartItems, validPayment, 13970);

    expect(result.orderItems[0]).not.toBe(cartItems[0]);
    expect(result.orderItems[1]).not.toBe(cartItems[1]);
  });

  it('возвращает пустой orderItems для пустой корзины', () => {
    const result = buildOrderSnapshot([], validPayment, 0);
    expect(result.orderItems).toEqual([]);
    expect(result.total).toBe(0);
  });

  it('не включает contact и payment в результат', () => {
    const result = buildOrderSnapshot(cartItems, validPayment, 13970);
    expect(result).not.toHaveProperty('contact');
    expect(result).not.toHaveProperty('payment');
  });

  it('использует PAYMENT_METHODS как единый источник допустимых методов', () => {
    const values = PAYMENT_METHODS.map((method) => method.value);
    expect(() => buildOrderSnapshot(cartItems, { method: values[0] }, 0)).not.toThrow();
  });

  describe('payment.method — допустимые значения', () => {
    it('принимает card', () => {
      const result = buildOrderSnapshot(cartItems, { method: 'card' }, 0);
      expect(result.orderItems).toBeDefined();
    });

    it('принимает cod', () => {
      const result = buildOrderSnapshot(cartItems, { method: 'cod' }, 0);
      expect(result.orderItems).toBeDefined();
    });

    it('принимает online', () => {
      const result = buildOrderSnapshot(cartItems, { method: 'online' }, 0);
      expect(result.orderItems).toBeDefined();
    });
  });

  describe('payment.method — невалидные значения', () => {
    it('бросает ошибку при undefined', () => {
      expect(() =>
        buildOrderSnapshot(cartItems, { method: undefined }, 0),
      ).toThrow('Invalid payment method');
    });

    it('бросает ошибку при пустой строке', () => {
      expect(() =>
        buildOrderSnapshot(cartItems, { method: '' }, 0),
      ).toThrow('Invalid payment method');
    });

    it('бросает ошибку при неизвестном методе', () => {
      expect(() =>
        buildOrderSnapshot(cartItems, { method: 'bitcoin' }, 0),
      ).toThrow('Invalid payment method');
    });

    it('бросает ошибку при null payment', () => {
      expect(() =>
        buildOrderSnapshot(cartItems, null, 0),
      ).toThrow('Invalid payment method');
    });
  });
});
