import axios from "axios"
const route = 'http://localhost:3001/api/login'
// const route = 'https://joyful-horse-1e25cd.netlify.app/api/login'

const login = async credentials => {
  const { data } = await axios.post(route, credentials)
  return data
}

export default { login }
