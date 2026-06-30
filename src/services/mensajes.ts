import apiClient from './apiClient'
import type { MensajeType } from '../types/types'

export const getMensajes = () => {
  return apiClient.get('/mensajes').then(res => res.data)
}

export const postMensaje = (content: MensajeType) => {
  return apiClient.post('/mensajes', content).then(res => res.data)
}

export const deleteMensaje = (id: string) => {
  return apiClient.delete(`/mensajes/${id}`)
    .then(() => console.log('Recurso eliminado'))
    .catch(error => console.error('Error al eliminar', error))
}