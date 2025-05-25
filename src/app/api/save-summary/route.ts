import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { titulo, texto, userId } = body;

    if (!titulo || !texto || !userId) {
      return NextResponse.json({error: 'Missing Fields'}, {status: 400})
    }

    const summary = await prisma.resumo.create({
      data : {
        titulo,
        texto,
        userId
      }
    })

    return NextResponse.json({summary}, {status: 201})
  } catch (error) {
    console.error('Error on save summary: ', error)
    return NextResponse.json({error: 'Error on save summary'}, {status: 500})
  }
}