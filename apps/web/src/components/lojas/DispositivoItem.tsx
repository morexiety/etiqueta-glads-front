import type { Dispositivo } from '@/lib/types'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

interface Props {
  dispositivo: Dispositivo
}

export function DispositivoItem({ dispositivo }: Props) {
  const online = dispositivo.status === 'ONLINE'

  return (
    <div className="flex items-center justify-between rounded-md border px-3 py-2">
      <div className="min-w-0">
        <p className="font-medium">{dispositivo.nome}</p>
        <p className="text-xs text-muted-foreground">
          Fila CUPS: {dispositivo.filaCups}
        </p>
      </div>
      <Badge
        className={cn(
          'shrink-0',
          online
            ? 'bg-green-600 hover:bg-green-600'
            : 'bg-muted text-muted-foreground hover:bg-muted',
        )}
      >
        {dispositivo.status}
      </Badge>
    </div>
  )
}
