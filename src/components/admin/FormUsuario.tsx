import { useContext, useState, type FormEvent } from 'react'
import { UsuarioContext } from '../../context/usuarioContext'

export const FormUsuario = () => {
  const { crearUsuario } = useContext(UsuarioContext)
  const [nombre, setNombre] = useState('')
  const [foto, setFoto] = useState('')

  function handleCrear (e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const fotoParam = foto ? foto : 'null'

    if (!nombre) return
    crearUsuario(nombre, fotoParam)
    setNombre('')
    setFoto('')
  }

  return (
    <form className='formulario' onSubmit={handleCrear}>
      <legend>Nuevo Usuario</legend>
      <input
        type="text"
        placeholder='Nombre de usuario'
        value={nombre}
        onChange={(e) => setNombre(e.target.value)}
        required
        className='input-texto'
      />
      <input
        type="text"
        placeholder='Foto de usuario'
        value={foto}
        onChange={(e) => setFoto(e.target.value)}
        className='input-texto'
      />
      <button className='boton'>Crear</button>
    </form>
  )
}