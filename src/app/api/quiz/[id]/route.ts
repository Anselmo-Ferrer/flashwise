import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id: resumoId } = await context.params;


  if (!resumoId) {
    return NextResponse.json({ error: 'Missing userId' }, { status: 400})
  }

  try {
    const perguntas = await prisma.pergunta.findMany({
      where: { resumoId },
      orderBy: { id: "asc" },
      select: {
        id: true,
        enunciado: true,
        alternativaA: true,
        alternativaB: true,
        alternativaC: true,
        alternativaD: true,
        correta: true,
        explicacao: true,
        nivel: true
      }
    })

    return NextResponse.json({ perguntas })
  } catch (error) {
    console.error("Erro ao buscar flashcards agrupados:", error);
    return NextResponse.json({ error: "Erro interno ao buscar flashcards" }, { status: 500 });
  }
}