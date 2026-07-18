import { describe, it, expect, vi } from 'vitest'
import apiClient from '../apiClient'
import { getMensajes, postMensaje, deleteMensaje } from '../mensajes'

describe('mensajes service', () => {
  it('getMensajes hace GET a /mensajes', async () => {
    const spy = vi.spyOn(apiClient, 'get')
    apiClient.defaults.adapter = vi.fn().mockResolvedValue({})
    await getMensajes()
    expect(spy).toHaveBeenCalledWith('/mensajes')
  })

  it('postMensaje hace POST a /mensajes con los datos', async () => {
    const spy = vi.spyOn(apiClient, 'post')
    const payload = { texto: 'hola', idUser: '1', idSala: '1' }
    apiClient.defaults.adapter = vi.fn().mockResolvedValue({ data: payload })
    await postMensaje(payload as any)
    expect(spy).toHaveBeenCalledWith('/mensajes', payload)
  })

  it('deleteMensaje hace DELETE a /mensajes/:id', () => {
    const spy = vi.spyOn(apiClient, 'delete')
    deleteMensaje('msg-456')
    expect(spy).toHaveBeenCalledWith('/mensajes/msg-456')
  })
})
