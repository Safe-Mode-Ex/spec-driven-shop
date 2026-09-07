import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import CheckoutPage from '../CheckoutPage.jsx';

const { mockCart } = vi.hoisted(() => ({
  mockCart: {
    items: [],
    getTotal: vi.fn(() => 13970),
    clearCart: vi.fn(),
  },
}));

vi.mock('../../cart/CartContext', () => ({
  CartProvider: ({ children }) => children,
  useCart: () => mockCart,
}));

const cartItems = [
  { id: 1, name: 'Футболка', price: 2490, quantity: 2 },
  { id: 2, name: 'Кроссовки', price: 8990, quantity: 1 },
];

beforeEach(() => {
  mockCart.items = [];
  mockCart.getTotal.mockClear();
  mockCart.clearCart.mockClear();
});

function fillValidForm() {
  fireEvent.change(screen.getByLabelText('Имя'), { target: { value: 'Иван' } });
  fireEvent.change(screen.getByLabelText('Телефон'), {
    target: { value: '+79001234567' },
  });
  fireEvent.change(screen.getByLabelText('Email'), {
    target: { value: 'ivan@example.com' },
  });
  fireEvent.change(screen.getByLabelText('Адрес доставки'), {
    target: { value: 'ул. Пушкина, д. 10' },
  });
  fireEvent.click(screen.getByLabelText('Картой при оформлении'));
}

describe('CheckoutPage', () => {
  it('показывает «Корзина пуста» и не рендерит форму при пустой корзине', () => {
    render(<CheckoutPage />);
    expect(screen.getByText(/корзина пуста/i)).toBeTruthy();
    expect(screen.queryByLabelText('Имя')).toBeNull();
    expect(screen.queryByRole('button', { name: /оформить заказ/i })).toBeNull();
  });

  it('рендерит форму при непустой корзине', () => {
    mockCart.items = cartItems;
    render(<CheckoutPage />);
    expect(screen.getByLabelText('Имя')).toBeTruthy();
    expect(screen.getByText('Товаров: 2')).toBeTruthy();
  });

  it('после успешного submit переключается на подтверждение со снапшотом', () => {
    mockCart.items = cartItems;
    render(<CheckoutPage />);
    fillValidForm();
    fireEvent.click(screen.getByRole('button', { name: /оформить заказ/i }));

    expect(screen.getByRole('heading', { name: 'Заказ оформлен' })).toBeTruthy();
    expect(screen.getByText('Футболка')).toBeTruthy();
    expect(screen.getByText('Кроссовки')).toBeTruthy();
    expect(screen.getByText('Итого: 13970 ₽')).toBeTruthy();
    expect(screen.getByText('Картой при оформлении')).toBeTruthy();
    expect(screen.getByText('Иван')).toBeTruthy();
  });

  it('итог подтверждения берётся из getTotal() в момент submit', () => {
    mockCart.items = cartItems;
    render(<CheckoutPage />);
    fillValidForm();
    fireEvent.click(screen.getByRole('button', { name: /оформить заказ/i }));

    expect(mockCart.getTotal).toHaveBeenCalledTimes(2);
    expect(screen.getByText('Итого: 13970 ₽')).toBeTruthy();
  });

  it('вызывает clearCart после оформления', () => {
    mockCart.items = cartItems;
    render(<CheckoutPage />);
    fillValidForm();
    fireEvent.click(screen.getByRole('button', { name: /оформить заказ/i }));

    expect(mockCart.clearCart).toHaveBeenCalledTimes(1);
  });
});
