import { createService } from './apiClient'
import apiClient from './apiClient'
import type { MensajeType } from '../types/types'

export interface MensajesParams {
  salaId?: string
  desde?: string
  hasta?: string
  limit?: number
  offset?: number
}

export interface PaginatedMensajes {
  mensajes: MensajeType[]
  total: number
}

async function getMensajes(params?: MensajesParams): Promise<PaginatedMensajes> {
  const res = await apiClient.get<MensajeType[]>('/mensajes', { params })
  const totalHeader = res.headers['x-total-count']
  const total = totalHeader ? Number(totalHeader) : res.data.length
  return { mensajes: res.data, total }
}

const { create: postMensaje, delete: deleteMensaje } = createService<MensajeType>('/mensajes')

export { getMensajes, postMensaje, deleteMensaje }
