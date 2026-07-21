import { test, expect } from '@playwright/test'
import { API_BASE, setupAuthRoutes, loginAsAdmin } from './helpers'

test.describe('Chat', () => {
  test.beforeEach(async ({ page }) => {
    await setupAuthRoutes(page)
    await loginAsAdmin(page)
  })

  test('seleccionar sala -> ver mensajes (user eliminado) -> escribir -> enviar -> mensaje aparece', async ({ page }) => {
    await page.locator('.lista-salas-section h3', { hasText: 'General' }).click()
    await page.waitForLoadState('networkidle')

    await expect(page.locator('.sala h2')).toHaveText('General')
    await expect(page.locator('.sala .chat-section')).toContainText('hola')
    await expect(page.locator('.sala .chat-section')).toContainText('chau')

    await expect(page.locator('.sala .chat-section')).toContainText('ya me fui')
    await expect(page.locator('.sala .chat-section')).toContainText('eliminado')

    await page.getByPlaceholder('Escribe aqui ...').fill('hola mundo')
    await page.getByRole('button', { name: 'Enviar mensaje' }).click()
    await page.waitForLoadState('networkidle')

    await expect(page.locator('.sala .chat-section')).toContainText('hola mundo')
  })

  test('Error de red: al enviar mensaje sin conexion -> feedback visual', async ({ page }) => {
    await page.locator('.lista-salas-section h3', { hasText: 'General' }).click()
    await page.waitForLoadState('networkidle')

    await page.route(`${API_BASE}/mensajes`, async route => {
      if (route.request().method() === 'POST') {
        await route.abort('internetdisconnected')
      } else {
        await route.fallback()
      }
    })

    await page.getByPlaceholder('Escribe aqui ...').fill('mensaje sin conexion')
    await page.getByRole('button', { name: 'Enviar mensaje' }).click()

    await expect(page.locator('.caja-mensaje .error-msg')).toHaveText('Error al enviar el mensaje')
  })
})
