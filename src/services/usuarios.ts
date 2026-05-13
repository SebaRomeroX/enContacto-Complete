import axios from "axios"
import type { Usuario } from "../types/types"
const route = 'http://localhost:3001/api/usuarios'


export const getUsuarios = () => {
  return axios
    .get(route)
    .then(response => {
      const { data } = response
      // console.log(data);
      return data
    })
}

export const postUsuarios = (content: Usuario) => {
  return axios
    .post(route, content)
    .then(response => {
      const { data } = response
      // console.log(data);
      return data
    })
}

export const deleteUsuario = (id: string) => {
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