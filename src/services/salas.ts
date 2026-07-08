import { createService } from './apiClient'
import type { Sala } from '../types/types'

const { getAll: getSalas, create: postSalas, delete: deleteSalas } = createService<Sala>('/salas')

export { getSalas, postSalas, deleteSalas }
