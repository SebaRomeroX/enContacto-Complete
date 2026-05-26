import { useContext, useEffect, useRef } from 'react'
import { Mensaje } from './Mensaje'
import { CajaMensaje } from './CajaMensaje'
import { SalasContext } from '../../../context/salasContext.tsx'

export const SalaChat = () => {
  const { listaMensajes, actualizarMsjs, salaActiva } = useContext(SalasContext)
  const contenedorRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    if (contenedorRef.current) {
      contenedorRef.current.scrollTop = contenedorRef.current.scrollHeight;
    }
  }, [listaMensajes])

  useEffect(() => {
    const msjInterval = setInterval(() => {
      actualizarMsjs()
    }, 3000)

    return () => {
      clearInterval(msjInterval);
    }
  }, [])

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