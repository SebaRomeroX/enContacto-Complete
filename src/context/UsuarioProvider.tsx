import { useEffect, type PropsWithChildren } from 'react'
import { useState } from 'react'
import type { Usuario } from '../types/types'
import { getUsuarios, postUsuarios, deleteUsuario, updateUsuario } from '../services/usuarios'
import { UsuarioContext, type LoginResult, type UsuarioContextType } from './usuarioContext.tsx'
import loginService from '../services/login.ts'


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
    }).catch(err => console.error('Error al cargar usuarios:', err))
    .finally(() => setIsLoading(false))
  }, [])


  
  //---------------
  // FUNCIONES

  async function crearUsuario (nombre: string) {
    if (listaUsuarios?.find(user => user.nombre === nombre)) return

    try {
      const savedUser = await postUsuarios({ nombre })
      setListaUsuarios(prev => prev?.concat(savedUser))
    } catch (err) {
      console.error('Error al crear usuario:', err)
      throw err
    }
  }

  async function eliminarUsuario (id: string) {
    try {
      await deleteUsuario(id)
      const newUsuarios = listaUsuarios?.filter(user => user.id !== id)
      setListaUsuarios(newUsuarios)
    } catch (err) {
      console.error('Error al eliminar usuario:', err)
      throw err
    }
  }

  async function actualizarUsuario (id: string, data: Partial<Usuario>) {
    try {
      const updated = await updateUsuario(id, data)
      setUsuario(prev => {
        if (prev && prev.id === id) {
          const nuevoUsuario = { ...prev, ...updated }
          localStorage.setItem('user', JSON.stringify(nuevoUsuario))
          return nuevoUsuario
        }
        return prev
      })
      setListaUsuarios(prev =>
        prev?.map(u => u.id === id ? { ...u, ...updated } : u)
      )
    } catch (err) {
      console.error('Error al actualizar usuario:', err)
      throw err
    }
  }


  //------------------
  // LOGEO

  async function logear (nombre: string, contra: string): Promise<LoginResult> {
    try {
      const userLoged = await loginService.login({ nombre, contra })
      const userEncontrado = listaUsuarios?.find(user => user.nombre == userLoged.nombre)
      setUsuario(userEncontrado ?? userLoged)
      return 'ok'
    } catch(e) {
      const status = (e as { response?: { status?: number } })?.response?.status
      if (status === 429) return 'rate'
      console.log(e)
      return 'invalid'
    }
  }


  //----------------
  // SALIDA

  function cerrarSesion() {
    setUsuario(undefined)
  }

  const value: UsuarioContextType = {
    usuario,
    listaUsuarios,
    crearUsuario,
    eliminarUsuario,
    actualizarUsuario,
    logear,
    cerrarSesion,
    isLoading,
  }

  return (
    <UsuarioContext.Provider value={value}>
      {children}
    </UsuarioContext.Provider>
  )
}