/*
  Warnings:

  - Made the column `email` on table `Customer` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `Customer` MODIFY `email` VARCHAR(191) NOT NULL;
