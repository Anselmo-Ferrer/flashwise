'use client'

import { useState } from 'react'

export default function SummaryGenerator({ texto }: { texto: string }) {
  const [loading, setLoading] = useState(false)
  const [resumo, setResumo] = useState('')

  const gerarResumo = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/generate-summary', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ texto }),
      })

      const data = await res.json()

      if (res.ok) {
        setResumo(data.resumo)
      } else {
        alert('Erro: ' + data.error)
      }
    } catch (error) {
      console.error(error)
      alert('Erro ao gerar resumo.')
    }
    setLoading(false)
  }

  return (
    <div className="mt-4 space-y-4">
      <button
        className="bg-purple-600 text-white px-4 py-2 rounded"
        onClick={gerarResumo}
        disabled={loading}
      >
        {loading ? 'Gerando resumo...' : 'Gerar Resumo'}
      </button>

      {resumo && (
        <div className="p-4 border rounded bg-gray-100 whitespace-pre-wrap">
          <h2 className="font-bold text-lg mb-2">Resumo:</h2>
          <p className='text-black'>{resumo}</p>
        </div>
      )}
    </div>
  )
}