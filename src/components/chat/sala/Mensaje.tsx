import { useContext } from "react"
import type { MensajeType } from "../../../types/types"
import { UsuarioContext } from "../../../context/UsuarioContext.tsx"

const usuarioFantasma = { foto: '0.png', nombre: 'eliminado'}

type MensajeProps = { msj: MensajeType }
export const Mensaje = ({ msj }: MensajeProps) => {
  const { listaUsuarios } = useContext(UsuarioContext)

  function getUserName (id: string) {
    const user = listaUsuarios?.find(user => user.id === id)
    return user
      ? { foto: user.foto, nombre: user.nombre}
      : { foto: usuarioFantasma.foto, nombre: usuarioFantasma.nombre}
  }

  const datos = getUserName(msj.usuarioId)
  const mensaje = msj.mensaje
  
  return (
    <li>
      <img src={datos.foto}/>
      <section className='mensaje'>
        <h4>{datos.nombre}</h4>
        <p>{mensaje}</p>
      </section>
    </li>
  )
}