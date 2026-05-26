import { createContext } from "react";
import type { Usuario } from "../types/types";

export interface UsuarioContextType {
  usuario: Usuario | undefined
  listaUsuarios: Usuario[] | undefined
  crearUsuario: (nombre: string, foto: string) => void
  eliminarUsuario: (id: string) => void
  logear: (nombre: string, contra: string) => Promise<boolean>
}

const defaultUsersValue: UsuarioContextType = {
  usuario: undefined,
  listaUsuarios: [],
  crearUsuario: () => {},
  eliminarUsuario: () => {},
  logear: async () => false
};

export const UsuarioContext = createContext(defaultUsersValue)

