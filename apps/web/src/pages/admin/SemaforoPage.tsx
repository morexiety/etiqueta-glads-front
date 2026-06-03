import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { EtiquetaCard } from '@/components/semaforo/EtiquetaCard'
import { DescarteDialog } from '@/components/semaforo/DescarteDialog'
import { Badge } from '@/components/ui/badge'
import { Spinner } from '@/components/ui/spinner'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useSemaforo } from '@/hooks/useAdminDashboard'
import type { EtiquetaSemaforo } from '@/lib/types'

function ColunaSemaforo({
  etiquetas,
  cor,
  onDescartar,
}: {
  etiquetas: EtiquetaSemaforo[]
  cor: 'verde' | 'amarelo' | 'vermelho'
  onDescartar: (e: EtiquetaSemaforo) => void
}) {
  if (etiquetas.length === 0) {
    return (
      <p className="py-8 text-center text-muted-foreground">
        Nenhuma etiqueta nesta categoria
      </p>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
      {etiquetas.map((etiqueta) => (
        <EtiquetaCard
          key={etiqueta.id}
          etiqueta={etiqueta}
          cor={cor}
          onDescartar={onDescartar}
        />
      ))}
    </div>
  )
}

export default function SemaforoPage() {
  const { lojaId } = useParams<{ lojaId: string }>()
  const { data, isLoading } = useSemaforo(lojaId!)
  const [descarteEtiqueta, setDescarteEtiqueta] = useState<EtiquetaSemaforo | null>(
    null,
  )

  if (isLoading) return <Spinner />
  if (!data) return null

  const { totais, verde, amarelo, vermelho } = data

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Semáforo de Validades</h1>
        <span className="text-sm text-muted-foreground">Atualiza a cada 30s</span>
      </div>

      <Tabs defaultValue="vermelho">
        <TabsList className="mb-4 flex-wrap h-auto">
          <TabsTrigger value="verde">
            🟢 Verde <Badge className="ml-1">{totais.verde}</Badge>
          </TabsTrigger>
          <TabsTrigger value="amarelo">
            🟡 Alerta{' '}
            <Badge className="ml-1 bg-amber-500">{totais.amarelo}</Badge>
          </TabsTrigger>
          <TabsTrigger value="vermelho">
            🔴 Vencido <Badge className="ml-1 bg-red-500">{totais.vermelho}</Badge>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="verde">
          <ColunaSemaforo
            etiquetas={verde}
            cor="verde"
            onDescartar={setDescarteEtiqueta}
          />
        </TabsContent>
        <TabsContent value="amarelo">
          <ColunaSemaforo
            etiquetas={amarelo}
            cor="amarelo"
            onDescartar={setDescarteEtiqueta}
          />
        </TabsContent>
        <TabsContent value="vermelho">
          <ColunaSemaforo
            etiquetas={vermelho}
            cor="vermelho"
            onDescartar={setDescarteEtiqueta}
          />
        </TabsContent>
      </Tabs>

      {descarteEtiqueta && lojaId && (
        <DescarteDialog
          etiqueta={descarteEtiqueta}
          lojaId={lojaId}
          open={!!descarteEtiqueta}
          onOpenChange={(v) => {
            if (!v) setDescarteEtiqueta(null)
          }}
        />
      )}
    </div>
  )
}
