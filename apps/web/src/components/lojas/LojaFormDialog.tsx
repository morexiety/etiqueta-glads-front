import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Loader2 } from 'lucide-react'
import { useCreateLoja } from '@/hooks/useAdminDashboard'
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

const lojaSchema = z.object({
  nome: z.string().min(2, 'Mínimo 2 caracteres').max(150),
  endereco: z.string().max(300).optional(),
})

type LojaFormValues = z.infer<typeof lojaSchema>

interface Props {
  open: boolean
  onOpenChange: (v: boolean) => void
}

export function LojaFormDialog({ open, onOpenChange }: Props) {
  const createLoja = useCreateLoja()

  const form = useForm<LojaFormValues>({
    resolver: zodResolver(lojaSchema),
    defaultValues: { nome: '', endereco: '' },
  })

  useEffect(() => {
    if (open) form.reset({ nome: '', endereco: '' })
  }, [open, form])

  function onSubmit(values: LojaFormValues) {
    createLoja.mutate(
      {
        nome: values.nome,
        endereco: values.endereco || undefined,
      },
      { onSuccess: () => onOpenChange(false) },
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Nova loja</DialogTitle>
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
                    <Input placeholder="Ex: Unidade Centro" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="endereco"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Endereço (opcional)</FormLabel>
                  <FormControl>
                    <Input placeholder="Rua, número, cidade" {...field} />
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
              <Button type="submit" disabled={createLoja.isPending}>
                {createLoja.isPending ? (
                  <>
                    <Loader2 className="animate-spin" />
                    Criando...
                  </>
                ) : (
                  'Criar loja'
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
