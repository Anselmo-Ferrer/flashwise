'use client'

interface SummaryGeneratorProps {
  resumo: string
}

export default function SummaryGenerator({ resumo }: SummaryGeneratorProps) {
  if (!resumo) return null

  return (
    <div className="mt-4 p-4 border rounded bg-gray-100 whitespace-pre-wrap">
      <h2 className="font-bold text-lg mb-2">Resumo:</h2>
      <p className="text-black">{resumo}</p>
    </div>
  )
}