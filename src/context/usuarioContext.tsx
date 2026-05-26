import { createContext } from "react";
import type { Usuario } from "../types/types";

export interface UsuarioContextType {
  usuario: Usuario | undefined
  listaUsuarios: Usuario[] | undefined
  crearUsuario: (nombre: string, foto: string) => void
  eliminarUsuario: (id: string) => void
  logear: (inputs: {user: string, pass: string}) => boolean | undefined
}

const defaultUsersValue: UsuarioContextType = {
  usuario: undefined,
  listaUsuarios: [],
  crearUsuario: () => {},
  eliminarUsuario: () => {},
  logear: () => false,
};

export const UsuarioContext = createContext(defaultUsersValue)

