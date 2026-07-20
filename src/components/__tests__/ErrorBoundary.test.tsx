import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, cleanup } from '@testing-library/react'
import '@testing-library/jest-dom/vitest'
import type { ReactNode } from 'react'
import ErrorBoundary from '../ErrorBoundary'

function Buggy({ message = 'error de prueba' }: { message?: string }): ReactNode {
  throw new Error(message)
}

beforeEach(() => {
  vi.spyOn(console, 'error').mockImplementation(() => {})
})

afterEach(() => {
  cleanup()
  vi.restoreAllMocks()
})

describe('ErrorBoundary', () => {
  it('renderiza children si no hay error', () => {
    render(
      <ErrorBoundary>
        <p>contenido normal</p>
      </ErrorBoundary>
    )
    expect(screen.getByText('contenido normal')).toBeInTheDocument()
  })

  it('captura error y muestra fallback por defecto', () => {
    render(
      <ErrorBoundary>
        <Buggy />
      </ErrorBoundary>
    )
    expect(screen.getByText('Algo salió mal')).toBeInTheDocument()
    expect(screen.getByText('error de prueba')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Recargar' })).toBeInTheDocument()
  })

  it('acepta fallback personalizado', () => {
    render(
      <ErrorBoundary fallback={<div>Fallback custom</div>}>
        <Buggy />
      </ErrorBoundary>
    )
    expect(screen.getByText('Fallback custom')).toBeInTheDocument()
    expect(screen.queryByText('Algo salió mal')).not.toBeInTheDocument()
  })
})
