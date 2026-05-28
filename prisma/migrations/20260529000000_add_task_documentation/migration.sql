-- AlterTable
ALTER TABLE "Documentation" ADD COLUMN     "taskId" TEXT NOT NULL,
ALTER COLUMN "content" SET DEFAULT '';

-- CreateIndex
CREATE UNIQUE INDEX "Documentation_taskId_key" ON "Documentation"("taskId");

-- AddForeignKey
ALTER TABLE "Documentation" ADD CONSTRAINT "Documentation_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "Task"("id") ON DELETE CASCADE ON UPDATE CASCADE;
