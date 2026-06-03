import { useState } from 'react'
import { AlertTriangle, Copy } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

interface Props {
  open: boolean
  onOpenChange: (v: boolean) => void
  deviceId: string
  secret: string
}

async function copiar(texto: string) {
  await navigator.clipboard.writeText(texto)
  toast.success('Copiado!')
}

export function SecretModal({ open, onOpenChange, deviceId, secret }: Props) {
  const [confirmado, setConfirmado] = useState(false)

  function handleOpenChange(v: boolean) {
    if (!v) setConfirmado(false)
    onOpenChange(v)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent
        className="sm:max-w-lg [&>button]:hidden"
        onInteractOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-amber-600">
            <AlertTriangle className="size-5" />
            Guarde o secret agora
          </DialogTitle>
          <p className="text-sm text-muted-foreground">
            Este código não será exibido novamente.
          </p>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <p className="mb-1 text-sm font-medium">Device ID</p>
            <div className="flex gap-2">
              <code className="flex-1 select-all rounded bg-muted p-2 font-mono text-sm">
                {deviceId}
              </code>
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={() => copiar(deviceId)}
              >
                <Copy className="size-4" />
              </Button>
            </div>
          </div>

          <div>
            <p className="mb-1 text-sm font-medium">Secret</p>
            <div className="flex gap-2">
              <code className="flex-1 select-all break-all rounded bg-muted p-2 font-mono text-sm">
                {secret}
              </code>
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={() => copiar(secret)}
              >
                <Copy className="size-4" />
              </Button>
            </div>
          </div>

          <div className="rounded-md border bg-muted/50 p-3 text-sm">
            <p className="mb-2 font-medium">
              Cole esses valores no /etc/zebra-agent.env do Pi:
            </p>
            <pre className="font-mono text-xs whitespace-pre-wrap">
              {`AGENT_DEVICE_ID=${deviceId}\nAGENT_DEVICE_SECRET=${secret}`}
            </pre>
          </div>

          <label className="flex cursor-pointer items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={confirmado}
              onChange={(e) => setConfirmado(e.target.checked)}
              className="size-4 rounded border"
            />
            Confirmei que salvei o secret
          </label>
        </div>

        <DialogFooter>
          <Button
            disabled={!confirmado}
            onClick={() => handleOpenChange(false)}
          >
            Fechar — já salvei
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
