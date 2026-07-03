import { useContext, useEffect, useRef } from 'react'
import { Mensaje } from './Mensaje'
import { CajaMensaje } from './CajaMensaje'
import { SalasContext } from '../../../context/salasContext.tsx'
import './salaChat.css'

export const SalaChat = () => {
  const { listaMensajes, salaActiva } = useContext(SalasContext)
  const contenedorRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    if (contenedorRef.current) {
      contenedorRef.current.scrollTop = contenedorRef.current.scrollHeight;
    }
  }, [listaMensajes])

  if (!salaActiva) {
    return (
      <section className="sala">
        <ul className="chat-section">
          <p>Elige un sala</p>
        </ul>
      </section>
    )
  } else {
    const msjsPertenecen = listaMensajes?.filter(msj => msj.salaId == salaActiva.id) 
    
    return (
      <section className="sala">
        <ul className="chat-section" ref={contenedorRef}>
          <h2>{salaActiva?.nombre}</h2>
          { msjsPertenecen?.map((msj, index) => <Mensaje key={index} msj={msj} /> )}
        </ul>
        <CajaMensaje />
      </section>
    )
  }
}