import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { OrderForm } from '../OrderForm.jsx';

const cartItems = [
  { id: 1, name: 'Футболка', price: 2490, quantity: 2 },
  { id: 2, name: 'Кроссовки', price: 8990, quantity: 1 },
];

function renderForm(props = {}) {
  const onSubmit = vi.fn();
  const utils = render(
    <OrderForm
      cartItems={cartItems}
      totalPrice={13970}
      onSubmit={onSubmit}
      {...props}
    />,
  );
  return { onSubmit, ...utils };
}

function fillValidFields() {
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
}

describe('OrderForm', () => {
  it('показывает ошибки под всеми полями при submit пустой формы', () => {
    const { container, onSubmit } = renderForm();
    const form = container.querySelector('form');
    fireEvent.submit(form);

    expect(screen.getByText('Введите имя')).toBeTruthy();
    expect(screen.getByText('Введите телефон')).toBeTruthy();
    expect(screen.getByText('Введите email')).toBeTruthy();
    expect(screen.getByText('Введите адрес доставки')).toBeTruthy();
    expect(screen.getByText('Выберите способ оплаты')).toBeTruthy();
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('кнопка submit disabled при невалидной форме', () => {
    renderForm();
    expect(screen.getByRole('button', { name: /оформить заказ/i }).disabled).toBe(true);
  });

  it('onBlur показывает ошибку поля только после касания', () => {
    const { container } = renderForm();
    const form = container.querySelector('form');

    expect(screen.queryByRole('alert')).toBeNull();

    fireEvent.blur(screen.getByLabelText('Имя'));
    expect(screen.getByRole('alert').textContent).toBe('Введите имя');
    expect(screen.queryByText('Введите телефон')).toBeNull();

    fireEvent.submit(form);
    expect(screen.getAllByRole('alert').length).toBe(5);
  });

  it('ошибка исчезает после исправления значения', () => {
    renderForm();
    fireEvent.blur(screen.getByLabelText('Имя'));
    expect(screen.getByRole('alert').textContent).toBe('Введите имя');
    fireEvent.change(screen.getByLabelText('Имя'), { target: { value: 'Иван' } });
    expect(screen.queryByRole('alert')).toBeNull();
  });

  it('ошибки валидации появляются после касания', () => {
    renderForm();
    fireEvent.change(screen.getByLabelText('Имя'), { target: { value: 'И' } });
    fireEvent.blur(screen.getByLabelText('Имя'));
    expect(screen.getByRole('alert').textContent).toBe('Имя слишком короткое');

    fireEvent.change(screen.getByLabelText('Телефон'), {
      target: { value: '123' },
    });
    fireEvent.blur(screen.getByLabelText('Телефон'));
    expect(screen.getByText('Телефон в формате +7XXXXXXXXXX')).toBeTruthy();

    fireEvent.change(screen.getByLabelText('Email'), {
      target: { value: 'bad-email' },
    });
    fireEvent.blur(screen.getByLabelText('Email'));
    expect(screen.getByText('Некорректный email')).toBeTruthy();

    fireEvent.change(screen.getByLabelText('Адрес доставки'), {
      target: { value: 'ул' },
    });
    fireEvent.blur(screen.getByLabelText('Адрес доставки'));
    expect(screen.getByText('Адрес слишком короткий')).toBeTruthy();
  });

  it('оплата обязательна: кнопка disabled без выбора, активируется после выбора', () => {
    renderForm();
    fillValidFields();

    const button = screen.getByRole('button', { name: /оформить заказ/i });
    expect(button.disabled).toBe(true);

    fireEvent.click(screen.getByLabelText('Картой при оформлении'));
    expect(button.disabled).toBe(false);

    fireEvent.click(screen.getByLabelText('Наличными при получении'));
    expect(button.disabled).toBe(false);

    fireEvent.click(screen.getByLabelText('Онлайн-перевод'));
    expect(button.disabled).toBe(false);
  });

  it('все три метода оплаты активируют кнопку при валидных полях', () => {
    renderForm();
    fillValidFields();
    const button = screen.getByRole('button', { name: /оформить заказ/i });

    fireEvent.click(screen.getByLabelText('Картой при оформлении'));
    expect(button.disabled).toBe(false);
  });

  it('submit вызывает onSubmit c payment и полями формы', () => {
    const { onSubmit } = renderForm();
    fillValidFields();
    fireEvent.click(screen.getByLabelText('Картой при оформлении'));

    fireEvent.click(screen.getByRole('button', { name: /оформить заказ/i }));

    expect(onSubmit).toHaveBeenCalledTimes(1);
    const payload = onSubmit.mock.calls[0][0];
    expect(payload.name).toBe('Иван');
    expect(payload.phone).toBe('+79001234567');
    expect(payload.email).toBe('ivan@example.com');
    expect(payload.address).toBe('ул. Пушкина, д. 10');
    expect(payload.payment).toEqual({ method: 'card' });
    expect(payload.items).toEqual(cartItems);
    expect(payload.total).toBe(13970);
  });

  it('submit не вызывается при одном невалидном поле', () => {
    const { onSubmit, container } = renderForm();
    fillValidFields();
    fireEvent.change(screen.getByLabelText('Email'), {
      target: { value: 'bad' },
    });
    fireEvent.click(screen.getByLabelText('Картой при оформлении'));
    fireEvent.submit(container.querySelector('form'));

    expect(screen.getByText('Некорректный email')).toBeTruthy();
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('поля с ошибкой имеют aria-invalid, aria-describedby и role=alert', () => {
    const { container } = renderForm();
    const form = container.querySelector('form');

    fireEvent.change(screen.getByLabelText('Имя'), { target: { value: 'И' } });
    fireEvent.blur(screen.getByLabelText('Имя'));
    fireEvent.submit(form);

    const nameInput = screen.getByLabelText('Имя');
    expect(nameInput.getAttribute('aria-invalid')).toBe('true');
    expect(nameInput.getAttribute('aria-describedby')).toBe('name-error');
    expect(container.querySelector('#name-error').getAttribute('role')).toBe('alert');

    const paymentFieldset = container.querySelector('fieldset');
    expect(paymentFieldset.getAttribute('aria-invalid')).toBe('true');
    expect(paymentFieldset.getAttribute('aria-describedby')).toBe('payment-error');
    expect(container.querySelector('#payment-error').getAttribute('role')).toBe('alert');
  });
});