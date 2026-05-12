import { useEffect, type PropsWithChildren } from 'react'
import { useState } from 'react'
import type { UserRol, Usuario } from '../types/types'
import { getUsuarios, postUsuarios, deleteUsuario } from '../services/usuarios'
import { UsuarioContext, type UsuarioContextType } from './listOfContexts'


export const UsuarioProvider = ({ children }: PropsWithChildren) => {
  const [usuarios, setUsuarios] = useState<Usuario[] | undefined>([])
  const [usuario, setUsuario] = useState<Usuario | undefined>(undefined)

  useEffect(() => {
    getUsuarios().then(resUsers => {
      setUsuarios(resUsers)

      // USER ADMIN ( TEMPORAL ) -------------------------
      const usuariosDB: Usuario[] = resUsers
      setUsuario(usuariosDB?.find(user => user.nombre == 'Administrador'))
    })
  }, [])


  function crearUsuario (nombre: string, foto: string) {
    if (usuarios?.find(user => user.nombre === nombre)) return

    const contra = '777' // ES FIJA ( TEMPORAL )
    const rol: UserRol = 'user' // SOLO SE CREA USERS
    const newUsuario = { nombre, foto, contra, rol }
    postUsuarios(newUsuario)
    setUsuarios(prev => prev?.concat(newUsuario))
  }

  function eliminarUsuario (id: string) {
    deleteUsuario(id)

    const newUsuarios = usuarios?.filter(user => user.id !== id)
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