import { test, expect } from '@playwright/test'
import { setupAuthRoutes, loginAsAdmin, loginAsUser } from './helpers'

test.describe('Admin', () => {
  test.beforeEach(async ({ page }) => {
    await setupAuthRoutes(page)
  })

  test('acceso permitido: login admin -> /admin -> panel visible', async ({ page }) => {
    await loginAsAdmin(page)

    await page.goto('/admin')
    await page.waitForLoadState('networkidle')

    await expect(page.locator('.header')).toContainText('enContacto')
    await expect(page.locator('.header')).toContainText('Volver a salas')
    await expect(page.locator('.admin-page')).toContainText('Usuarios')
    await expect(page.locator('.admin-page')).toContainText('Salas')
    await expect(page.locator('.admin-page')).toContainText('Nuevo Usuario')
    await expect(page.locator('.admin-page')).toContainText('Nueva Sala')
    await expect(page.locator('.admin-page')).toContainText('Juan')
    await expect(page.locator('.admin-page')).toContainText('General')
    await expect(page.locator('.admin-page')).toContainText('Random')
  })

  test('crear usuario: /admin -> crear -> aparece en lista -> eliminar -> desaparece', async ({ page }) => {
    await loginAsAdmin(page)

    await page.goto('/admin')
    await page.waitForLoadState('networkidle')

    const formUsuario = page.locator('form.formulario').filter({ hasText: 'Nuevo Usuario' })
    await formUsuario.locator('input').fill('NuevoUser')
    await formUsuario.getByRole('button', { name: 'Crear' }).click()
    await page.waitForLoadState('networkidle')

    await expect(page.locator('.admin-page')).toContainText('NuevoUser')

    await page.locator('.ficha').filter({ hasText: 'NuevoUser' }).getByRole('button', { name: 'Eliminar' }).click()
    await page.waitForLoadState('networkidle')
    await expect(page.locator('.admin-page')).not.toContainText('NuevoUser')
  })

  test('crear sala: /admin -> crear sala -> aparece en admin y sidebar -> eliminar sala -> desaparece de admin y chat', async ({ page }) => {
    await loginAsAdmin(page)
    await page.goto('/admin')
    await page.waitForLoadState('networkidle')

    const formSala = page.locator('form.formulario').filter({ hasText: 'Nueva Sala' })
    await formSala.locator('input').fill('NuevaSala')
    await formSala.getByRole('button', { name: 'Crear' }).click()
    await page.waitForLoadState('networkidle')

    await expect(page.locator('.admin-page')).toContainText('NuevaSala')
    await page.goto('/')
    await page.waitForLoadState('networkidle')
    await expect(page.locator('.lista-salas-section')).toContainText('NuevaSala')

    await page.goto('/admin')
    await page.waitForLoadState('networkidle')

    await page.locator('.ficha').filter({ hasText: 'NuevaSala' }).getByRole('button', { name: 'Eliminar' }).click()
    await page.waitForLoadState('networkidle')
    await expect(page.locator('.admin-page')).not.toContainText('NuevaSala')

    await page.goto('/')
    await page.waitForLoadState('networkidle')
    await expect(page.locator('.lista-salas-section')).not.toContainText('NuevaSala')
  })
})
