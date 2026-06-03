import { useState } from 'react'
import { ChevronLeft } from 'lucide-react'
import { useNavigate, useParams } from 'react-router-dom'
import { DeviceBanner } from '@/components/operacao/DeviceBanner'
import { EstadoSelect } from '@/components/operacao/EstadoSelect'
import { InsumoSearch } from '@/components/operacao/InsumoSearch'
import { PrintConfirm } from '@/components/operacao/PrintConfirm'
import { PrintStatus } from '@/components/operacao/PrintStatus'
import { addRecente } from '@/hooks/useOperacao'
import { useAuth } from '@/hooks/useAuth'
import type { EstadoConservacao, Insumo } from '@/lib/types'

type Step = 'search' | 'estado' | 'confirm' | 'printing'

export default function OperacaoPage() {
  const { lojaId } = useParams<{ lojaId: string }>()
  const auth = useAuth()
  const navigate = useNavigate()

  const [step, setStep] = useState<Step>('search')
  const [insumo, setInsumo] = useState<Insumo | null>(null)
  const [estado, setEstado] = useState<EstadoConservacao | null>(null)
  const [copias, setCopias] = useState(1)
  const [jobId, setJobId] = useState<string | null>(null)
  const [dispositivoId, setDispositivoId] = useState<string | null>(() =>
    localStorage.getItem('selo:dispositivo-id'),
  )

  const headerTitle = {
    search: 'Selecionar produto',
    estado: 'Selecionar estado',
    confirm: 'Confirmar impressão',
    printing: 'Imprimindo...',
  }[step]

  const handleBack = () => {
    if (step === 'estado') setStep('search')
    if (step === 'confirm') setStep('estado')
  }

  const handleInsumoSelect = (i: Insumo) => {
    addRecente(i.id)
    setInsumo(i)
    setEstado(null)
    setStep('estado')
  }

  const handleEstadoSelect = (e: EstadoConservacao) => {
    setEstado(e)
    setStep('confirm')
  }

  const handlePrint = (id: string) => {
    setJobId(id)
    setStep('printing')
  }

  const handleReset = () => {
    setInsumo(null)
    setEstado(null)
    setCopias(1)
    setJobId(null)
    setStep('search')
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="flex items-center justify-between border-b border-zinc-700 p-4">
        <div className="flex items-center gap-3">
          {step !== 'search' && step !== 'printing' && (
            <button
              type="button"
              onClick={handleBack}
              className="p-1 text-zinc-400 hover:text-white"
              aria-label="Voltar"
            >
              <ChevronLeft size={24} />
            </button>
          )}
          <span className="text-lg font-semibold">{headerTitle}</span>
        </div>
        <button
          type="button"
          onClick={() => {
            auth.logout()
            navigate('/login')
          }}
          className="text-sm text-zinc-400 hover:text-white"
        >
          Sair
        </button>
      </header>

      {lojaId && (
        <DeviceBanner
          lojaId={lojaId}
          dispositivoId={dispositivoId}
          onSelect={(id) => {
            setDispositivoId(id)
            localStorage.setItem('selo:dispositivo-id', id)
          }}
        />
      )}

      <main className="flex-1 p-4">
        {step === 'search' && <InsumoSearch onSelect={handleInsumoSelect} />}
        {step === 'estado' && insumo && (
          <EstadoSelect insumo={insumo} onSelect={handleEstadoSelect} />
        )}
        {step === 'confirm' && insumo && estado && lojaId && dispositivoId && (
          <PrintConfirm
            insumo={insumo}
            estado={estado}
            copias={copias}
            lojaId={lojaId}
            dispositivoId={dispositivoId}
            onCopiaChange={setCopias}
            onPrint={handlePrint}
          />
        )}
        {step === 'confirm' && insumo && estado && lojaId && !dispositivoId && (
          <p className="py-8 text-center text-zinc-400">
            Selecione uma impressora no banner acima para continuar.
          </p>
        )}
        {step === 'printing' && (
          <PrintStatus jobId={jobId} onReset={handleReset} />
        )}
      </main>
    </div>
  )
}
