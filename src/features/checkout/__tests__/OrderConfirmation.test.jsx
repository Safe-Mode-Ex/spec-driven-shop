import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { OrderConfirmation } from '../OrderConfirmation.jsx';

const orderSnapshot = {
  contact: {
    name: 'Иван',
    phone: '+79001234567',
    email: 'ivan@example.com',
    address: 'ул. Пушкина, д. 10',
  },
  payment: { method: 'card' },
  orderItems: [
    { id: 1, name: 'Футболка', price: 2490, quantity: 2 },
    { id: 2, name: 'Кроссовки', price: 8990, quantity: 1 },
  ],
  total: 13970,
};

describe('OrderConfirmation', () => {
  it('показывает заголовок и благодарность', () => {
    render(<OrderConfirmation orderSnapshot={orderSnapshot} />);
    expect(screen.getByRole('heading', { name: 'Заказ оформлен' })).toBeTruthy();
    expect(screen.getByText(/спасибо за покупку/i)).toBeTruthy();
  });

  it('показывает состав заказа: имя, цену и количествo', () => {
    render(<OrderConfirmation orderSnapshot={orderSnapshot} />);
    expect(screen.getByText('Футболка')).toBeTruthy();
    expect(screen.getByText('Кроссовки')).toBeTruthy();
    expect(screen.getByText('2490 ₽ × 2')).toBeTruthy();
    expect(screen.getByText('8990 ₽ × 1')).toBeTruthy();
  });

  it('показывает сумму строк и итог', () => {
    render(<OrderConfirmation orderSnapshot={orderSnapshot} />);
    expect(screen.getByText('4980 ₽')).toBeTruthy();
    expect(screen.getByText('8990 ₽')).toBeTruthy();
    expect(screen.getByText('Итого: 13970 ₽')).toBeTruthy();
  });

  it('показывает выбранный способ оплаты названием', () => {
    render(<OrderConfirmation orderSnapshot={orderSnapshot} />);
    expect(screen.getByText('Картой при оформлении')).toBeTruthy();
  });

  it('показывает контактные данные', () => {
    render(<OrderConfirmation orderSnapshot={orderSnapshot} />);
    expect(screen.getByText('Иван')).toBeTruthy();
    expect(screen.getByText('+79001234567')).toBeTruthy();
    expect(screen.getByText('ivan@example.com')).toBeTruthy();
    expect(screen.getByText('ул. Пушкина, д. 10')).toBeTruthy();
  });

  it('не падает при пустом составе, показывает заглушку', () => {
    const emptySnapshot = {
      ...orderSnapshot,
      orderItems: [],
      total: 0,
    };
    render(<OrderConfirmation orderSnapshot={emptySnapshot} />);
    expect(screen.getByText('Состав заказа пуст')).toBeTruthy();
    expect(screen.getByText('Итого: 0 ₽')).toBeTruthy();
  });
});