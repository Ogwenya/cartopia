/*
  Warnings:

  - You are about to drop the column `county` on the `Customer` table. All the data in the column will be lost.
  - You are about to drop the column `location` on the `Customer` table. All the data in the column will be lost.
  - Added the required column `password` to the `Customer` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Customer` DROP COLUMN `county`,
    DROP COLUMN `location`,
    ADD COLUMN `password` VARCHAR(191) NOT NULL,
    ADD COLUMN `password_reset_token` VARCHAR(191) NULL,
    ADD COLUMN `password_reset_token_expiry` DATETIME(3) NULL;
