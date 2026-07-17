import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import apiClient, { createService } from '../apiClient'

describe('apiClient', () => {
  const originalLocation = window.location

  beforeEach(() => {
    localStorage.clear()
    Object.defineProperty(window, 'location', {
      value: { href: '', pathname: '/', origin: 'http://localhost' },
      writable: true,
      configurable: true,
    })
  })

  afterEach(() => {
    Object.defineProperty(window, 'location', {
      value: originalLocation,
      writable: true,
      configurable: true,
    })
  })

  it('tiene baseURL correcta', () => {
    expect(apiClient.defaults.baseURL).toContain('en-contacto-api')
  })

  describe('interceptor de request (token)', () => {
    it.each([
      ['agrega Authorization header cuando hay token', 'test-token', 'Bearer test-token'],
      ['no agrega header cuando no hay token', null, undefined],
    ])('%s', async (_, token, expected) => {
      if (token) localStorage.setItem('token', token)
      const adapter = vi.fn().mockResolvedValue({ data: [], status: 200 })
      apiClient.defaults.adapter = adapter
      await apiClient.get('/test')
      expect(adapter.mock.calls[0][0].headers?.Authorization).toBe(expected)
    })
  })

  describe('interceptor de response (401 redirect)', () => {
    it('pasa respuestas exitosas sin cambios', async () => {
      const response = {}
      apiClient.defaults.adapter = vi.fn().mockResolvedValue(response)
      const result = await apiClient.get('/test')
      expect(result).toEqual(response)
    })

    it('limpia localStorage y redirige en 401 fuera de /login', async () => {
      localStorage.setItem('token', 'x')
      localStorage.setItem('user', 'x')
      localStorage.setItem('idUser', 'x')
      apiClient.defaults.adapter = vi.fn().mockRejectedValue({
        response: { status: 401 },
      })
      try { await apiClient.get('/test') } catch {}
      expect(localStorage.getItem('token')).toBeNull()
      expect(localStorage.getItem('user')).toBeNull()
      expect(localStorage.getItem('idUser')).toBeNull()
      expect(window.location.href).toContain('/login')
    })

    it('no redirige en 401 cuando está en /login', async () => {
      window.location.pathname = '/login'
      apiClient.defaults.adapter = vi.fn().mockRejectedValue({
        response: { status: 401 },
      })
      try { await apiClient.get('/test') } catch {}
      expect(window.location.href).not.toContain('/login')
    })
  })

  describe('createService', () => {
    it('getAll hace GET al endpoint y retorna los datos', async () => {
      const items = [{ id: 1 }]
      apiClient.defaults.adapter = vi.fn().mockResolvedValue({ data: items })
      const spy = vi.spyOn(apiClient, 'get')
      const service = createService('/items')
      const result = await service.getAll()
      expect(spy).toHaveBeenCalledWith('/items')
      expect(result).toEqual(items)
    })

    it('create hace POST al endpoint con datos y los retorna', async () => {
      const data = { name: 'test' }
      apiClient.defaults.adapter = vi.fn().mockResolvedValue({ data })
      const spy = vi.spyOn(apiClient, 'post')
      const service = createService('/items')
      const result = await service.create(data)
      expect(spy).toHaveBeenCalledWith('/items', data)
      expect(result).toEqual(data)
    })

    it('delete hace DELETE al endpoint con el id', () => {
      const spy = vi.spyOn(apiClient, 'delete')
      const service = createService('/items')
      service.delete('123')
      expect(spy).toHaveBeenCalledWith('/items/123')
    })
  })
})
