import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { titulo, subtitulo, texto, estrutura, userId } = body;

    if (!titulo || !subtitulo || !texto || !estrutura || !userId) {
      return NextResponse.json({ error: 'Missing Fields' }, { status: 400 });
    }

    const summary = await prisma.resumo.create({
      data: {
        titulo,
        subtitulo,
        texto,
        estrutura,
        userId,
      },
    });

    return NextResponse.json({ summary }, { status: 201 });
  } catch (error) {
    console.error('Error on save summary: ', error);
    return NextResponse.json({ error: 'Error on save summary' }, { status: 500 });
  }
}