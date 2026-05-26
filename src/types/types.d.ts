export type UserRol = 'admin' | 'user'

export type Usuario = {
  id?: string,
  foto: string,
  nombre: string,
  contra: string,
  rol: UserRol,
}

export type MensajeType = {
  mensaje: string,
  usuarioId: string,
  salaId: string,
  id?: string
}

export type Sala = {
  nombre: string,
  id?: string,
}

export type Credentials = {
  nombre: string,
  contra: string,
}