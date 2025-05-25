import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get('userId')

  if (!userId) {
    return NextResponse.json({ error: 'Missing userId' }, { status: 400})
  }

  try {
    const summary = await prisma.resumo.findMany({
      where: { userId },
      select: {
        id: true,
        titulo: true,
        perguntas: {
          orderBy: { id: "asc" },
          select: {
            id: true,
            enunciado: true,
            alternativaA:true,
            alternativaB: true,
            alternativaC: true,
            alternativaD: true,
            correta: true,
            explicacao: true,
          }
        }
      },
      orderBy: { createdAt: "desc"}
    })

    return NextResponse.json({ summary })
  } catch (error) {
    console.error("Erro ao buscar flashcards agrupados:", error);
    return NextResponse.json({ error: "Erro interno ao buscar flashcards" }, { status: 500 });
  }
}