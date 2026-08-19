import { createContext } from "react";
import type { MensajeType, Sala } from "../types/types";

export interface SalaContextType {
  listaMensajes: MensajeType[] | undefined
  totalMensajes: number
  salaActiva: Sala | undefined;
  salas: Sala[] | undefined;
  agregarMensaje: (mensaje: string, usuarioId: string, salaId: string) => Promise<boolean>;
  actualizarMsjs: () => void
  cargarMasMensajes: () => void
  asignarSala: (id: string | undefined) => void;
  eliminarSala: (id: string) => Promise<void>;
  crearSala: (nombre: string) => void;
  vaciarChat: (id: string) => void;
  cambiarNombre: (nombre: string, id: string) => void;
  isLoading: boolean
}

const defaultSalasValue: SalaContextType = {
  listaMensajes: undefined,
  totalMensajes: 0,
  salaActiva: undefined,
  salas: [],
  agregarMensaje: async () => false,
  asignarSala: () => {},
  eliminarSala: async () => {},
  crearSala: () => {},
  vaciarChat: () => {},
  cambiarNombre: () => {},
  actualizarMsjs: () => {},
  cargarMasMensajes: () => {},
  isLoading: true,
};

export const SalasContext = createContext<SalaContextType>(defaultSalasValue);
