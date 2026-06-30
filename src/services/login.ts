import apiClient from './apiClient'
import type { Credentials } from '../types/types'

const login = async (credentials: Credentials) => {
  const { data } = await apiClient.post('/login', credentials)
  localStorage.setItem('token', data.token)
  localStorage.setItem('user', JSON.stringify(data))
  return data
}

export default { login }
