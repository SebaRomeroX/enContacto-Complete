import apiClient from './apiClient'
import type { Sala } from '../types/types'

export const getSalas = () => {
  return apiClient.get('/salas').then(res => res.data)
}

export const postSalas = (content: Sala) => {
  return apiClient.post('/salas', content).then(res => res.data)
}

export const deleteSalas = (id: string) => {
  return apiClient.delete(`/salas/${id}`)
    .then(() => console.log('Recurso eliminado'))
    .catch(error => console.error('Error al eliminar', error))
}