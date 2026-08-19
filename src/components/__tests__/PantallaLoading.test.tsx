import { describe, it, expect, afterEach } from 'vitest'
import { render, screen, cleanup } from '@testing-library/react'
import '@testing-library/jest-dom/vitest'
import { PantallaLoading } from '../PantallaLoading'

afterEach(cleanup)

describe('PantallaLoading', () => {
  it('isLoading=true: muestra overlay con marca, slogan y spinner', () => {
    render(<PantallaLoading isLoading={true} />)
    expect(screen.getByText('enContacto')).toBeInTheDocument()
    expect(screen.getByText('Tu equipo. Siempre. enContacto')).toBeInTheDocument()
    expect(screen.getByText('Cargando...')).toBeInTheDocument()
    expect(document.querySelector('.pantalla-loading')).toBeInTheDocument()
    expect(document.querySelector('.loading-spinner')).toBeInTheDocument()
  })

  it('isLoading=false: no overlay', () => {
    render(<PantallaLoading isLoading={false} />)
    expect(screen.queryByText('Cargando...')).not.toBeInTheDocument()
    expect(document.querySelector('.pantalla-loading')).not.toBeInTheDocument()
  })

  it('flip-flop: se muestra con true y desaparece al pasar a false', () => {
    const { rerender } = render(<PantallaLoading isLoading={true} />)
    expect(document.querySelector('.pantalla-loading')).toBeInTheDocument()

    rerender(<PantallaLoading isLoading={false} />)
    expect(document.querySelector('.pantalla-loading')).not.toBeInTheDocument()
  })
})
