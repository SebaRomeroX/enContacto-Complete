import { createService } from './apiClient'
import type { Usuario } from '../types/types'

const { getAll: getUsuarios, create: postUsuarios, delete: deleteUsuario } = createService<Usuario>('/usuarios')

export { getUsuarios, postUsuarios, deleteUsuario }
