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
  const usuarios = [...listaUsuarios]
  const salas = [...salasMock]
  const mensajes = [...mensajesMock]

  await page.route(`${API_BASE}/login`, async route => {
    const body = route.request().postDataJSON()
    if (body.nombre === 'Admin' && body.contra === '777') {
      await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(listaUsuarios[0]) })
    } else if (body.nombre === 'Juan' && body.contra === '123') {
      await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(listaUsuarios[1]) })
    } else {
      await route.fulfill({ status: 401, contentType: 'application/json', body: JSON.stringify({ error: 'Credenciales inválidas' }) })
    }
  })

  await page.route(`${API_BASE}/usuarios`, async route => {
    if (route.request().method() === 'POST') {
      const body = route.request().postDataJSON()
      const saved = { id: `u${Date.now()}`, ...body }
      usuarios.push(saved)
      await route.fulfill({ status: 201, contentType: 'application/json', body: JSON.stringify(saved) })
    } else {
      await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(usuarios) })
    }
  })

  await page.route(`${API_BASE}/usuarios/*`, async route => {
    const id = route.request().url().split('/').pop()!
    const idx = usuarios.findIndex(u => u.id === id)
    if (idx !== -1) usuarios.splice(idx, 1)
    await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ success: true }) })
  })

  await page.route(`${API_BASE}/salas`, async route => {
    if (route.request().method() === 'POST') {
      const body = route.request().postDataJSON()
      const saved = { id: `s${Date.now()}`, ...body }
      salas.push(saved)
      await route.fulfill({ status: 201, contentType: 'application/json', body: JSON.stringify(saved) })
    } else {
      await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(salas) })
    }
  })

  await page.route(`${API_BASE}/salas/*`, async route => {
    const id = route.request().url().split('/').pop()!
    const idx = salas.findIndex(s => s.id === id)
    if (idx !== -1) salas.splice(idx, 1)
    await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ success: true }) })
  })

  await page.route(`${API_BASE}/mensajes`, async route => {
    if (route.request().method() === 'POST') {
      const body = route.request().postDataJSON()
      const saved = { id: `m${Date.now()}`, ...body }
      mensajes.push(saved)
      await route.fulfill({ status: 201, contentType: 'application/json', body: JSON.stringify(saved) })
    } else {
      await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(mensajes) })
    }
  })

  await page.route(`${API_BASE}/mensajes/*`, async route => {
    const id = route.request().url().split('/').pop()!
    const idx = mensajes.findIndex(m => m.id === id)
    if (idx !== -1) mensajes.splice(idx, 1)
    await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ success: true }) })
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

export async function loginAsUser(page: Page) {
  await page.goto('/login')
  await page.waitForLoadState('networkidle')

  await page.getByPlaceholder('usuario').fill('Juan')
  await page.getByPlaceholder('contraseña').fill('123')
  await page.getByRole('button', { name: 'Entrar' }).click()

  await page.waitForURL('/')
  await page.waitForLoadState('networkidle')
}
