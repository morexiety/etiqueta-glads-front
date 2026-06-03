import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import type { ReactNode } from 'react'
import type { Usuario } from '@/lib/types'
import { apiFetch, ApiError } from '@/lib/api'

interface AuthState {
  usuario: Usuario | null
  token: string | null
  lojaId: string | null
  isLoading: boolean
  isAuthenticated: boolean
}

interface AuthContextValue extends AuthState {
  login: (token: string, usuario: Usuario) => void
  logout: () => void
  setLojaId: (id: string) => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({
    usuario: null,
    token: localStorage.getItem('selo:token'),
    lojaId: localStorage.getItem('selo:lojaId'),
    isLoading: true,
    isAuthenticated: false,
  })

  useEffect(() => {
    const token = localStorage.getItem('selo:token')
    if (!token) {
      setState((s) => ({ ...s, isLoading: false }))
      return
    }
    apiFetch<Usuario>('/auth/me')
      .then((usuario) => {
        setState((s) => ({ ...s, usuario, isAuthenticated: true, isLoading: false }))
      })
      .catch((err: unknown) => {
        if (err instanceof ApiError && err.status === 401) {
          localStorage.removeItem('selo:token')
          localStorage.removeItem('selo:lojaId')
        }
        setState((s) => ({ ...s, token: null, isLoading: false }))
      })
  }, [])

  const login = useCallback((token: string, usuario: Usuario) => {
    localStorage.setItem('selo:token', token)
    setState((s) => ({ ...s, token, usuario, isAuthenticated: true }))
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem('selo:token')
    localStorage.removeItem('selo:lojaId')
    setState({
      usuario: null,
      token: null,
      lojaId: null,
      isLoading: false,
      isAuthenticated: false,
    })
  }, [])

  const setLojaId = useCallback((id: string) => {
    localStorage.setItem('selo:lojaId', id)
    setState((s) => ({ ...s, lojaId: id }))
  }, [])

  return (
    <AuthContext.Provider value={{ ...state, login, logout, setLojaId }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuthContext() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuthContext deve ser usado dentro de AuthProvider')
  return ctx
}
