import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Loader2 } from 'lucide-react'
import { useCreateDispositivo } from '@/hooks/useAdminDashboard'
import type { CriarDispositivoResponse } from '@/lib/types'
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

const dispositivoSchema = z.object({
  nome: z.string().min(2, 'Mínimo 2 caracteres').max(100),
  filaCups: z.string().max(50).optional(),
})

type DispositivoFormValues = z.infer<typeof dispositivoSchema>

interface Props {
  lojaId: string
  open: boolean
  onOpenChange: (v: boolean) => void
  onCreated: (res: CriarDispositivoResponse) => void
}

export function DispositivoFormDialog({
  lojaId,
  open,
  onOpenChange,
  onCreated,
}: Props) {
  const createDispositivo = useCreateDispositivo(lojaId)

  const form = useForm<DispositivoFormValues>({
    resolver: zodResolver(dispositivoSchema),
    defaultValues: { nome: '', filaCups: 'zebra' },
  })

  useEffect(() => {
    if (open) form.reset({ nome: '', filaCups: 'zebra' })
  }, [open, form])

  function onSubmit(values: DispositivoFormValues) {
    createDispositivo.mutate(
      {
        nome: values.nome,
        filaCups: values.filaCups || 'zebra',
      },
      {
        onSuccess: (res) => {
          onOpenChange(false)
          onCreated(res)
        },
      },
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Adicionar impressora</DialogTitle>
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
                    <Input placeholder="Ex: Zebra Cozinha" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="filaCups"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Fila CUPS</FormLabel>
                  <FormControl>
                    <Input placeholder="zebra" {...field} />
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
              <Button type="submit" disabled={createDispositivo.isPending}>
                {createDispositivo.isPending ? (
                  <>
                    <Loader2 className="animate-spin" />
                    Criando...
                  </>
                ) : (
                  'Criar dispositivo'
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
