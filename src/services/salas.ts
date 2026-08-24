import { createService } from './apiClient'
import apiClient from './apiClient'
import type { Sala } from '../types/types'

const { getAll: getSalas, getById: getSalasById, create: postSalas, delete: deleteSalas } = createService<Sala>('/salas')

async function agregarMiembros(salaId: string, usuarioIds: string[]): Promise<Sala> {
  const res = await apiClient.post<Sala>(`/salas/${salaId}/miembros`, { usuarioIds })
  return res.data
}

async function quitarMiembro(salaId: string, usuarioId: string): Promise<Sala> {
  const res = await apiClient.delete<Sala>(`/salas/${salaId}/miembros/${usuarioId}`)
  return res.data
}

export { getSalas, getSalasById, postSalas, deleteSalas, agregarMiembros, quitarMiembro }
