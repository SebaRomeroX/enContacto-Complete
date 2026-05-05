import { useContext } from "react"
import { UsuarioContext } from "../../context/usuarioContext"
import type { Usuario } from "../../types/types"

type FichaProps = { usuario: Usuario }
export const FichaUsuario = ({ usuario }: FichaProps) => {
  const { eliminarUsuario } = useContext(UsuarioContext)

  if (usuario.rol === 'admin') return
  
  return (
    <li>
      <section className="info-user">
        <img src={usuario.foto}/>
        <h4>{usuario.nombre}</h4>
      </section>
      <section className='botones'>
        <button className="boton" onClick={() => eliminarUsuario(usuario.id)}>Eliminar</button>
      </section>
    </li>
  )
}