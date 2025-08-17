-- CreateEnum
CREATE TYPE "public"."Status" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- AlterTable
ALTER TABLE "public"."Evidence" ADD COLUMN     "status" "public"."Status" NOT NULL DEFAULT 'PENDING';

-- AlterTable
ALTER TABLE "public"."Paper" ADD COLUMN     "status" "public"."Status" NOT NULL DEFAULT 'PENDING';

-- AlterTable
ALTER TABLE "public"."User" ADD COLUMN     "lastLogin" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- CreateTable
CREATE TABLE "public"."Audit" (
    "id" SERIAL NOT NULL,
    "decision" BOOLEAN NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "auditorId" INTEGER NOT NULL,
    "paperId" INTEGER,
    "evidenceId" INTEGER,

    CONSTRAINT "Audit_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Audit_auditorId_paperId_key" ON "public"."Audit"("auditorId", "paperId");

-- CreateIndex
CREATE UNIQUE INDEX "Audit_auditorId_evidenceId_key" ON "public"."Audit"("auditorId", "evidenceId");

-- AddForeignKey
ALTER TABLE "public"."Audit" ADD CONSTRAINT "Audit_auditorId_fkey" FOREIGN KEY ("auditorId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Audit" ADD CONSTRAINT "Audit_paperId_fkey" FOREIGN KEY ("paperId") REFERENCES "public"."Paper"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Audit" ADD CONSTRAINT "Audit_evidenceId_fkey" FOREIGN KEY ("evidenceId") REFERENCES "public"."Evidence"("id") ON DELETE SET NULL ON UPDATE CASCADE;
