import axios from "axios"
const route = 'http://localhost:3001/api/mensajes'


export const getMensajes = () => {
  return axios
    .get(route)
    .then(response => {
      const { data } = response
      // console.log(data)
      return data
    })
}

export const postMensaje = (content) => {
  console.log(content)

  return axios
    .post(route, content)
    .then(response => {
      const { data } = response
      return data
    })
}