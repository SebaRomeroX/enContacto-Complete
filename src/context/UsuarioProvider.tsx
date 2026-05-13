import { useEffect, type PropsWithChildren } from 'react'
import { useState } from 'react'
import type { UserRol, Usuario } from '../types/types'
import { getUsuarios, postUsuarios, deleteUsuario } from '../services/usuarios'
import { UsuarioContext, type UsuarioContextType } from './UsuarioContext'


export const UsuarioProvider = ({ children }: PropsWithChildren) => {
  const [listaUsuarios, setListaUsuarios] = useState<Usuario[] | undefined>([])
  const [usuario, setUsuario] = useState<Usuario | undefined>(undefined)

  // console.log('lista users: ', usuarios);

  useEffect(() => {
    getUsuarios().then(resUsers => {
      setListaUsuarios(resUsers)

      // USER ADMIN ( TEMPORAL ) -------------------------
      const usuariosDB: Usuario[] = resUsers
      // console.log(usuariosDB);
      
      setUsuario(usuariosDB?.find(user => user.nombre == 'Administrador'))
    })
  }, [])


  
  //---------------
  // FUNCIONES

  async function crearUsuario (nombre: string, foto: string) {
    if (listaUsuarios?.find(user => user.nombre === nombre)) return

    const contra = '777' // ES FIJA ( TEMPORAL )
    const rol: UserRol = 'user' // SOLO SE CREA USERS
    const newUsuario = { nombre, foto, contra, rol }

    const savedUser = await postUsuarios(newUsuario)
    setListaUsuarios(prev => prev?.concat(savedUser))
  }

  function eliminarUsuario (id: string) {
    deleteUsuario(id)

    const newUsuarios = listaUsuarios?.filter(user => user.id !== id)
    setListaUsuarios(newUsuarios)
  }



  //----------------
  // SALIDA

  const value: UsuarioContextType = {
    usuario,
    listaUsuarios,
    crearUsuario,
    eliminarUsuario,
  }

  return (
    <UsuarioContext.Provider value={value}>
      {children}
    </UsuarioContext.Provider>
  )
}