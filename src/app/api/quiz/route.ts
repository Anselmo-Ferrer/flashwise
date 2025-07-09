import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");

  if (!userId) {
    return NextResponse.json({ error: "Missing userId" }, { status: 400 });
  }

  try {
    const resumosComPerguntas = await prisma.resumo.findMany({
      where: { userId },
      select: {
        id: true,
        titulo: true,
        perguntas: {
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
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json({ resumos: resumosComPerguntas });
  } catch (error) {
    console.error("Erro ao buscar quiz por usuário:", error);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}