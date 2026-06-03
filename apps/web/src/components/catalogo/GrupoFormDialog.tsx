import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Loader2 } from 'lucide-react'
import {
  useCreateGrupo,
  useGrupos,
  useUpdateGrupo,
} from '@/hooks/useCatalogo'
import type { GrupoInsumo } from '@/lib/types'
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

const grupoSchema = z.object({
  nome: z.string().min(2, 'Mínimo 2 caracteres').max(100),
  paiId: z.string().uuid().optional().or(z.literal('')),
})

type GrupoFormValues = z.infer<typeof grupoSchema>

interface Props {
  open: boolean
  onOpenChange: (v: boolean) => void
  grupo?: GrupoInsumo
}

export function GrupoFormDialog({ open, onOpenChange, grupo }: Props) {
  const { data: grupos = [] } = useGrupos()
  const createGrupo = useCreateGrupo()
  const updateGrupo = useUpdateGrupo()

  const form = useForm<GrupoFormValues>({
    resolver: zodResolver(grupoSchema),
    defaultValues: { nome: '', paiId: '' },
  })

  useEffect(() => {
    if (open) {
      form.reset({
        nome: grupo?.nome ?? '',
        paiId: grupo?.paiId ?? '',
      })
    }
  }, [open, grupo, form])

  const paiOptions = grupos.filter((g) => g.id !== grupo?.id)
  const isPending = createGrupo.isPending || updateGrupo.isPending

  function onSubmit(values: GrupoFormValues) {
    const payload = {
      nome: values.nome,
      paiId: values.paiId || undefined,
    }
    if (grupo) {
      updateGrupo.mutate(
        { id: grupo.id, ...payload },
        { onSuccess: () => onOpenChange(false) },
      )
    } else {
      createGrupo.mutate(payload, { onSuccess: () => onOpenChange(false) })
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{grupo ? 'Editar grupo' : 'Novo grupo'}</DialogTitle>
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
                    <Input placeholder="Ex: Carnes" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="paiId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Grupo pai</FormLabel>
                  <Select
                    value={field.value || 'none'}
                    onValueChange={(v) => field.onChange(v === 'none' ? '' : v)}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o grupo pai" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="none">Nenhum (raiz)</SelectItem>
                      {paiOptions.map((g) => (
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
