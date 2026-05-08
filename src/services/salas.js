import axios from "axios"
const route = 'http://localhost:3001/api/salas'


export const getSalas = () => {
  return axios
    .get(route)
    .then(response => {
      const { data } = response
      return data
    })
}

export const postSalas = (content) => {
  return axios
    .post(route, content)
    .then(response => {
      const { data } = response
      return data
    })
}

export const deleteSalas = (id) => {
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