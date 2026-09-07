import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { PaymentMethodSelect } from '../PaymentMethodSelect.jsx';
import { PAYMENT_METHODS } from '../payment-methods';

describe('PaymentMethodSelect', () => {
  it('рендерит fieldset с legend', () => {
    const { container } = render(
      <PaymentMethodSelect value="" onChange={vi.fn()} />,
    );
    expect(container.querySelector('fieldset')).toBeTruthy();
    expect(screen.getByText('Способ оплаты')).toBeTruthy();
  });

  it('рендерит три радиокнопки', () => {
    render(<PaymentMethodSelect value="" onChange={vi.fn()} />);
    const radios = screen.getAllByRole('radio');
    expect(radios).toHaveLength(3);
  });

  it('ни один radio не выбран по умолчанию (value="")', () => {
    render(<PaymentMethodSelect value="" onChange={vi.fn()} />);
    const radios = screen.getAllByRole('radio');
    radios.forEach((radio) => {
      expect(radio.checked).toBe(false);
    });
  });

  it('подсвечивает выбранный radio при заданном value', () => {
    render(<PaymentMethodSelect value="card" onChange={vi.fn()} />);
    const radios = screen.getAllByRole('radio');
    expect(radios[0].checked).toBe(true);
    expect(radios[1].checked).toBe(false);
    expect(radios[2].checked).toBe(false);
  });

  it('вызывает onChange с кодом метода при выборе', () => {
    const onChange = vi.fn();
    render(<PaymentMethodSelect value="" onChange={onChange} />);
    const radios = screen.getAllByRole('radio');
    fireEvent.click(radios[1]);
    expect(onChange).toHaveBeenCalledWith('cod');
  });

  it('показывает ошибку если touched и есть error', () => {
    render(
      <PaymentMethodSelect
        value=""
        onChange={vi.fn()}
        error="Выберите способ оплаты"
        touched
      />,
    );
    const alert = screen.getByRole('alert');
    expect(alert.textContent).toBe('Выберите способ оплаты');
  });

  it('не показывает ошибку если не touched', () => {
    render(
      <PaymentMethodSelect
        value=""
        onChange={vi.fn()}
        error="Выберите способ оплаты"
      />,
    );
    expect(screen.queryByRole('alert')).toBeNull();
  });

  it('ставит aria-invalid и aria-describedby на fieldset при ошибке', () => {
    const { container } = render(
      <PaymentMethodSelect
        value=""
        onChange={vi.fn()}
        error="Выберите способ оплаты"
        touched
      />,
    );
    const fieldset = container.querySelector('fieldset');
    expect(fieldset.getAttribute('aria-invalid')).toBe('true');
    expect(fieldset.getAttribute('aria-describedby')).toBe('payment-error');
    expect(container.querySelector('#payment-error')).toBeTruthy();
  });

  it('не ставит aria-invalid на fieldset без ошибки', () => {
    const { container } = render(
      <PaymentMethodSelect value="" onChange={vi.fn()} />,
    );
    const fieldset = container.querySelector('fieldset');
    expect(fieldset.getAttribute('aria-invalid')).toBeNull();
    expect(fieldset.getAttribute('aria-describedby')).toBeNull();
  });

  it('рендерит методы в маппинге PAYMENT_METHODS с названиями', () => {
    render(<PaymentMethodSelect value="" onChange={vi.fn()} />);
    PAYMENT_METHODS.forEach((method) => {
      expect(screen.getByText(method.label)).toBeTruthy();
    });
  });
});
