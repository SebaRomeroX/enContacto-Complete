import { createService } from './apiClient'
import type { MensajeType } from '../types/types'

const { getAll: getMensajes, create: postMensaje, delete: deleteMensaje } = createService<MensajeType>('/mensajes')

export { getMensajes, postMensaje, deleteMensaje }
