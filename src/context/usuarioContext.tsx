import { createContext, type PropsWithChildren } from 'react'
import { useState } from 'react'
import type { Id, UserRol, Usuario } from '../types/types'
import { crearNewId } from '../utils/crearNewId'
import { USUARIOS } from '../mocks/mock'

interface UsuarioContextType {
  usuario: Usuario | undefined
  usuarios: Usuario[]
  crearUsuario: (nombre: string, foto: string) => void
  eliminarUsuario: (id: Id) => void
}

const defaultContextValue: UsuarioContextType = {
  usuario: undefined,
  usuarios: [],
  crearUsuario: () => {},
  eliminarUsuario: () => {},
};

export const UsuarioContext = createContext(defaultContextValue)

export const UsuarioProvider = ({ children }: PropsWithChildren) => {
  const [usuarios, setUsuarios] = useState(USUARIOS)
  const usuario = USUARIOS[7]

  function crearUsuario (nombre: string, foto: string) {
    if (usuarios.find(user => user.nombre === nombre)) return

    const newId = crearNewId('user')
    const contra = '777' // ES FIJA PARA TODOS LOS NUEVOS USERS HASTA QUE SE RESUELVA COMO TRATARLO
    const rol: UserRol = 'user' // SOLO USER // EL ADMIN NO SE DEBERIA PODER CREAR // ADMIN UNICO
    const newUsuario = { nombre, foto, id: newId, contra, rol }
    setUsuarios([...usuarios, newUsuario])
  }

  function eliminarUsuario (id: Id) {
    const newUsuarios = usuarios.filter(user => user.id !== id)
    setUsuarios(newUsuarios)
  }

  const value: UsuarioContextType = {
    usuario,
    usuarios,
    crearUsuario,
    eliminarUsuario,
  }

  return (
    <UsuarioContext.Provider value={value}>
      {children}
    </UsuarioContext.Provider>
  )
}