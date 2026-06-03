import type { EtiquetaSemaforo } from '@/lib/types'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

const BORDA: Record<'verde' | 'amarelo' | 'vermelho', string> = {
  verde: 'border-l-green-500',
  amarelo: 'border-l-amber-500',
  vermelho: 'border-l-red-500',
}

export function formatarTempo(dataValidade: string): string {
  const diff = new Date(dataValidade).getTime() - Date.now()
  const abs = Math.abs(diff)
  const prefix = diff > 0 ? 'Vence em' : 'Venceu há'
  if (abs < 3_600_000) return `${prefix} ${Math.round(abs / 60_000)} min`
  if (abs < 86_400_000) return `${prefix} ${Math.round(abs / 3_600_000)}h`
  return `${prefix} ${Math.round(abs / 86_400_000)}d`
}

function formatarManipulado(dataInicio: string): string {
  const d = new Date(dataInicio)
  const data = d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })
  const hora = d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
  return `Manipulado: ${data} às ${hora}`
}

interface Props {
  etiqueta: EtiquetaSemaforo
  cor: 'verde' | 'amarelo' | 'vermelho'
  onDescartar: (e: EtiquetaSemaforo) => void
}

export function EtiquetaCard({ etiqueta, cor, onDescartar }: Props) {
  return (
    <div
      className={cn(
        'bg-card rounded-lg border-l-4 p-4 shadow-sm',
        BORDA[cor],
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <p className="font-medium">{etiqueta.insumo.nome}</p>
        <Badge variant="outline" className="shrink-0 text-xs">
          {etiqueta.estado}
        </Badge>
      </div>
      <p className="mt-1 text-sm text-muted-foreground">
        {formatarTempo(etiqueta.dataValidade)}
      </p>
      <p className="text-sm text-muted-foreground">
        {formatarManipulado(etiqueta.dataInicio)}
      </p>
      <div className="mt-3 flex justify-end">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onDescartar(etiqueta)}
        >
          Descartar
        </Button>
      </div>
    </div>
  )
}
