import { useEffect, type PropsWithChildren } from 'react'
import { useState } from 'react'
import type { UserRol, Usuario } from '../types/types'
import { getUsuarios, postUsuarios, deleteUsuario } from '../services/usuarios'
import { UsuarioContext, type UsuarioContextType } from './UsuarioContext.tsx'
import loginServise from '../services/login.ts'


export const UsuarioProvider = ({ children }: PropsWithChildren) => {
  const [listaUsuarios, setListaUsuarios] = useState<Usuario[] | undefined>([])
  const [usuario, setUsuario] = useState<Usuario | undefined>(undefined)

  // console.log('lista users: ', usuarios);

  useEffect(() => {
    getUsuarios().then(resUsers => {
      setListaUsuarios(resUsers)

      const usuarioGuardado = localStorage.getItem('idUser')
      setUsuario(resUsers?.find(user => user.nombre == usuarioGuardado))
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


  //------------------
  // LOGEO

  async function logear (nombre: string, contra: string) {
    try {
      const userLoged = await loginServise.login({
        nombre,
        contra
      })
      
      setUsuario(listaUsuarios?.find(user => user.nombre == userLoged.nombre))
      localStorage.setItem('idUser', userLoged.nombre)

      return true
    } catch(e) {
      console.log(e)
      return false
    }
  }


  //----------------
  // SALIDA

  const value: UsuarioContextType = {
    usuario,
    listaUsuarios,
    crearUsuario,
    eliminarUsuario,
    logear,
  }

  return (
    <UsuarioContext.Provider value={value}>
      {children}
    </UsuarioContext.Provider>
  )
}