import { useNavigate } from 'react-router-dom'
import { LogOut, MapPin, RefreshCw } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { useLojas } from '@/hooks/useLojas'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

const papelLabel: Record<string, string> = {
  ADMIN: 'Administrador',
  GESTOR: 'Gestor',
  OPERADOR: 'Operador',
}

export default function SelectLojaPage() {
  const navigate = useNavigate()
  const auth = useAuth()
  const { data: lojas, isLoading, isError, refetch } = useLojas()

  function handleLogout() {
    auth.logout()
    navigate('/login')
  }

  function handleSelectLoja(lojaId: string) {
    auth.setLojaId(lojaId)
    const papel = auth.usuario?.papel
    if (papel === 'OPERADOR') {
      navigate(`/lojas/${lojaId}/operacao`)
    } else {
      navigate('/admin/catalogo')
    }
  }

  if (auth.isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-zinc-50">
      <header className="flex items-center justify-between border-b bg-white px-6 py-4">
        <div>
          <h1 className="text-lg font-semibold">Olá, {auth.usuario?.nome}</h1>
          <p className="text-sm text-muted-foreground">
            {auth.usuario?.papel ? papelLabel[auth.usuario.papel] : ''} — Selecione uma loja
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={handleLogout} className="gap-2">
          <LogOut className="size-4" />
          Sair
        </Button>
      </header>

      <main className="mx-auto max-w-2xl p-6">
        <h2 className="mb-4 text-xl font-semibold">Suas lojas</h2>

        {isLoading && (
          <div className="flex justify-center py-16">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          </div>
        )}

        {isError && (
          <div className="flex flex-col items-center gap-4 py-16 text-center">
            <p className="text-muted-foreground">Não foi possível carregar as lojas.</p>
            <Button variant="outline" onClick={() => refetch()} className="gap-2">
              <RefreshCw className="size-4" />
              Tentar novamente
            </Button>
          </div>
        )}

        {!isLoading && !isError && lojas && (
          <div className="space-y-3">
            {lojas.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                Nenhuma loja disponível.
              </p>
            ) : (
              lojas.map((loja) => (
                <Card
                  key={loja.id}
                  className="min-h-[80px] cursor-pointer transition-shadow hover:shadow-md"
                  onClick={() => handleSelectLoja(loja.id)}
                >
                  <CardContent className="flex min-h-[80px] items-center gap-4 p-4">
                    <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/10">
                      <MapPin className="size-5 text-primary" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-medium">{loja.nome}</p>
                      {loja.endereco && (
                        <p className="truncate text-sm text-muted-foreground">{loja.endereco}</p>
                      )}
                    </div>
                    {!loja.ativa && (
                      <span className="shrink-0 rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">
                        Inativa
                      </span>
                    )}
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        )}
      </main>
    </div>
  )
}
