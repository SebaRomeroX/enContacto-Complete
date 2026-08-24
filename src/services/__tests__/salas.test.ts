import { describe, it, expect, vi } from 'vitest'
import apiClient from '../apiClient'
import { getSalas, postSalas, deleteSalas, agregarMiembros, quitarMiembro } from '../salas'

describe('salas service', () => {
  it('getSalas hace GET a /salas', async () => {
    const spy = vi.spyOn(apiClient, 'get')
    apiClient.defaults.adapter = vi.fn().mockResolvedValue({})
    await getSalas()
    expect(spy).toHaveBeenCalledWith('/salas')
  })

  it('postSalas hace POST a /salas con los datos', async () => {
    const spy = vi.spyOn(apiClient, 'post')
    const payload = { nombre: 'sala-test' }
    apiClient.defaults.adapter = vi.fn().mockResolvedValue({ data: payload })
    await postSalas(payload)
    expect(spy).toHaveBeenCalledWith('/salas', payload)
  })

  it('deleteSalas hace DELETE a /salas/:id', () => {
    const spy = vi.spyOn(apiClient, 'delete')
    deleteSalas('xyz-789')
    expect(spy).toHaveBeenCalledWith('/salas/xyz-789')
  })

  it('agregarMiembros hace POST a /salas/:id/miembros con usuarioIds', async () => {
    const spy = vi.spyOn(apiClient, 'post')
    const sala = { id: 's1', nombre: 'General', listaMiembros: ['u1'] }
    apiClient.defaults.adapter = vi.fn().mockResolvedValue({ data: sala })
    const res = await agregarMiembros('s1', ['u1'])
    expect(spy).toHaveBeenCalledWith('/salas/s1/miembros', { usuarioIds: ['u1'] })
    expect(res).toEqual(sala)
  })

  it('quitarMiembro hace DELETE a /salas/:id/miembros/:usuarioId y devuelve la sala', async () => {
    const spy = vi.spyOn(apiClient, 'delete')
    const sala = { id: 's1', nombre: 'General', listaMiembros: [] }
    apiClient.defaults.adapter = vi.fn().mockResolvedValue({ data: sala })
    const res = await quitarMiembro('s1', 'u1')
    expect(spy).toHaveBeenCalledWith('/salas/s1/miembros/u1')
    expect(res).toEqual(sala)
  })
})
