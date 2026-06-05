import { expect, test } from '@playwright/test'

test('renders home page', async ({ page }) => {
  await page.goto('/')

  await expect(page).toHaveTitle(/monorepo-template|TanStack/i)
})
