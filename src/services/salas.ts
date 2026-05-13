import axios from "axios"
import type { Sala } from "../types/types"
const route = 'http://localhost:3001/api/salas'


export const getSalas = () => {
  return axios
    .get(route)
    .then(response => {
      const { data } = response
      // console.log(data);
      return data
    })
}

export const postSalas = (content: Sala) => {
  return axios
    .post(route, content)
    .then(response => {
      const { data } = response
      // console.log(data);
      return data
    })
}

export const deleteSalas = (id: string) => {
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