import axios from 'axios'

const apiClient = axios.create({
  baseURL: 'https://en-contacto-api.vercel.app/api',
})

apiClient.interceptors.request.use(config => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

apiClient.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      localStorage.removeItem('idUser')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default apiClient
