import { test, expect } from '@playwright/test'
import { setupAuthRoutes, loginAsAdmin } from './helpers'

test.describe('E2E', () => {
  test.beforeEach(async ({ page }) => {
    await setupAuthRoutes(page)
  })

  test('Login fallido: /login -> credenciales incorrectas -> mensaje error', async ({ page }) => {
    await page.goto('/login')
    await page.waitForLoadState('networkidle')

    await page.getByPlaceholder('usuario').fill('Admin')
    await page.getByPlaceholder('contraseña').fill('wrong')
    await page.getByRole('button', { name: 'Entrar' }).click()

    await expect(page.getByText('Los datos no coinciden con ningun perfil')).toBeVisible()
    await expect(page).toHaveURL('/login')
  })

  test('Login -> redirige a /chat con salas visibles -> persistencia de sesion -> logout', async ({ page }) => {
    await page.goto('/login')
    await page.waitForLoadState('networkidle')

    await expect(page.getByRole('heading', { name: 'enContacto' })).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Inicio de Sesion' })).toBeVisible()

    await page.getByPlaceholder('usuario').fill('Admin')
    await page.getByPlaceholder('contraseña').fill('777')
    await page.getByRole('button', { name: 'Entrar' }).click()

    await page.waitForURL('/')
    await page.waitForLoadState('networkidle')

    await expect(page.locator('.header')).toContainText('enContacto')
    await expect(page.locator('.lista-salas-section')).toContainText('Salas')
    await expect(page.locator('.lista-salas-section')).toContainText('General')
    await expect(page.locator('.lista-salas-section')).toContainText('Random')

    await page.reload()
    await page.waitForLoadState('networkidle')

    await expect(page).toHaveURL('/')
    await expect(page.locator('.lista-salas-section')).toContainText('General')
    await expect(page.locator('.header')).toContainText('enContacto')

    await page.getByRole('link', { name: 'Salir' }).click()
    await page.waitForURL('/login')

    const token = await page.evaluate(() => localStorage.getItem('token'))
    const user = await page.evaluate(() => localStorage.getItem('user'))
    expect(token).toBeNull()
    expect(user).toBeNull()
  })
})
