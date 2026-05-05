import { useContext, useState, type FormEvent } from 'react'
import { SalasContext } from '../../context/salasContext'

export const FormSala = () => {
  const { crearSala } = useContext(SalasContext)
  const [nombre, setNombre] = useState('')

  function handleCrear (e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (nombre) {
      crearSala(nombre)
      setNombre('')
    }
  }

  return (
    <section>
      <form className='formulario' onSubmit={handleCrear}>
        <legend>Nueva Sala</legend>
        <input
          type="text"
          placeholder='Nombre de sala'
          onChange={(e) => setNombre(e.target.value)}
          value={nombre}
          required
          className='input-texto'
        />
        <button className='boton'>Crear</button>
      </form>
    </section>
  )
}