import { describe, it, expect, vi } from 'vitest'
import apiClient from '../apiClient'
import { getMensajes, postMensaje, deleteMensaje } from '../mensajes'
import type { MensajeType } from '../../types/types'

describe('mensajes service', () => {
  it('getMensajes hace GET a /mensajes con los params', async () => {
    const spy = vi.spyOn(apiClient, 'get')
    apiClient.defaults.adapter = vi.fn().mockResolvedValue({ data: [], headers: {} })
    await getMensajes({ salaId: 's1', limit: 50, offset: 0 })
    expect(spy).toHaveBeenCalledWith('/mensajes', { params: { salaId: 's1', limit: 50, offset: 0 } })
  })

  it('getMensajes lee el total de X-Total-Count', async () => {
    apiClient.defaults.adapter = vi.fn().mockResolvedValue({
      data: [{ id: 'm1' }],
      headers: { 'x-total-count': '120' },
    })
    const res = await getMensajes({ salaId: 's1', limit: 50 })
    expect(res.mensajes).toEqual([{ id: 'm1' }])
    expect(res.total).toBe(120)
  })

  it('getMensajes usa el largo de la data si no hay X-Total-Count', async () => {
    apiClient.defaults.adapter = vi.fn().mockResolvedValue({
      data: [{ id: 'm1' }, { id: 'm2' }],
      headers: {},
    })
    const res = await getMensajes()
    expect(res.total).toBe(2)
  })

  it('postMensaje hace POST a /mensajes con los datos', async () => {
    const spy = vi.spyOn(apiClient, 'post')
    const payload: MensajeType = { mensaje: 'hola', usuarioId: '1', salaId: '1' }
    apiClient.defaults.adapter = vi.fn().mockResolvedValue({ data: payload })
    await postMensaje(payload)
    expect(spy).toHaveBeenCalledWith('/mensajes', payload)
  })

  it('deleteMensaje hace DELETE a /mensajes/:id', () => {
    const spy = vi.spyOn(apiClient, 'delete')
    deleteMensaje('msg-456')
    expect(spy).toHaveBeenCalledWith('/mensajes/msg-456')
  })
})
