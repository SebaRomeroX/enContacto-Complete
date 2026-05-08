import { createContext, useEffect, type PropsWithChildren } from 'react'
import { useState } from 'react'
import type { Id, UserRol, Usuario } from '../types/types'
import { getUsuarios, postUsuarios, deleteUsuario } from '../services/usuarios'


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
  const [usuarios, setUsuarios] = useState([])
  const [usuario, setUsuario] = useState(undefined)


  useEffect(() => {
    getUsuarios().then(res => setUsuarios(res))
  }, [])

  
  // USER ADMIN ( TEMPORAL ) -------------------------
  useEffect(() => {
    setUsuario(usuarios.find(user => user.nombre == 'Administrador'))
  }, [usuarios])
  // ---------------------------------------------------


  function crearUsuario (nombre: string, foto: string) {
    if (usuarios.find(user => user.nombre === nombre)) return

    const contra = '777' // ES FIJA ( TEMPORAL )
    const rol: UserRol = 'user' // SOLO SE CREA USERS
    const newUsuario = { nombre, foto, contra, rol }
    postUsuarios(newUsuario)
    setUsuarios([...usuarios, newUsuario])
  }

  function eliminarUsuario (id: Id) {
    deleteUsuario(id)

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