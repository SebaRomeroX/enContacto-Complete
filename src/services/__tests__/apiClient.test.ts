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

  describe('instancia axios', () => {
    it('tiene baseURL correcta', () => {
      expect(apiClient.defaults.baseURL).toContain('en-contacto-api')
    })
  })

  describe('interceptor de request (token)', () => {
    it('agrega Authorization header cuando hay token', () => {
      localStorage.setItem('token', 'test-token')

      const mockAdapter = vi.fn().mockResolvedValue({ data: [], status: 200 })
      apiClient.defaults.adapter = mockAdapter

      return apiClient.get('/test').finally(() => {
        const config = mockAdapter.mock.calls[0][0]
        expect(config.headers?.Authorization).toBe('Bearer test-token')
      })
    })

    it('no agrega header cuando no hay token', () => {
      const mockAdapter = vi.fn().mockResolvedValue({ data: [], status: 200 })
      apiClient.defaults.adapter = mockAdapter

      return apiClient.get('/test').finally(() => {
        const config = mockAdapter.mock.calls[0][0]
        expect(config.headers?.Authorization).toBeUndefined()
      })
    })
  })

  describe('interceptor de response (401 redirect)', () => {
    it('pasa respuestas exitosas sin cambios', async () => {
      const response = { data: 'ok', status: 200 }
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

      try {
        await apiClient.get('/test')
      } catch {}

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

      try {
        await apiClient.get('/test')
      } catch {}

      expect(window.location.href).not.toContain('/login')
    })

    it('rechaza errores no-401 sin limpiar localStorage', async () => {
      localStorage.setItem('token', 'x')

      apiClient.defaults.adapter = vi.fn().mockRejectedValue({
        response: { status: 500 },
      })

      try {
        await apiClient.get('/test')
      } catch {}

      expect(localStorage.getItem('token')).toBe('x')
    })
  })

  describe('createService', () => {
    beforeEach(() => {
      apiClient.defaults.adapter = vi.fn().mockResolvedValue({})
    })

    it('retorna objeto con getAll, create, delete', () => {
      const service = createService('/test')
      expect(service).toHaveProperty('getAll')
      expect(service).toHaveProperty('create')
      expect(service).toHaveProperty('delete')
    })

    it('getAll llama a apiClient.get con el endpoint', () => {
      const spy = vi.spyOn(apiClient, 'get')
      const service = createService('/items')
      service.getAll()
      expect(spy).toHaveBeenCalledWith('/items')
    })

    it('getAll retorna los datos de la respuesta', async () => {
      const items = [{ id: 1 }]
      apiClient.defaults.adapter = vi.fn().mockResolvedValue({ data: items })
      const service = createService('')

      const result = await service.getAll()

      expect(result).toEqual(items)
    })

    it('create llama a apiClient.post con endpoint y datos', () => {
      const spy = vi.spyOn(apiClient, 'post')
      const service = createService('/items')
      service.create({ name: 'test' })
      expect(spy).toHaveBeenCalledWith('/items', { name: 'test' })
    })

    it('create retorna los datos de la respuesta', async () => {
      const data = { name: 'test' }
      apiClient.defaults.adapter = vi.fn().mockResolvedValue({ data })
      const service = createService('')

      const result = await service.create(data)

      expect(result).toEqual(data)
    })

    it('delete llama a apiClient.delete con endpoint/id', () => {
      const spy = vi.spyOn(apiClient, 'delete')
      const service = createService('/items')
      service.delete('123')
      expect(spy).toHaveBeenCalledWith('/items/123')
    })
  })
})
