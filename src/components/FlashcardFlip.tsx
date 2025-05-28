import { useState } from 'react'

type Props = {
  front: string
  back: string
}

export default function FlashcardFlip({ front, back }: Props) {
  const [flipped, setFlipped] = useState(false)

  return (
    <div className="perspective w-[300px] h-[200px]" onClick={() => setFlipped(!flipped)}>
      <div className={`relative w-full h-full transition-transform duration-500 transform-style preserve-3d ${flipped ? 'rotate-y-180' : ''}`}>
        {/* Frente */}
        <div className="absolute w-full h-full bg-white border border-gray-300 rounded-xl backface-hidden flex items-center justify-center text-xl font-semibold">
          {front}
        </div>
        {/* Verso */}
        <div className="absolute w-full h-full bg-[#FFF7E8] border border-gray-300 rounded-xl backface-hidden transform rotate-y-180 flex items-center justify-center text-xl text-[#734A00] font-medium">
          {back}
        </div>
      </div>
    </div>
  )
}