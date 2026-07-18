import { describe, it, expect, vi } from 'vitest'
import apiClient from '../apiClient'
import { getUsuarios, postUsuarios, deleteUsuario } from '../usuarios'

describe('usuarios service', () => {
  it('getUsuarios hace GET a /usuarios', async () => {
    const spy = vi.spyOn(apiClient, 'get')
    apiClient.defaults.adapter = vi.fn().mockResolvedValue({})
    await getUsuarios()
    expect(spy).toHaveBeenCalledWith('/usuarios')
  })

  it('postUsuarios hace POST a /usuarios con los datos', async () => {
    const spy = vi.spyOn(apiClient, 'post')
    const payload = { nombre: 'test'}
    apiClient.defaults.adapter = vi.fn().mockResolvedValue({ data: payload })
    await postUsuarios(payload as any)
    expect(spy).toHaveBeenCalledWith('/usuarios', payload)
  })

  it('deleteUsuario hace DELETE a /usuarios/:id', () => {
    const spy = vi.spyOn(apiClient, 'delete')
    deleteUsuario('abc-123')
    expect(spy).toHaveBeenCalledWith('/usuarios/abc-123')
  })
})
