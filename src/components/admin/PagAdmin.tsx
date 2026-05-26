import './pagAdmin.css'
import { useContext, useEffect } from "react"
import { UsuarioContext } from "../../context/usuarioContext.tsx"
import { Link, useNavigate } from 'react-router'
import { RUTAS } from '../../constants/rutas'
import { FichaUsuario } from './seccion-user/FichaUsuario'
import { FormUsuario } from './seccion-user/FormUsuario'
import { FichaSala } from './seccion-sala/FichaSala'
import { FormSala } from './seccion-sala/FormSalas'
import { SalasContext } from '../../context/salasContext.tsx'

export const PagAdmin = () => {
  const { salas } = useContext(SalasContext)
  const { listaUsuarios } = useContext(UsuarioContext)

  const navigate = useNavigate()
  
  useEffect(() => {
    if (localStorage.getItem('idUser') !== 'Administrador') navigate(RUTAS.login)
  }, [])

  return (
    <section className='admin-page'>
      <section className='admin-header'>
        <h2>Administrador</h2>
        <Link className='boton' to={RUTAS.chat}>Volver a salas</Link>
      </section>
      <section>
        <ul className='lista-admin'>
          <h3>Usuarios</h3>
          { listaUsuarios?.map(usuario =>
            <FichaUsuario usuario={usuario} key={usuario.id}/> 
          )}
        </ul>
        <FormUsuario />
      </section>
      <section>
        <ul className='lista-admin'>
          <h3>Salas</h3>
          { salas?.map(sala => (
            sala.id &&
              <FichaSala key={sala.id} nombre={sala.nombre} id={sala.id} />
          ))}
        </ul>
        <FormSala />
      </section>
    </section>
  )
}