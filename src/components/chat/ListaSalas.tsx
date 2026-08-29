import { useContext } from 'react'
import { SalasContext } from '../../context/salasContext.tsx'
import { Cargando } from '../Cargando'
import './listaSalas.css'

export const ListaSalas = () => {
  const { asignarSala, salas, isLoading, noLeidos } = useContext(SalasContext)

  return (
    <section className='lista-salas-section'>
      <h2>Salas</h2>
      <ul>
        {isLoading && <Cargando />}
        {
          salas?.map(sala => (
            <li key={sala.id} onClick={() => sala.id && asignarSala(sala.id)}>
              <h3>{sala.nombre}{sala.id && noLeidos[sala.id] && <span className="unread-dot" />}</h3>
            </li>
          ))
        }
      </ul>
    </section>
  )
}