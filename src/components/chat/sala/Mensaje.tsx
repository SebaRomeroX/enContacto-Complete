import { useContext, useMemo } from "react"
import type { MensajeType, UsuarioPopulate } from "../../../types/types"
import { UsuarioContext } from "../../../context/usuarioContext.tsx"
import './mensaje.css'

const usuarioFantasma = { foto: 'no-foto.png', nombre: 'eliminado'}

type MensajeProps = { msj: MensajeType }
export const Mensaje = ({ msj }: MensajeProps) => {
  const { listaUsuarios } = useContext(UsuarioContext)

  const userMap = useMemo(() => {
    const map = new Map<string, { foto: string; nombre: string }>()
    listaUsuarios?.forEach(u => {
      if (u.id) map.set(u.id, { foto: u.foto, nombre: u.nombre })
    })
    return map
  }, [listaUsuarios])

  const usuarioPopulate = typeof msj.usuarioId === 'object' && msj.usuarioId !== null
    ? msj.usuarioId as UsuarioPopulate
    : undefined
  const datos = usuarioPopulate ?? (typeof msj.usuarioId === 'string' ? userMap.get(msj.usuarioId) : undefined) ?? usuarioFantasma
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