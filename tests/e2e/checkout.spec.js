import { test, expect } from '@playwright/test';

test.describe('Оформление заказа', () => {
  test('полный флоу: добавить товар, заполнить форму, выбрать оплату, увидеть подтверждение', async ({ page }) => {
    await page.goto('/');

    const firstCard = page.getByRole('article').first();
    const itemName = await firstCard.getByRole('heading').textContent();
    await firstCard.getByRole('button', { name: /в корзину/i }).click();

    await page.getByRole('link', { name: /корзина/i }).click();
    await page.getByRole('link', { name: /оформить заказ/i }).click();

    await expect(page).toHaveURL(/\/checkout/);
    await expect(page.getByRole('heading', { name: /оформление заказа/i })).toBeVisible();

    const formTotal = await page.getByText(/^Итого:/).textContent();

    await page.getByLabel('Имя').fill('Иван');
    await page.getByLabel('Телефон').fill('+79001234567');
    await page.getByLabel('Email').fill('ivan@example.com');
    await page.getByLabel('Адрес доставки').fill('ул. Пушкина, д. 10');
    await page.getByLabel('Картой при оформлении').check();

    await page.getByRole('button', { name: /оформить заказ/i }).click();

    await expect(page.getByRole('heading', { name: 'Заказ оформлен' })).toBeVisible();

    await expect(page.getByText('Состав заказа')).toBeVisible();
    await expect(page.getByText(itemName.trim())).toBeVisible();
    await expect(page.getByText('Картой при оформлении')).toBeVisible();
    await expect(page.getByText('Иван')).toBeVisible();

    const confirmationTotal = await page.getByText(/^Итого:/).textContent();
    expect(confirmationTotal).toBe(formTotal);

    await page.getByRole('link', { name: /корзина/i }).click();
    await expect(page.getByText(/корзина пуста/i)).toBeVisible();
  });
});
