import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { LogOut, Printer } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

const papelLabel: Record<string, string> = {
  ADMIN: 'Administrador',
  GESTOR: 'Gestor',
  OPERADOR: 'Operador',
}

export default function AppLayout() {
  const auth = useAuth()
  const navigate = useNavigate()

  const lojaId = auth.lojaId ?? 'loja-demo'

  const navItems = [
    { to: '/admin/catalogo', label: 'Catálogo', end: false, icon: null as React.ReactNode },
    { to: '/admin/lojas', label: 'Lojas & Impressoras', end: true, icon: <Printer size={18} /> },
    { to: `/admin/semaforo/${lojaId}`, label: 'Semáforo', end: false, icon: null },
    { to: `/admin/relatorios/${lojaId}`, label: 'Relatórios', end: false, icon: null },
  ]

  function handleLogout() {
    auth.logout()
    navigate('/login')
  }

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    cn(
      'flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors',
      isActive ? 'bg-accent text-accent-foreground' : 'hover:bg-accent',
    )

  return (
    <div className="flex min-h-screen">
      <aside className="hidden w-56 shrink-0 flex-col border-r bg-muted/30 md:flex">
        <div className="border-b px-4 py-5">
          <span className="text-lg font-semibold">Selo</span>
          <p className="text-xs text-muted-foreground">Administração</p>
        </div>
        <nav className="flex flex-1 flex-col gap-1 p-3">
          {navItems.map((item) => (
            <NavLink key={item.to} to={item.to} end={item.end} className={linkClass}>
              {item.icon}
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="space-y-2 border-t p-3">
          {auth.usuario && (
            <div className="px-3 py-1">
              <p className="truncate text-sm font-medium">{auth.usuario.nome}</p>
              <p className="text-xs text-muted-foreground">
                {papelLabel[auth.usuario.papel] ?? auth.usuario.papel}
              </p>
            </div>
          )}
          <Button
            variant="ghost"
            className="w-full justify-start gap-2"
            onClick={handleLogout}
          >
            <LogOut className="size-4" />
            Sair
          </Button>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex items-center justify-between border-b px-4 py-3 md:hidden">
          <span className="font-semibold">Selo</span>
          <nav className="flex flex-wrap justify-end gap-2 text-sm">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  cn(
                    'text-muted-foreground hover:text-foreground',
                    isActive && 'font-medium text-foreground',
                  )
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
        </header>
        <main className="flex-1 p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
