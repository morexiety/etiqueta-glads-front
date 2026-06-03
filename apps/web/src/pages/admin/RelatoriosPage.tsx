import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { toast } from 'sonner'
import { MotivoBar } from '@/components/relatorios/MotivoBar'
import { Button } from '@/components/ui/button'
import { Spinner } from '@/components/ui/spinner'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { useRelatorio } from '@/hooks/useAdminDashboard'
import { cn } from '@/lib/utils'

function ResumoCard({
  label,
  valor,
  destaque,
}: {
  label: string
  valor: string | number
  destaque?: boolean
}) {
  return (
    <div className="rounded-lg border bg-card p-4 shadow-sm">
      <p className="text-sm text-muted-foreground">{label}</p>
      <p
        className={cn(
          'mt-1 text-2xl font-semibold',
          destaque && 'text-destructive',
        )}
      >
        {valor}
      </p>
    </div>
  )
}

export default function RelatoriosPage() {
  const { lojaId } = useParams<{ lojaId: string }>()

  const hoje = new Date().toISOString().split('T')[0]
  const umMesAtras = new Date(Date.now() - 30 * 86_400_000)
    .toISOString()
    .split('T')[0]

  const [inicio, setInicio] = useState(umMesAtras)
  const [fim, setFim] = useState(hoje)
  const [params, setParams] = useState<{ inicio: string; fim: string } | null>(null)

  const { data, isLoading } = useRelatorio(lojaId!, params)

  function buscar() {
    if (inicio > fim) {
      toast.error('Data início não pode ser maior que fim')
      return
    }
    setParams({
      inicio: `${inicio}T00:00:00.000Z`,
      fim: `${fim}T23:59:59.000Z`,
    })
  }

  return (
    <div>
      <h1 className="mb-6 text-2xl font-semibold">Relatório de Desperdício</h1>

      <div className="mb-6 flex flex-wrap items-end gap-3">
        <div>
          <label className="text-sm font-medium">Início</label>
          <input
            type="date"
            value={inicio}
            onChange={(e) => setInicio(e.target.value)}
            className="mt-1 block rounded-md border px-3 py-2"
          />
        </div>
        <div>
          <label className="text-sm font-medium">Fim</label>
          <input
            type="date"
            value={fim}
            onChange={(e) => setFim(e.target.value)}
            className="mt-1 block rounded-md border px-3 py-2"
          />
        </div>
        <Button onClick={buscar}>Buscar</Button>
      </div>

      {isLoading && <Spinner />}

      {data && (
        <>
          <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
            <ResumoCard label="Etiquetas criadas" valor={data.resumo.totalCriadas} />
            <ResumoCard
              label="Descartadas"
              valor={data.resumo.totalDescartadas}
              destaque
            />
            <ResumoCard
              label="Taxa de desperdício"
              valor={`${data.resumo.taxaDesperdicio}%`}
            />
          </div>

          <h2 className="mb-3 text-lg font-semibold">Por motivo</h2>
          <div className="mb-8 space-y-2">
            {Object.entries(data.porMotivo).map(([motivo, total]) => (
              <MotivoBar
                key={motivo}
                motivo={motivo}
                total={total}
                totalGeral={data.resumo.totalDescartadas}
              />
            ))}
          </div>

          <h2 className="mb-3 text-lg font-semibold">Insumos mais descartados</h2>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>#</TableHead>
                <TableHead>Insumo</TableHead>
                <TableHead className="text-right">Descartes</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.porInsumo.map((item, i) => (
                <TableRow key={item.insumoId}>
                  <TableCell>{i + 1}</TableCell>
                  <TableCell>{item.nome}</TableCell>
                  <TableCell className="text-right">{item.total}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </>
      )}

      {!data && !isLoading && (
        <p className="text-muted-foreground">
          Selecione o período e clique em Buscar.
        </p>
      )}
    </div>
  )
}
