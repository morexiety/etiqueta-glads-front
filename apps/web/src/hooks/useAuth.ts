// Implementado na Etapa 2.
export function useAuth() {
  return {
    usuario: null as null | { id: string; nome: string; email: string; papel: string },
    token: localStorage.getItem('selo:token'),
    isAuthenticated: !!localStorage.getItem('selo:token'),
    login: (_token: string) => {},
    logout: () => {},
  }
}
