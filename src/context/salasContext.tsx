import { createContext } from "react";
import type { MensajeType, Sala } from "../types/types";

export interface SalaContextType {
  listaMensajes: MensajeType[] | undefined
  salaActiva: Sala | undefined;
  salas: Sala[] | undefined;
  agregarMensaje: (mensaje: string, usuarioId: string, salaId: string) => void;
  actualizarMsjs: () => void
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
  cambiarNombre: () => {},
  actualizarMsjs: () => {}
};

export const SalasContext = createContext<SalaContextType>(defaultSalasValue);