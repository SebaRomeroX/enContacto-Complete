import { describe, it, expect, vi } from 'vitest'
import apiClient from '../apiClient'
import { getSalas, postSalas, deleteSalas } from '../salas'

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
    await postSalas(payload as any)
    expect(spy).toHaveBeenCalledWith('/salas', payload)
  })

  it('deleteSalas hace DELETE a /salas/:id', () => {
    const spy = vi.spyOn(apiClient, 'delete')
    deleteSalas('xyz-789')
    expect(spy).toHaveBeenCalledWith('/salas/xyz-789')
  })
})
