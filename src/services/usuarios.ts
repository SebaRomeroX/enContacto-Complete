import { createService } from './apiClient'
import type { Usuario } from '../types/types'

const { getAll: getUsuarios, getById: getUsuariosById, create: postUsuarios, update: updateUsuario, delete: deleteUsuario } = createService<Usuario>('/usuarios')

export { getUsuarios, getUsuariosById, postUsuarios, updateUsuario, deleteUsuario }
