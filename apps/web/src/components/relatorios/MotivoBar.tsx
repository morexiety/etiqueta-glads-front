const LABELS: Record<string, string> = {
  VENCIMENTO: 'Vencimento',
  AVARIA: 'Avaria / Dano',
  SOBRA: 'Sobra',
  USO_TOTAL: 'Uso total',
  OUTRO: 'Outro',
}

interface Props {
  motivo: string
  total: number
  totalGeral: number
}

export function MotivoBar({ motivo, total, totalGeral }: Props) {
  const pct = totalGeral > 0 ? Math.round((total / totalGeral) * 100) : 0
  return (
    <div>
      <div className="mb-1 flex justify-between text-sm">
        <span>{LABELS[motivo] ?? motivo}</span>
        <span>
          {total} ({pct}%)
        </span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-muted">
        <div
          className="h-full rounded-full bg-destructive"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  )
}
