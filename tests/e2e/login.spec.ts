import { test, expect } from '@playwright/test'

const API_BASE = 'https://en-contacto-api.vercel.app/api'

const listaUsuarios = [
  { id: '1', nombre: 'Admin', foto: 'admin.jpg', contra: '777', rol: 'admin' },
  { id: '2', nombre: 'Juan', foto: 'juan.jpg', contra: '123', rol: 'user' },
]

const salasMock = [
  { id: 's1', nombre: 'General' },
  { id: 's2', nombre: 'Random' },
]

const mensajesMock = [
  { id: 'm1', mensaje: 'hola', usuarioId: '1', salaId: 's1' },
  { id: 'm2', mensaje: 'chau', usuarioId: '2', salaId: 's1' },
]

test.describe('E2E', () => {
  test.beforeEach(async ({ page }) => {
    await page.route(`${API_BASE}/login`, async route => {
      const body = route.request().postDataJSON()
      if (body.nombre === 'Admin' && body.contra === '777') {
        await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(listaUsuarios[0]) })
      } else {
        await route.fulfill({ status: 401, contentType: 'application/json', body: JSON.stringify({ error: 'Credenciales inválidas' }) })
      }
    })

    await page.route(`${API_BASE}/usuarios`, async route => {
      await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(listaUsuarios) })
    })

    await page.route(`${API_BASE}/salas`, async route => {
      await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(salasMock) })
    })

    await page.route(`${API_BASE}/mensajes`, async route => {
      await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(mensajesMock) })
    })
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

  test('Login -> redirige a /chat con salas visibles -> logout', async ({ page }) => {
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

    await page.getByRole('link', { name: 'Salir' }).click()
    await page.waitForURL('/login')

    const token = await page.evaluate(() => localStorage.getItem('token'))
    const user = await page.evaluate(() => localStorage.getItem('user'))
    expect(token).toBeNull()
    expect(user).toBeNull()
  })
})
