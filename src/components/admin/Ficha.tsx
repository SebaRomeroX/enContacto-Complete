import type { ReactNode } from "react"

type FichaProps = {
  children: ReactNode
  onDelete: () => void
  contenidoClassName?: string
}

export const Ficha = ({ children, onDelete, contenidoClassName }: FichaProps) => {
  return (
    <li>
      <section className={contenidoClassName}>
        {children}
      </section>
      <section className='botones'>
        <button className="boton" onClick={onDelete}>
          Eliminar
        </button>
      </section>
    </li>
  )
}
