import { test, expect } from '@playwright/test'
import { API_BASE } from './helpers'

test.describe('Sin token redirige', () => {
  test.beforeEach(async ({ page }) => {
    await page.route(`${API_BASE}/**`, async route => {
      await route.fulfill({ status: 200, contentType: 'application/json', body: '[]' })
    })

    await page.goto('/login')
    await page.waitForLoadState('networkidle')
    await page.evaluate(() => localStorage.clear())
  })

  test('navegar a / sin token -> redirige a /login', async ({ page }) => {
    await page.goto('/')
    await page.waitForURL('/login')
    await page.waitForLoadState('networkidle')

    await expect(page).toHaveURL('/login')
    await expect(page.getByRole('heading', { name: 'Inicio de Sesion' })).toBeVisible()
  })

  test('navegar a /admin sin token -> redirige a /login', async ({ page }) => {
    await page.goto('/admin')
    await page.waitForURL('/login')
    await page.waitForLoadState('networkidle')

    await expect(page).toHaveURL('/login')
    await expect(page.getByRole('heading', { name: 'Inicio de Sesion' })).toBeVisible()
  })
})
