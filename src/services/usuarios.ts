import apiClient from './apiClient'
import type { Usuario } from '../types/types'

export const getUsuarios = () => {
  return apiClient.get('/usuarios').then(res => res.data)
}

export const postUsuarios = (content: Usuario) => {
  return apiClient.post('/usuarios', content).then(res => res.data)
}

export const deleteUsuario = (id: string) => {
  return apiClient.delete(`/usuarios/${id}`)
    .then(() => console.log('Recurso eliminado'))
    .catch(error => console.error('Error al eliminar', error))
}