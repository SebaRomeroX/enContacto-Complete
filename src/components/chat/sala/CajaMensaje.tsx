import { useContext, useEffect, useRef, useState, type ChangeEvent, type FormEvent } from 'react'
import { UsuarioContext } from '../../../context/UsuarioContext.tsx'
import { SalasContext } from '../../../context/SalasContext.tsx'


export const CajaMensaje = () => {
  const { usuario } = useContext(UsuarioContext)
  const { agregarMensaje, salaActiva } = useContext(SalasContext)
  const [texto, setTexto] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    inputRef.current?.focus()
  })

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
      <button className='boton'> ▶ </button>
    </form>
  )
}