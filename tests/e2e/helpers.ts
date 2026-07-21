import type { Page } from '@playwright/test'

export const API_BASE = 'https://en-contacto-api.vercel.app/api'

export const listaUsuarios = [
  { id: '1', nombre: 'Admin', foto: 'admin.jpg', contra: '777', rol: 'admin', token: 'tok-admin' },
  { id: '2', nombre: 'Juan', foto: 'juan.jpg', contra: '123', rol: 'user', token: 'tok-juan' },
]

export const salasMock = [
  { id: 's1', nombre: 'General' },
  { id: 's2', nombre: 'Random' },
]

export const mensajesMock = [
  { id: 'm1', mensaje: 'hola', usuarioId: '1', salaId: 's1' },
  { id: 'm2', mensaje: 'chau', usuarioId: '2', salaId: 's1' },
  { id: 'm3', mensaje: 'ya me fui', usuarioId: '999', salaId: 's1' },
]

export async function setupAuthRoutes(page: Page) {
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
    if (route.request().method() === 'POST') {
      const body = route.request().postDataJSON()
      const saved = { id: `m${Date.now()}`, ...body }
      await route.fulfill({ status: 201, contentType: 'application/json', body: JSON.stringify(saved) })
    } else {
      await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(mensajesMock) })
    }
  })
}

export async function loginAsAdmin(page: Page) {
  await page.goto('/login')
  await page.waitForLoadState('networkidle')

  await page.getByPlaceholder('usuario').fill('Admin')
  await page.getByPlaceholder('contraseña').fill('777')
  await page.getByRole('button', { name: 'Entrar' }).click()

  await page.waitForURL('/')
  await page.waitForLoadState('networkidle')
}
