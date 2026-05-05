import './Admin.css'
import { useContext } from "react"
import { SalasContext } from "../../context/salasContext"
import { UsuarioContext } from "../../context/usuarioContext"
import { Link } from 'react-router'
import { FormUsuario } from './FormUsuario'
import { FormSala } from './FormSalas'
import { FichaSala } from './FichaSala'
import { FichaUsuario } from './FichaUsuario'
import { RUTAS } from '../../constants/consts'

export const Admin = () => {
  const { salas } = useContext(SalasContext)
  const { usuarios } = useContext(UsuarioContext)

  return (
    <section className='admin-page'>
      <section className='admin-header'>
        <h2>Administrador</h2>
        <Link className='boton' to={RUTAS.chat}>Volver a salas</Link>
      </section>
      <section>
        <ul className='lista-admin'>
          <h3>Usuarios</h3>
          { usuarios.map(usuario => <FichaUsuario usuario={usuario} /> )}
        </ul>
        <FormUsuario />
      </section>
      <section>
        <ul className='lista-admin'>
          <h3>Salas</h3>
          { salas.map(sala => (
            <FichaSala key={sala.id} nombre={sala.nombre} id={sala.id} />
          ))}
        </ul>
        <FormSala />
      </section>
    </section>
  )
}