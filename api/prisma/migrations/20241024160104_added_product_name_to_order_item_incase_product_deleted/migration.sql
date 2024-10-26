/*
  Warnings:

  - Added the required column `product_image` to the `OrderItem` table without a default value. This is not possible if the table is not empty.
  - Added the required column `product_name` to the `OrderItem` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `OrderItem` ADD COLUMN `product_image` VARCHAR(191) NOT NULL,
    ADD COLUMN `product_name` VARCHAR(255) NOT NULL;
