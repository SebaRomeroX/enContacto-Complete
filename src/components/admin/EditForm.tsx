import { useContext, useState, type FormEvent } from "react"
import { SalasContext } from "../../context/UsuarioContext"

type FormProps = { nombre: string, id: string, ocultar: () => void }
export const EditForm = ({ nombre, id, ocultar }: FormProps) => {
  const { cambiarNombre } = useContext(SalasContext)
  const [input, setInput] = useState(nombre)

  function hanldeSubmit (e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    cambiarNombre(input , id)
    ocultar()
  }

  return (
    <form className='formulario' onSubmit={hanldeSubmit}>
      <input
        type="text"
        value={input}
        placeholder='Nuevo nombre'
        onChange={(e) => setInput(e.target.value)}
        autoFocus
        className='input-texto'
      />
      <button className="boton">Cambiar</button>
    </form>
  )
}