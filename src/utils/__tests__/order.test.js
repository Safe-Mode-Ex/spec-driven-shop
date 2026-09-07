import { describe, it, expect } from 'vitest';
import { buildOrderSnapshot } from '../order.js';

const cartItems = [
  { id: 1, name: 'Футболка', price: 2490, quantity: 2 },
  { id: 2, name: 'Кроссовки', price: 8990, quantity: 1 },
];

const contact = {
  name: 'Иван',
  phone: '+79001234567',
  email: 'ivan@example.com',
  address: 'ул. Пушкина, д. 10',
};

const validPayment = { method: 'card' };

describe('buildOrderSnapshot', () => {
  it('возвращает orderItems с копиями товаров', () => {
    const result = buildOrderSnapshot(cartItems, contact, validPayment, 13970);

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
    const result = buildOrderSnapshot(cartItems, contact, validPayment, 9999);
    expect(result.total).toBe(9999);
  });

  it('не мутирует входной массив cartItems', () => {
    const original = cartItems.map((item) => ({ ...item }));
    buildOrderSnapshot(cartItems, contact, validPayment, 13970);

    expect(cartItems).toEqual(original);
    expect(cartItems[0]).toBe(original[0].id === cartItems[0].id ? cartItems[0] : null);
  });

  it('создаёт новые объекты товаров, а не ссылки', () => {
    const result = buildOrderSnapshot(cartItems, contact, validPayment, 13970);

    expect(result.orderItems[0]).not.toBe(cartItems[0]);
    expect(result.orderItems[1]).not.toBe(cartItems[1]);
  });

  it('возвращает пустой orderItems для пустой корзины', () => {
    const result = buildOrderSnapshot([], contact, validPayment, 0);
    expect(result.orderItems).toEqual([]);
    expect(result.total).toBe(0);
  });

  it('не включает contact и payment в результат', () => {
    const result = buildOrderSnapshot(cartItems, contact, validPayment, 13970);
    expect(result).not.toHaveProperty('contact');
    expect(result).not.toHaveProperty('payment');
  });

  describe('payment.method — допустимые значения', () => {
    it('принимает card', () => {
      const result = buildOrderSnapshot(cartItems, contact, { method: 'card' }, 0);
      expect(result.orderItems).toBeDefined();
    });

    it('принимает cod', () => {
      const result = buildOrderSnapshot(cartItems, contact, { method: 'cod' }, 0);
      expect(result.orderItems).toBeDefined();
    });

    it('принимает online', () => {
      const result = buildOrderSnapshot(cartItems, contact, { method: 'online' }, 0);
      expect(result.orderItems).toBeDefined();
    });
  });

  describe('payment.method — невалидные значения', () => {
    it('бросает ошибку при undefined', () => {
      expect(() =>
        buildOrderSnapshot(cartItems, contact, { method: undefined }, 0),
      ).toThrow('Invalid payment method');
    });

    it('бросает ошибку при пустой строке', () => {
      expect(() =>
        buildOrderSnapshot(cartItems, contact, { method: '' }, 0),
      ).toThrow('Invalid payment method');
    });

    it('бросает ошибку при неизвестном методе', () => {
      expect(() =>
        buildOrderSnapshot(cartItems, contact, { method: 'bitcoin' }, 0),
      ).toThrow('Invalid payment method');
    });

    it('бросает ошибку при null payment', () => {
      expect(() =>
        buildOrderSnapshot(cartItems, contact, null, 0),
      ).toThrow('Invalid payment method');
    });
  });
});
