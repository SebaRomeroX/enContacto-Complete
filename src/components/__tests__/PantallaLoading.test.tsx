import { describe, it, expect, vi, afterEach, beforeEach } from 'vitest'
import { render, screen, cleanup, act } from '@testing-library/react'
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

  it('isLoading=false: no overlay cuando nunca estuvo en true', () => {
    render(<PantallaLoading isLoading={false} />)
    expect(screen.queryByText('Cargando...')).not.toBeInTheDocument()
    expect(document.querySelector('.pantalla-loading')).not.toBeInTheDocument()
  })

  describe('duración mínima 2200ms', () => {
    beforeEach(() => {
      vi.useFakeTimers()
    })

    afterEach(() => {
      vi.useRealTimers()
    })

    it('permanece visible al menos 2200ms cuando isLoading pasa a false', async () => {
      const { rerender } = render(<PantallaLoading isLoading={true} />)
      expect(document.querySelector('.pantalla-loading')).toBeInTheDocument()

      rerender(<PantallaLoading isLoading={false} />)

      await act(async () => {
        vi.advanceTimersByTime(2199)
      })
      expect(document.querySelector('.pantalla-loading')).toBeInTheDocument()

      await act(async () => {
        vi.advanceTimersByTime(1)
      })
      expect(document.querySelector('.pantalla-loading')).not.toBeInTheDocument()
    })

    it('flip-flop: si isLoading vuelve a true el timer se resetea', async () => {
      const { rerender } = render(<PantallaLoading isLoading={true} />)

      rerender(<PantallaLoading isLoading={false} />)
      await act(async () => { vi.advanceTimersByTime(500) })

      rerender(<PantallaLoading isLoading={true} />)
      rerender(<PantallaLoading isLoading={false} />)

      await act(async () => { vi.advanceTimersByTime(1700) })
      expect(document.querySelector('.pantalla-loading')).toBeInTheDocument()
    })
  })
})
