/*
  Warnings:

  - You are about to drop the column `welcome_message` on the `Visit` table. All the data in the column will be lost.

*/
BEGIN TRY

BEGIN TRAN;

-- AlterTable
ALTER TABLE [dbo].[Visit] DROP COLUMN [welcome_message];

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
