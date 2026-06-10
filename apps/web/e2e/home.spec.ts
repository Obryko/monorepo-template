import { expect, test } from '@playwright/test'

test('renders home page', async ({ page }) => {
  await page.goto('/')

  await expect(page).toHaveTitle(/monorepo-template|TanStack/i)
})

test('renders MF remote component', async ({ page }) => {
  await page.goto('/')

  // Wait for client hydration — ClientOnly defers MF loading
  await expect(page.getByText('Hello from remote', { exact: false })).toBeVisible({
    timeout: 10_000,
  })
})

test('shows error boundary when remote is unavailable', async ({ page }) => {
  // Intercept only the remote's remoteEntry.js (not the shell's) to simulate remote being down
  await page.route(/127\.0\.0\.1:3002\/remoteEntry\.js|localhost:3002\/remoteEntry\.js/, (route) =>
    route.abort(),
  )

  await page.goto('/')

  await expect(page.getByText('Remote unavailable')).toBeVisible({ timeout: 10_000 })
})
