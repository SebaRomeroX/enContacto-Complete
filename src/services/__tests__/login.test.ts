import { describe, it, expect, vi, beforeEach } from 'vitest'
import apiClient from '../apiClient'
import loginService from '../login'

describe('login', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('envía POST a /login con las credentials', async () => {
    const spy = vi.spyOn(apiClient, 'post')
    apiClient.defaults.adapter = vi.fn().mockResolvedValue({
      data: { token: 'abc', nombre: 'test', rol: 'user' },
    })

    await loginService.login({ nombre: 'admin', contra: '777' })

    expect(spy).toHaveBeenCalledWith('/login', { nombre: 'admin', contra: '777' })
  })

  it('almacena token en localStorage', async () => {
    apiClient.defaults.adapter = vi.fn().mockResolvedValue({
      data: { token: 'token123', nombre: 'test', rol: 'user' },
    })

    await loginService.login({ nombre: 'admin', contra: '777' })

    expect(localStorage.getItem('token')).toBe('token123')
  })

  it('almacena user (JSON.stringify) en localStorage', async () => {
    const data = { token: 'abc', nombre: 'test', rol: 'user' }
    apiClient.defaults.adapter = vi.fn().mockResolvedValue({ data })

    await loginService.login({ nombre: 'admin', contra: '777' })

    expect(localStorage.getItem('user')).toBe(JSON.stringify(data))
  })

  it('retorna los datos de la respuesta', async () => {
    const data = { token: 'abc', nombre: 'test', rol: 'user' }
    apiClient.defaults.adapter = vi.fn().mockResolvedValue({ data })

    const result = await loginService.login({ nombre: 'admin', contra: '777' })

    expect(result).toEqual(data)
  })

  it('rechaza la promesa y no almacena nada si las credenciales son incorrectas', async () => {
    apiClient.defaults.adapter = vi.fn().mockRejectedValue({
      response: { status: 401, data: { error: 'Credenciales inválidas' } },
    })

    await expect(
      loginService.login({ nombre: 'admin', contra: 'wrong' })
    ).rejects.toThrow()

    expect(localStorage.getItem('token')).toBeNull()
    expect(localStorage.getItem('user')).toBeNull()
  })
})
