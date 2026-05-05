import { useContext, useEffect, useRef, useState, type ChangeEvent, type FormEvent } from 'react'
import { UsuarioContext } from '../../context/usuarioContext'
import { SalasContext } from '../../context/salasContext'


export const CajaMensaje = () => {
  const { usuario } = useContext(UsuarioContext)
  const { agregarMensaje } = useContext(SalasContext)
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
    if (!texto || !usuario) return

    setTexto('')
    agregarMensaje(texto, usuario.id)
  }

  return (
    <form className='caja-mensaje' onSubmit={handleEscribir}>
      <input
        value={texto}
        onChange={handleTexto}
        placeholder='Escribe aqui ...'
        ref={inputRef}
      />
      <button> ▶ </button>
    </form>
  )
}