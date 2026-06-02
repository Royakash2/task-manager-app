/*
  Warnings:

  - The `status` column on the `Task` table contains enum values that need to be migrated.
  - The `position` column on the `Task` table changed from nullable to required.
  - Added the `deletedAt` column to the `Task` table.
  - Added the `taskId` column to the `Comment` table.
  - Changed the index on the `Project` table.

*/

-- AlterEnum for TaskStatus
BEGIN;
CREATE TYPE "TaskStatus_new" AS ENUM ('BACKLOG', 'BLOCKED', 'COMPLETED', 'IN_PROGRESS', 'IN_REVIEW', 'TODO');
ALTER TABLE "Task" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "Task" ALTER COLUMN "status" TYPE "TaskStatus_new" USING ("status"::text::"TaskStatus_new");
ALTER TABLE "Task" ALTER COLUMN "status" SET DEFAULT 'TODO';
DROP TYPE "TaskStatus";
ALTER TYPE "TaskStatus_new" RENAME TO "TaskStatus";
COMMIT;

-- AlterTable for Comment
ALTER TABLE "Comment" ADD COLUMN "taskId" TEXT;

-- CreateIndex for Comment
CREATE INDEX "Comment_taskId_idx" ON "Comment"("taskId");

-- AddForeignKey for Comment
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "Task"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AlterTable for Project (drop unique, add non-unique index)
DROP INDEX IF EXISTS "Project_workspaceId_key";
CREATE INDEX "Project_workspaceId_idx" ON "Project"("workspaceId");

-- AlterTable for Task
ALTER TABLE "Task" ADD COLUMN "deletedAt" TIMESTAMP(3);
ALTER TABLE "Task" ALTER COLUMN "status" SET DEFAULT 'TODO';
ALTER TABLE "Task" ALTER COLUMN "position" SET NOT NULL;
