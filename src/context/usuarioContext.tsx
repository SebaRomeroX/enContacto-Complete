import { createContext } from "react";
import type { Usuario } from "../types/types";

export type LoginResult = 'ok' | 'invalid' | 'rate'

export interface UsuarioContextType {
  usuario: Usuario | undefined
  listaUsuarios: Usuario[] | undefined
  crearUsuario: (nombre: string) => Promise<void>
  eliminarUsuario: (id: string) => Promise<void>
  actualizarUsuario: (id: string, data: Partial<Usuario>) => Promise<void>
  logear: (nombre: string, contra: string) => Promise<LoginResult>
  cerrarSesion: () => void
  isLoading: boolean
}

const defaultUsersValue: UsuarioContextType = {
  usuario: undefined,
  listaUsuarios: [],
  crearUsuario: async () => {},
  eliminarUsuario: async () => {},
  actualizarUsuario: async () => {},
  logear: async () => 'invalid',
  cerrarSesion: () => {},
  isLoading: true,
};

export const UsuarioContext = createContext(defaultUsersValue)

