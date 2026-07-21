import { test, expect } from '@playwright/test'
import { API_BASE, setupAuthRoutes } from './helpers'

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

test.describe('Sesión expirada (401)', () => {
  test.beforeEach(async ({ page }) => {
    await setupAuthRoutes(page)
  })

  test('durante uso activo -> redirige a /login y limpia localStorage', async ({ page }) => {
    await page.goto('/login')
    await page.waitForLoadState('networkidle')

    await page.getByPlaceholder('usuario').fill('Admin')
    await page.getByPlaceholder('contraseña').fill('777')
    await page.getByRole('button', { name: 'Entrar' }).click()

    await page.waitForURL('/')
    await page.waitForLoadState('networkidle')

    await expect(page.locator('.header')).toContainText('enContacto')

    await page.locator('.lista-salas-section h3', { hasText: 'General' }).click()
    await page.waitForLoadState('networkidle')

    await page.route(`${API_BASE}/mensajes`, async route => {
      await route.fulfill({ status: 401 })
    })

    await page.waitForURL('/login', { timeout: 10000 })

    const token = await page.evaluate(() => localStorage.getItem('token'))
    expect(token).toBeNull()
  })
})
