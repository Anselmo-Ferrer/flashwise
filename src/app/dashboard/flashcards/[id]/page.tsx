'use client'

import FlashcardFlip from "@/components/FlashcardFlip"
import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { Skeleton } from "@/components/ui/skeleton";

export default function FlashcardsPage() {
  const { id } = useParams()
  const [flashcards, setFlashcards] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchFlashcards = async () => {

      if (!id) return

      const res = await fetch(`/api/flashcards/${id}`)
      console.log(res)
      const data = await res.json()
      console.log(data)
      setFlashcards(data.flashcards || [])
      setLoading(false)
    }

    fetchFlashcards()
  }, [])

  if (loading) 
    return (
      <div className="flex flex-wrap justify-center w-full h-fit gap-2 p-8">
        <Skeleton className='w-[300px] h-[300px] rounded-xl'/>
        <Skeleton className='w-[300px] h-[300px] rounded-xl'/>
        <Skeleton className='w-[300px] h-[300px] rounded-xl'/>
        <Skeleton className='w-[300px] h-[300px] rounded-xl'/>
        <Skeleton className='w-[300px] h-[300px] rounded-xl'/>
      </div>
    )

  return (
    <div className="w-full h-fit flex flex-col">
      <div className="p-8 flex flex-wrap justify-center gap-2 w-full h-fit ">
        {flashcards.map((flashcard: any, index) => (
          <div key={index}>
              <FlashcardFlip key={flashcard.id} front={flashcard.pergunta} back={flashcard.resposta} />
          </div>
        ))}
      </div>
    </div>
  )
}