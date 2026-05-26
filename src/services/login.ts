import axios from "axios"
import type { Credentials } from "../types/types"

// LOCAL
// const route = 'http://localhost:3001/api/login'

// ONLINE
const route = 'https://en-contacto-api.vercel.app/api/login'

const login = async (credentials: Credentials) => {
  const { data } = await axios.post(route, credentials)
  return data
}

export default { login }
