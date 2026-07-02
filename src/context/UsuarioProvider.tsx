import { useEffect, type PropsWithChildren } from 'react'
import { useState } from 'react'
import type { UserRol, Usuario } from '../types/types'
import { getUsuarios, postUsuarios, deleteUsuario } from '../services/usuarios'
import { UsuarioContext, type UsuarioContextType } from './usuarioContext.tsx'
import loginServise from '../services/login.ts'


export const UsuarioProvider = ({ children }: PropsWithChildren) => {
  const [listaUsuarios, setListaUsuarios] = useState<Usuario[] | undefined>([])
  const [usuario, setUsuario] = useState<Usuario | undefined>(undefined)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    getUsuarios().then(resUsers => {
      setListaUsuarios(resUsers)

      const token = localStorage.getItem('token')
      if (!token) return

      const storedUser = localStorage.getItem('user')
      if (storedUser) {
        const parsed = JSON.parse(storedUser)
        setUsuario(
          resUsers?.find((u: Usuario) => u.id === parsed.id)
          ?? resUsers?.find((u: Usuario) => u.nombre === parsed.nombre)
        )
      }
    }).finally(() => setIsLoading(false))
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
      const userLoged = await loginServise.login({ nombre, contra })

      const userEncontrado = listaUsuarios?.find(user => user.nombre == userLoged.nombre)
      setUsuario(userEncontrado ?? userLoged)

      if (!listaUsuarios?.length) {
        const resUsers = await getUsuarios()
        setListaUsuarios(resUsers)
      }

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
    isLoading,
  }

  return (
    <UsuarioContext.Provider value={value}>
      {children}
    </UsuarioContext.Provider>
  )
}