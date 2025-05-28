-- AlterTable
ALTER TABLE "Resumo" ADD COLUMN     "estrutura" JSONB NOT NULL DEFAULT '{}',
ADD COLUMN     "subtitulo" TEXT;
