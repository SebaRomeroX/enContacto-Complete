import { useContext } from 'react'
import { SalasContext } from '../../context/salasContext'

export const ListaSalas = () => {
  const { asignarSala, salas } = useContext(SalasContext)

  return (
    <section className='lista-salas-section'>
      <h2>Salas</h2>
      <ul>
        {
          salas?.map(sala => (
            <li key={sala.id} onClick={() => asignarSala(sala.id)}>
              <h3>{sala.nombre}</h3>
            </li>
          ))
        }
      </ul>
    </section>
  )
}