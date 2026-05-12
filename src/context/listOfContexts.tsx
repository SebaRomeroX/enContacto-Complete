import { createContext } from "react";
import type { MensajeType, Sala, Usuario } from "../types/types";

export interface UsuarioContextType {
  usuario: Usuario | undefined
  usuarios: Usuario[] | undefined
  crearUsuario: (nombre: string, foto: string) => void
  eliminarUsuario: (id: string) => void
}

const defaultUsersValue: UsuarioContextType = {
  usuario: undefined,
  usuarios: [],
  crearUsuario: () => {},
  eliminarUsuario: () => {},
};

export const UsuarioContext = createContext(defaultUsersValue)


//----------------------------------


export interface SalaContextType {
  listaMensajes: MensajeType[] | undefined
  salaActiva: Sala | undefined;
  salas: Sala[] | undefined;
  agregarMensaje: (mensaje: string, usuarioId: string, salaId: string) => void;
  asignarSala: (id: string) => void;
  eliminarSala: (id: string) => void;
  crearSala: (nombre: string) => void;
  vaciarChat: (id: string) => void;
  cambiarNombre: (nombre: string, id: string) => void;
}

const defaultSalasValue: SalaContextType = {
  listaMensajes: undefined,
  salaActiva: undefined,
  salas: [],
  agregarMensaje: () => {},
  asignarSala: () => {},
  eliminarSala: () => {},
  crearSala: () => {},
  vaciarChat: () => {},
  cambiarNombre: () => {}
};

export const SalasContext = createContext<SalaContextType>(defaultSalasValue);