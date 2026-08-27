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

async function cambiarNombre(salaId: string, nombre: string): Promise<Sala> {
  const res = await apiClient.patch<Sala>(`/salas/${salaId}`, { nombre })
  return res.data
}

async function vaciarSala(salaId: string): Promise<void> {
  await apiClient.delete(`/salas/${salaId}/mensajes`)
}

export { getSalas, getSalasById, postSalas, deleteSalas, agregarMiembros, quitarMiembro, cambiarNombre, vaciarSala }
