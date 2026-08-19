import { createService } from './apiClient'
import type { Sala } from '../types/types'

const { getAll: getSalas, getById: getSalasById, create: postSalas, delete: deleteSalas } = createService<Sala>('/salas')

export { getSalas, getSalasById, postSalas, deleteSalas }
