import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { RegrasValidade } from '@/components/catalogo/RegrasValidade'
import {
  useAtualizarRegras,
  useCreateInsumo,
  useUpdateInsumo,
} from '@/hooks/useCatalogo'
import type { EstadoConservacao, GrupoInsumo, Insumo } from '@/lib/types'
import { ApiError } from '@/lib/api'
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
import { Separator } from '@/components/ui/separator'
import { Switch } from '@/components/ui/switch'

const ESTADOS: EstadoConservacao[] = ['FECHADO', 'ABERTO', 'MANIPULADO']

export const insumoSchema = z.object({
  nome: z.string().min(2).max(150),
  unidadeMedida: z.string().min(1, 'Obrigatório').max(20),
  grupoId: z.string().uuid().optional().or(z.literal('')),
  codigoBarras: z.string().optional(),
  controlado: z.boolean().default(false),
  regras: z.array(
    z.object({
      estado: z.enum(['FECHADO', 'ABERTO', 'MANIPULADO']),
      ativo: z.boolean(),
      duracao: z.number().int().positive().optional(),
      unidade: z.enum(['HORAS', 'DIAS']).default('DIAS'),
    }),
  ),
})

export type InsumoFormValues = z.infer<typeof insumoSchema>

function buildDefaultRegras(insumo?: Insumo) {
  return ESTADOS.map((estado) => {
    const existente = insumo?.regras.find((r) => r.estado === estado)
    return {
      estado,
      ativo: !!existente,
      duracao: existente?.duracao ?? 1,
      unidade: existente?.unidade ?? ('DIAS' as const),
    }
  })
}

function buildDefaultValues(insumo?: Insumo): InsumoFormValues {
  return {
    nome: insumo?.nome ?? '',
    unidadeMedida: insumo?.unidadeMedida ?? '',
    grupoId: insumo?.grupoId ?? '',
    codigoBarras: insumo?.codigoBarras ?? '',
    controlado: insumo?.controlado ?? false,
    regras: buildDefaultRegras(insumo),
  }
}

interface Props {
  open: boolean
  onOpenChange: (v: boolean) => void
  insumo?: Insumo
  grupos: GrupoInsumo[]
}

export function InsumoFormDialog({ open, onOpenChange, insumo, grupos }: Props) {
  const createInsumo = useCreateInsumo()
  const updateInsumo = useUpdateInsumo()
  const atualizarRegras = useAtualizarRegras()

  const form = useForm<InsumoFormValues>({
    resolver: zodResolver(insumoSchema),
    defaultValues: buildDefaultValues(insumo),
  })

  useEffect(() => {
    if (open) {
      form.reset(buildDefaultValues(insumo))
    }
  }, [open, insumo, form])

  const isPending =
    createInsumo.isPending || updateInsumo.isPending || atualizarRegras.isPending

  async function onSubmit(data: InsumoFormValues) {
    const camposInsumo = {
      nome: data.nome,
      unidadeMedida: data.unidadeMedida,
      grupoId: data.grupoId || undefined,
      codigoBarras: data.codigoBarras || undefined,
      controlado: data.controlado,
    }

    try {
      let insumoId = insumo?.id

      if (insumoId) {
        await updateInsumo.mutateAsync({ id: insumoId, ...camposInsumo })
      } else {
        const criado = await createInsumo.mutateAsync(camposInsumo)
        insumoId = criado.id
      }

      const regrasAtivas = data.regras
        .filter((r) => r.ativo && r.duracao)
        .map(({ estado, duracao, unidade }) => ({
          estado,
          duracao: duracao!,
          unidade,
        }))

      await atualizarRegras.mutateAsync({ insumoId, regras: regrasAtivas })

      toast.success(insumo ? 'Insumo atualizado' : 'Insumo criado')
      onOpenChange(false)
    } catch (err) {
      toast.error(
        err instanceof ApiError
          ? err.message
          : err instanceof Error
            ? err.message
            : 'Erro ao salvar insumo',
      )
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{insumo ? 'Editar insumo' : 'Novo insumo'}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="nome"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: Filé mignon" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="unidadeMedida"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Unidade de medida</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: kg, un, L" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="grupoId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Grupo</FormLabel>
                  <Select
                    value={field.value || 'none'}
                    onValueChange={(v) => field.onChange(v === 'none' ? '' : v)}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o grupo" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="none">Sem grupo</SelectItem>
                      {grupos.map((g) => (
                        <SelectItem key={g.id} value={g.id}>
                          {g.nome}
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
              name="codigoBarras"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Código de barras</FormLabel>
                  <FormControl>
                    <Input placeholder="Opcional" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="controlado"
              render={({ field }) => (
                <FormItem className="flex items-center justify-between rounded-md border p-3">
                  <FormLabel className="mt-0">Insumo controlado</FormLabel>
                  <FormControl>
                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                </FormItem>
              )}
            />
            <Separator />
            <RegrasValidade control={form.control} />
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending ? (
                  <>
                    <Loader2 className="animate-spin" />
                    Salvando...
                  </>
                ) : (
                  'Salvar'
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
