import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'

export function AdminRoute() {
  const { usuario } = useAuth()

  if (usuario?.papel === 'OPERADOR') {
    return <Navigate to="/lojas" replace />
  }

  return <Outlet />
}
