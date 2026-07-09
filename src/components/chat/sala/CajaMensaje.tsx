import { useContext, useRef, useState, type ChangeEvent, type FormEvent } from 'react'
import { UsuarioContext } from '../../../context/usuarioContext.tsx'
import { SalasContext } from '../../../context/salasContext.tsx'
import './cajaMensaje.css'


export const CajaMensaje = () => {
  const { usuario } = useContext(UsuarioContext)
  const { agregarMensaje, salaActiva } = useContext(SalasContext)
  const [texto, setTexto] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  function handleTexto (e: ChangeEvent<HTMLInputElement>) {
    const newTexto = e.target.value

    if (newTexto === ' ' ||
      newTexto.endsWith(' ') && texto.endsWith(' ')
    ) return

    setTexto(newTexto)
  }

  function handleEscribir (e: FormEvent<HTMLFormElement>) {
    e.preventDefault()

    if (!texto || !usuario || !salaActiva) return
    if (!usuario.id || !salaActiva.id) return

    setTexto('')
    agregarMensaje(texto, usuario.id, salaActiva.id)
  }

  return (
    <form className='caja-mensaje' onSubmit={handleEscribir}>
      <input
        value={texto}
        onChange={handleTexto}
        placeholder='Escribe aqui ...'
        ref={inputRef}
      />
      <button className='boton' aria-label='Enviar mensaje'>
        <svg viewBox='0 0 24 24' fill='currentColor'>
          <path d='M5 4l18 8-18 8V3z' />
        </svg>
      </button>
    </form>
  )
}