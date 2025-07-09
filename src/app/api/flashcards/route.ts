import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");

  if (!userId) {
    return NextResponse.json({ error: "Missing userId" }, { status: 400 });
  }

  try {
    const resumosComFlashcards = await prisma.resumo.findMany({
      where: { userId },
      select: {
        id: true,
        titulo: true,
        flashcards: {
          select: {
            id: true,
            pergunta: true,
            resposta: true,
            nivel: true,
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json({ resumos: resumosComFlashcards });
  } catch (error) {
    console.error("Erro ao buscar flashcards por usuário:", error);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}