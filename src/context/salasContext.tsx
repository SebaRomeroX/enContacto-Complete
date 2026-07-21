import { createContext } from "react";
import type { MensajeType, Sala } from "../types/types";

export interface SalaContextType {
  listaMensajes: MensajeType[] | undefined
  salaActiva: Sala | undefined;
  salas: Sala[] | undefined;
  agregarMensaje: (mensaje: string, usuarioId: string, salaId: string) => Promise<boolean>;
  actualizarMsjs: () => void
  asignarSala: (id: string | undefined) => void;
  eliminarSala: (id: string) => void;
  crearSala: (nombre: string) => void;
  vaciarChat: (id: string) => void;
  cambiarNombre: (nombre: string, id: string) => void;
  isLoading: boolean
}

const defaultSalasValue: SalaContextType = {
  listaMensajes: undefined,
  salaActiva: undefined,
  salas: [],
  agregarMensaje: async () => false,
  asignarSala: () => {},
  eliminarSala: () => {},
  crearSala: () => {},
  vaciarChat: () => {},
  cambiarNombre: () => {},
  actualizarMsjs: () => {},
  isLoading: true,
};

export const SalasContext = createContext<SalaContextType>(defaultSalasValue);