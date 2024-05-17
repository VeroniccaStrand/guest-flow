/*
  Warnings:

  - The `company_logo` column on the `Visit` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
BEGIN TRY

BEGIN TRAN;

-- AlterTable
ALTER TABLE [dbo].[Visit] DROP COLUMN [company_logo];
ALTER TABLE [dbo].[Visit] ADD [company_logo] VARBINARY(max);

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
