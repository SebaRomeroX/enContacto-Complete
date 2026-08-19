import { useContext, useEffect, useRef } from 'react'
import { Mensaje } from './Mensaje'
import { CajaMensaje } from './CajaMensaje'
import { SalasContext } from '../../../context/salasContext.tsx'
import type { MensajeType } from '../../../types/types'
import './salaChat.css'

function salaIdDeMensaje(msj: MensajeType) {
  return typeof msj.salaId === 'object' && msj.salaId !== null ? msj.salaId.id : msj.salaId
}

export const SalaChat = () => {
  const { listaMensajes, totalMensajes, salaActiva, cargarMasMensajes } = useContext(SalasContext)
  const contenedorRef = useRef<HTMLUListElement>(null);
  const msjNuevoAnterior = useRef<string | undefined>(undefined);
  const salaAnterior = useRef<string | undefined>(undefined);

  useEffect(() => {
    if (!contenedorRef.current) return

    const msjsSala = listaMensajes?.filter(msj => salaIdDeMensaje(msj) == salaActiva?.id) ?? []
    const nuevoId = msjsSala[0]?.id

    if (salaActiva?.id !== salaAnterior.current) {
      contenedorRef.current.scrollTop = contenedorRef.current.scrollHeight
      salaAnterior.current = salaActiva?.id
    } else if (nuevoId && nuevoId !== msjNuevoAnterior.current) {
      contenedorRef.current.scrollTop = contenedorRef.current.scrollHeight
    }

    msjNuevoAnterior.current = nuevoId
  }, [listaMensajes, salaActiva])

  if (!salaActiva) {
    return (
      <section className="sala">
        <ul className="chat-section">
          <p>Elige un sala</p>
        </ul>
      </section>
    )
  }

  const msjsPertenecen = listaMensajes?.filter(msj => salaIdDeMensaje(msj) == salaActiva.id) ?? []
  const msjsOrdenados = [...msjsPertenecen].reverse()
  const hayMas = totalMensajes > msjsPertenecen.length

  return (
    <section className="sala">
      <ul className="chat-section" ref={contenedorRef}>
        <h2>{salaActiva?.nombre}</h2>
        {hayMas && (
          <li className='chat-cargar-mas'>
            <button className='boton' onClick={cargarMasMensajes}>
              Cargar mensajes anteriores
            </button>
          </li>
        )}
        { msjsOrdenados.map(msj => <Mensaje key={msj.id} msj={msj} /> )}
      </ul>
      <CajaMensaje />
    </section>
  )
}
