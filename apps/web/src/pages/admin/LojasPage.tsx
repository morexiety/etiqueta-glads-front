import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { DispositivoFormDialog } from '@/components/lojas/DispositivoFormDialog'
import { DispositivoItem } from '@/components/lojas/DispositivoItem'
import { LojaFormDialog } from '@/components/lojas/LojaFormDialog'
import { SecretModal } from '@/components/lojas/SecretModal'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Spinner } from '@/components/ui/spinner'
import { useDispositivos } from '@/hooks/useOperacao'
import { useLojas } from '@/hooks/useLojas'
import type { CriarDispositivoResponse } from '@/lib/types'
import { cn } from '@/lib/utils'

function DispositivosSection({ lojaId }: { lojaId: string }) {
  const { data: dispositivos = [], isLoading } = useDispositivos(lojaId)
  const [formOpen, setFormOpen] = useState(false)
  const [secretData, setSecretData] = useState<CriarDispositivoResponse | null>(
    null,
  )

  return (
    <div className="space-y-3">
      {isLoading && <Spinner />}

      {!isLoading && dispositivos.length === 0 && (
        <p className="text-sm text-muted-foreground">Nenhuma impressora cadastrada.</p>
      )}

      {dispositivos.map((d) => (
        <DispositivoItem key={d.id} dispositivo={d} />
      ))}

      <Button variant="outline" size="sm" onClick={() => setFormOpen(true)}>
        Adicionar impressora
      </Button>

      <DispositivoFormDialog
        lojaId={lojaId}
        open={formOpen}
        onOpenChange={setFormOpen}
        onCreated={(res) => setSecretData(res)}
      />

      {secretData && (
        <SecretModal
          open={!!secretData}
          onOpenChange={(v) => {
            if (!v) setSecretData(null)
          }}
          deviceId={secretData.deviceId}
          secret={secretData.secret}
        />
      )}
    </div>
  )
}

export default function LojasPage() {
  const { data: lojas = [], isLoading } = useLojas()
  const [novaLojaOpen, setNovaLojaOpen] = useState(false)
  const [lojaExpandida, setLojaExpandida] = useState<string | null>(null)

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Lojas e Impressoras</h1>
        <Button onClick={() => setNovaLojaOpen(true)}>Nova loja</Button>
      </div>

      {isLoading && <Spinner />}

      <div className="space-y-4">
        {lojas.map((loja) => (
          <Card key={loja.id}>
            <CardHeader
              className="cursor-pointer select-none"
              onClick={() =>
                setLojaExpandida(lojaExpandida === loja.id ? null : loja.id)
              }
            >
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">{loja.nome}</CardTitle>
                <ChevronDown
                  className={cn(
                    'size-4 transition-transform',
                    lojaExpandida === loja.id && 'rotate-180',
                  )}
                />
              </div>
              {loja.endereco && (
                <p className="text-sm text-muted-foreground">{loja.endereco}</p>
              )}
            </CardHeader>

            {lojaExpandida === loja.id && (
              <CardContent>
                <DispositivosSection lojaId={loja.id} />
              </CardContent>
            )}
          </Card>
        ))}
      </div>

      <LojaFormDialog open={novaLojaOpen} onOpenChange={setNovaLojaOpen} />
    </div>
  )
}
