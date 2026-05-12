import { useContext } from "react"
import { UsuarioContext } from "../../../context/listOfContexts"
import type { MensajeType } from "../../../types/types"
import { SalasContext } from "../../../context/listOfContexts"

const usuarioFantasma = { foto: '0.png', nombre: 'eliminado'}

type MensajeProps = { msj: MensajeType }
export const Mensaje = ({ msj }: MensajeProps) => {
  const { salaActiva } = useContext(SalasContext)
  const { usuarios } = useContext(UsuarioContext)

  if ( salaActiva?.id !== msj.salaId ) return  

  function getUserName (id: string) {
    const user = usuarios?.find(user => user.id === id)
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