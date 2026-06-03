import { type Control, useWatch } from 'react-hook-form'
import type { InsumoFormValues } from '@/components/catalogo/InsumoFormDialog'
import type { EstadoConservacao } from '@/lib/types'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import {
  FormControl,
  FormField,
  FormItem,
} from '@/components/ui/form'
import { cn } from '@/lib/utils'

const ESTADOS: { estado: EstadoConservacao; label: string }[] = [
  { estado: 'FECHADO', label: 'Fechado' },
  { estado: 'ABERTO', label: 'Aberto' },
  { estado: 'MANIPULADO', label: 'Manipulado' },
]

interface Props {
  control: Control<InsumoFormValues>
}

export function RegrasValidade({ control }: Props) {
  return (
    <div className="space-y-3">
      <p className="text-sm font-medium">Regras de validade</p>
      <div className="space-y-2">
        {ESTADOS.map((item, index) => (
          <RegraLinha
            key={item.estado}
            control={control}
            index={index}
            label={item.label}
          />
        ))}
      </div>
    </div>
  )
}

function RegraLinha({
  control,
  index,
  label,
}: {
  control: Control<InsumoFormValues>
  index: number
  label: string
}) {
  const ativo = useWatch({ control, name: `regras.${index}.ativo` })

  return (
    <div
      className={cn(
        'grid grid-cols-[auto_1fr_5rem_7rem] items-center gap-3 rounded-md border p-3',
        !ativo && 'opacity-50',
      )}
    >
      <FormField
        control={control}
        name={`regras.${index}.ativo`}
        render={({ field }) => (
          <FormItem>
            <FormControl>
              <Switch checked={field.value} onCheckedChange={field.onChange} />
            </FormControl>
          </FormItem>
        )}
      />
      <span className="text-sm font-medium">{label}</span>
      <FormField
        control={control}
        name={`regras.${index}.duracao`}
        render={({ field }) => (
          <FormItem>
            <FormControl>
              <Input
                type="number"
                min={1}
                disabled={!ativo}
                value={field.value ?? ''}
                onChange={(e) =>
                  field.onChange(e.target.value ? Number(e.target.value) : undefined)
                }
              />
            </FormControl>
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name={`regras.${index}.unidade`}
        render={({ field }) => (
          <FormItem>
            <Select
              value={field.value}
              onValueChange={field.onChange}
              disabled={!ativo}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="HORAS">Horas</SelectItem>
                <SelectItem value="DIAS">Dias</SelectItem>
              </SelectContent>
            </Select>
          </FormItem>
        )}
      />
    </div>
  )
}
