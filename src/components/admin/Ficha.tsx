import type { ReactNode } from "react"
import './ficha.css'

type FichaProps = {
  children: ReactNode
  onDelete: () => void
}

export const Ficha = ({ children, onDelete }: FichaProps) => {
  return (
    <li className="ficha">
      <section className="ficha__content">
        {children}
      </section>
      <section className="ficha__actions">
        <button className="boton" onClick={onDelete}>
          Eliminar
        </button>
      </section>
    </li>
  )
}
