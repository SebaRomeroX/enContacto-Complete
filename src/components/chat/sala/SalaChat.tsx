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
  const { listaMensajes, salaActiva } = useContext(SalasContext)
  const contenedorRef = useRef<HTMLUListElement>(null);
  const cantMsgsAnterior = useRef(0);
  const salaAnterior = useRef<string | undefined>(undefined);

  useEffect(() => {
    if (!contenedorRef.current) return

    const msjsSala = listaMensajes?.filter(msj => salaIdDeMensaje(msj) == salaActiva?.id) ?? []

    if (salaActiva?.id !== salaAnterior.current) {
      contenedorRef.current.scrollTop = contenedorRef.current.scrollHeight
      salaAnterior.current = salaActiva?.id
    } else if (msjsSala.length > cantMsgsAnterior.current) {
      contenedorRef.current.scrollTop = contenedorRef.current.scrollHeight
    }

    cantMsgsAnterior.current = msjsSala.length
  }, [listaMensajes, salaActiva])

  if (!salaActiva) {
    return (
      <section className="sala">
        <ul className="chat-section">
          <p>Elige un sala</p>
        </ul>
      </section>
    )
  } else {
    const msjsPertenecen = listaMensajes?.filter(msj => salaIdDeMensaje(msj) == salaActiva.id) 
    
    return (
      <section className="sala">
        <ul className="chat-section" ref={contenedorRef}>
          <h2>{salaActiva?.nombre}</h2>
          { msjsPertenecen?.map(msj => <Mensaje key={msj.id} msj={msj} /> )}
        </ul>
        <CajaMensaje />
      </section>
    )
  }
}