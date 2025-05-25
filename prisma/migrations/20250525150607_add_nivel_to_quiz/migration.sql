/*
  Warnings:

  - Added the required column `nivel` to the `Pergunta` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Pergunta" ADD COLUMN     "nivel" TEXT NOT NULL;
