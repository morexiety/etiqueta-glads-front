import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Loader2 } from 'lucide-react'
import { useDescartar } from '@/hooks/useAdminDashboard'
import type { EtiquetaSemaforo } from '@/lib/types'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

const descarteSchema = z
  .object({
    motivo: z.enum(['VENCIMENTO', 'AVARIA', 'SOBRA', 'USO_TOTAL', 'OUTRO']),
    justificativa: z.string().max(500).optional(),
    quantidade: z.string().optional(),
  })
  .refine(
    (d) => d.motivo !== 'OUTRO' || (d.justificativa && d.justificativa.length > 0),
    {
      message: 'Justificativa obrigatória para "Outro"',
      path: ['justificativa'],
    },
  )

type DescarteFormValues = z.infer<typeof descarteSchema>

const MOTIVO_LABELS: Record<string, string> = {
  VENCIMENTO: 'Vencimento',
  AVARIA: 'Avaria / Dano',
  SOBRA: 'Sobra de produção',
  USO_TOTAL: 'Uso total',
  OUTRO: 'Outro',
}

interface Props {
  etiqueta: EtiquetaSemaforo
  lojaId: string
  open: boolean
  onOpenChange: (v: boolean) => void
}

export function DescarteDialog({ etiqueta, lojaId, open, onOpenChange }: Props) {
  const descartar = useDescartar(lojaId)

  const form = useForm<DescarteFormValues>({
    resolver: zodResolver(descarteSchema),
    defaultValues: { motivo: 'VENCIMENTO', justificativa: '', quantidade: '' },
  })

  const motivo = form.watch('motivo')

  useEffect(() => {
    if (open) {
      form.reset({ motivo: 'VENCIMENTO', justificativa: '', quantidade: '' })
    }
  }, [open, form])

  function onSubmit(data: DescarteFormValues) {
    const qtd = data.quantidade?.trim()
    const quantidadeNum = qtd ? Number(qtd) : undefined
    const payload = {
      motivo: data.motivo,
      justificativa: data.justificativa || undefined,
      quantidade:
        quantidadeNum !== undefined && !Number.isNaN(quantidadeNum) && quantidadeNum > 0
          ? quantidadeNum
          : undefined,
    }
    descartar.mutate(
      { etiquetaId: etiqueta.id, ...payload },
      { onSuccess: () => onOpenChange(false) },
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Descartar etiqueta</DialogTitle>
          <p className="text-sm text-muted-foreground">
            {etiqueta.insumo.nome} — {etiqueta.estado}
          </p>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="motivo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Motivo</FormLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {Object.entries(MOTIVO_LABELS).map(([value, label]) => (
                        <SelectItem key={value} value={value}>
                          {label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="justificativa"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Justificativa
                    {motivo === 'OUTRO' && (
                      <span className="text-destructive"> *</span>
                    )}
                  </FormLabel>
                  <FormControl>
                    <textarea
                      className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                      placeholder="Descreva o motivo..."
                      required={motivo === 'OUTRO'}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="quantidade"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Quantidade (opcional)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="any"
                      placeholder="ex: 0.5 kg"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={descartar.isPending}>
                {descartar.isPending ? (
                  <>
                    <Loader2 className="animate-spin" />
                    Descartando...
                  </>
                ) : (
                  'Descartar'
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
