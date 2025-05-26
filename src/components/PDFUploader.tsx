import { useState, useRef } from "react"
import { IoCloudUploadOutline } from "react-icons/io5";
import { FaRegFilePdf } from "react-icons/fa6";
import { LuTrash2 } from "react-icons/lu";

type Props = {
  onFileSelect: (file: File) => void
}

export default function PDFuploader({ onFileSelect }: Props) {
  const [fileName, setFileName] = useState('');
  const [fileSize, setFileSize] = useState(0);
  const [dragActive, setDragActive] = useState(false);

  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleFile = (file: File) => {
    if (file && file.type === 'application/pdf') {
      setFileName(file.name);
      setFileSize(file.size);
      onFileSelect(file);
    } else {
      alert('Por favor, selecione um arquivo PDF válido!');
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  };

  const handleRemoveFile = () => {
    setFileName('');
    setFileSize(0);
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  return (
    <div className="w-full">
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`w-full cursor-pointer border-2 border-dashed rounded-xl p-6 flex flex-col items-center gap-2 transition-colors duration-200 ease-in-out 
          ${dragActive ? 'bg-purple-100 border-purple-400' : 'border-[#CBD0DC]'}
        `}
      >
        <label htmlFor="pdf-upload" className="cursor-pointer w-full flex flex-col items-center gap-2">
          <IoCloudUploadOutline size={40} color="#7D7D7D" />
          <span className="text-black font-medium text-[16px]">
            Choose a file or drag & drop it here
          </span>
          <span className="text-[#A9ACB4] font-medium text-[10px]">
            JPEG, PNG, PDG, and MP4 formats, up to 50MB
          </span>
          <div className="border-[#CBD0DC] border-2 py-2 px-4 rounded-2xl cursor-pointer">
            <span className="text-black font-medium text-[16px]">Browse File</span>
          </div>
          <input
            ref={inputRef}
            id="pdf-upload"
            type="file"
            accept="application/pdf"
            onChange={handleFileChange}
            className="hidden"
          />
        </label>
      </div>
    
    {fileName && (
      <div className="w-full mt-5 p-3 rounded-xl bg-[#EEF1F7] flex items-center gap-4">
        <FaRegFilePdf size={35} color="#CBD0DC"/>
        <div className="flex flex-col w-full">
          <div className="w-full flex items-center justify-between">
            <span className="text-black font-medium text-[14px]">{fileName}</span>
            <button
              onClick={handleRemoveFile}
              className="text-red-600 cursor-pointer font-semibold text-sm hover:underline"
            >
              <LuTrash2 color="#292D32"/>
            </button>
          </div>
          <p className="text-[#A9ACB4] text-[12px]">{(fileSize / 1024 / 1024).toFixed(2)} MB</p>
        </div>
      </div>
    )}
    </div>
  );
}