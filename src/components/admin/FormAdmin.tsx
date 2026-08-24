import { type FormEvent, type ReactNode } from "react"

type Campo = {
  placeholder: string
  value: string
  onChange: (value: string) => void
  required?: boolean
}

type FormAdminProps = {
  legend: string
  campos: Campo[]
  onSubmit: (e: FormEvent<HTMLFormElement>) => void
  children?: ReactNode
}

export const FormAdmin = ({ legend, campos, onSubmit, children }: FormAdminProps) => {
  return (
    <form className='formulario' onSubmit={onSubmit}>
      <legend>{legend}</legend>
      {campos.map((campo, i) => (
        <input
          key={i}
          type="text"
          placeholder={campo.placeholder}
          value={campo.value}
          onChange={(e) => campo.onChange(e.target.value)}
          required={campo.required}
          className='input-texto'
        />
      ))}
      {children}
      <button className='boton'>Crear</button>
    </form>
  )
}
