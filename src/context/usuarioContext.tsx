import { createContext } from "react";
import type { Usuario } from "../types/types";

export interface UsuarioContextType {
  usuario: Usuario | undefined
  listaUsuarios: Usuario[] | undefined
  crearUsuario: (nombre: string, foto: string) => void
  eliminarUsuario: (id: string) => void
  logear: (nombre: string, contra: string) => Promise<boolean>
  cerrarSesion: () => void
  isLoading: boolean
}

const defaultUsersValue: UsuarioContextType = {
  usuario: undefined,
  listaUsuarios: [],
  crearUsuario: () => {},
  eliminarUsuario: () => {},
  logear: async () => false,
  cerrarSesion: () => {},
  isLoading: true,
};

export const UsuarioContext = createContext(defaultUsersValue)

