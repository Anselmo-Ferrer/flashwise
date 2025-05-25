import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");

  if (!userId) {
    return NextResponse.json({ error: "Missing userId" }, { status: 400 });
  }

  try {
    const resumos = await prisma.resumo.findMany({
      where: { userId },
      select: {
        id: true,
        titulo: true,
        flashcards: {
          orderBy: { id: "asc" },
          select: {
            id: true,
            pergunta: true,
            resposta: true,
            nivel: true
          }
        }
      },
      orderBy: { createdAt: "desc" }
    });

    return NextResponse.json({ resumos });
  } catch (error) {
    console.error("Erro ao buscar flashcards agrupados:", error);
    return NextResponse.json({ error: "Erro interno ao buscar flashcards" }, { status: 500 });
  }
}