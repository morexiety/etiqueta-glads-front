import { Outlet } from 'react-router-dom'

export default function OperacaoLayout() {
  return (
    <div className="min-h-screen bg-zinc-900 text-zinc-50">
      <Outlet />
    </div>
  )
}
