import { describe, it, expect, vi, beforeEach } from 'vitest'
import apiClient from '../apiClient'
import loginService from '../login'

describe('login', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('hace POST a /login, guarda token y user, y retorna los datos', async () => {
    const data = { token: 'abc-123' }
    const spy = vi.spyOn(apiClient, 'post')
    apiClient.defaults.adapter = vi.fn().mockResolvedValue({ data })

    const result = await loginService.login({ nombre: 'admin', contra: '777' })

    expect(spy).toHaveBeenCalledWith('/login', { nombre: 'admin', contra: '777' })
    expect(localStorage.getItem('token')).toBe('abc-123')
    expect(JSON.parse(localStorage.getItem('user')!)).toEqual(data)
    expect(result).toEqual(data)
  })

  it('rechaza con el error del servidor cuando las credenciales son incorrectas', async () => {
  apiClient.defaults.adapter = vi.fn().mockRejectedValue({
    response: { status: 401},
  })

  await expect(
    loginService.login({ nombre: '', contra: '' })
  ).rejects.toMatchObject({
    response: { status: 401 },
  })

  expect(localStorage.getItem('token')).toBeNull()
})
})
