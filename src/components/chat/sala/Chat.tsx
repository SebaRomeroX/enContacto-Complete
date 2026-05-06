import { useContext, useEffect, useRef } from 'react'
import { SalasContext } from '../../../context/salasContext'
import { Mensaje } from './Mensaje'

export const Chat = () => {
  const { salaActiva } = useContext(SalasContext)
  const contenedorRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    if (contenedorRef.current) {
      contenedorRef.current.scrollTop = contenedorRef.current.scrollHeight;
    }
  }, [salaActiva])


  // TEMPORAL
  const salaNombre = 'Tutorial'

  //--------

  return (
    <section className="sala">
      {
        salaActiva
          ? <ul className="chat-section" ref={contenedorRef}>
              <h2>{salaNombre}</h2>
              { salaActiva?.map((msj, index) => <Mensaje key={index} msj={msj} /> )}
            </ul>
          : <p>Elige un sala</p>
      }
    </section>
  )
}