import axios from "axios"
const route = 'http://localhost:3001/api/usuarios'


export const getUsuarios = () => {
  return axios
    .get(route)
    .then(response => {
      const { data } = response
      return data
    })
}

export const postUsuarios = (content) => {
  return axios
    .post(route, content)
    .then(response => {
      const { data } = response
      return data
    })
}

export const deleteUsuario = (id) => {
  const rutaDelete = route.concat(`/${id}`)
  
  return axios
  .delete(rutaDelete)
  .then(response => {
    console.log('Recurso eliminado');
  })
  .catch(error => {
    console.error('Error al eliminar', error);
  });
}