import { expect, test } from '@playwright/test'

test('renders users page with user cards', async ({ page }) => {
  await page.route('**/api/users', (route) =>
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify([
        {
          id: '550e8400-e29b-41d4-a716-446655440000',
          email: 'alice@example.com',
          name: 'Alice',
          createdAt: '2024-01-01T00:00:00.000Z',
          updatedAt: '2024-01-01T00:00:00.000Z',
        },
        {
          id: '550e8400-e29b-41d4-a716-446655440001',
          email: 'bob@example.com',
          name: 'Bob',
          createdAt: '2024-01-01T00:00:00.000Z',
          updatedAt: '2024-01-01T00:00:00.000Z',
        },
      ]),
    }),
  )

  await page.goto('/users')

  await expect(page.getByText('Alice', { exact: true })).toBeVisible()
  await expect(page.getByText('alice@example.com')).toBeVisible()
  await expect(page.getByText('Bob', { exact: true })).toBeVisible()
})
