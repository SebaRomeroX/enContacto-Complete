import { createContext } from "react";
import type { Usuario } from "../types/types";

export type LoginResult = 'ok' | 'invalid' | 'rate'

export interface UsuarioContextType {
  usuario: Usuario | undefined
  listaUsuarios: Usuario[] | undefined
  crearUsuario: (nombre: string, foto: string) => Promise<void>
  eliminarUsuario: (id: string) => Promise<void>
  logear: (nombre: string, contra: string) => Promise<LoginResult>
  cerrarSesion: () => void
  isLoading: boolean
}

const defaultUsersValue: UsuarioContextType = {
  usuario: undefined,
  listaUsuarios: [],
  crearUsuario: async () => {},
  eliminarUsuario: async () => {},
  logear: async () => 'invalid',
  cerrarSesion: () => {},
  isLoading: true,
};

export const UsuarioContext = createContext(defaultUsersValue)

