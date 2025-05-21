import { useState } from "react"

type Props = {
  onFileSelect: (file: File) => void
}

export default function PDFuploader({ onFileSelect }: Props) {
  const [fileName, setFileName] = useState('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type == 'application/pdf') {
      setFileName(file.name);
      onFileSelect(file)
    } else {
      alert('Please, select a valid PDF file!')
    }
  }

  return (
    <div className="w-full max-w-sm space-y-2">
      <label className="block text-sm font-medium">Enviar PDF</label>
      <input
        type="file"
        accept="application/pdf"
        onChange={handleFileChange}
        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4
          file:rounded file:border-0 file:text-sm file:font-semibold
          file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100"
      />
      {fileName && <p className="text-xs text-gray-600">Selecionado: {fileName}</p>}
    </div>
  )
}