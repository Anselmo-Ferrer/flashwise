import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const resumoId = searchParams.get("resumoId");

  if (!resumoId) {
    return NextResponse.json({ error: "Missing resumoId" }, { status: 400 });
  }

  try {
    const flashcards = await prisma.flashcard.findMany({
      where: { resumoId },
      orderBy: { id: "asc" },
      select: {
        id: true,
        pergunta: true,
        resposta: true,
        nivel: true,
      },
    });

    return NextResponse.json({ flashcards });
  } catch (error) {
    console.error("Erro ao buscar flashcards:", error);
    return NextResponse.json({ error: "Erro interno ao buscar flashcards" }, { status: 500 });
  }
}