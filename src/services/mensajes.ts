import axios from "axios"
import type { MensajeType } from "../types/types"
const route = 'http://localhost:3001/api/mensajes'


export const getMensajes = () => {
  return axios
    .get(route)
    .then(response => {
      const { data } = response
      // console.log(data);
      return data
    })
}

export const postMensaje = (content: MensajeType) => {
  return axios
    .post(route, content)
    .then(response => {
      const { data } = response
      // console.log(data);
      return data
    })
}

export const deleteMensaje = (id: string) => {
  const rutaDelete = route.concat(`/${id}`)
  
  return axios
  .delete(rutaDelete)
  .then(() => {
    console.log('Recurso eliminado');
  })
  .catch(error => {
    console.error('Error al eliminar', error);
  });
}