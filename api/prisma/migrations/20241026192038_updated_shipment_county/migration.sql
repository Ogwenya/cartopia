/*
  Warnings:

  - You are about to drop the column `mpesa_number` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `location` on the `ShippingAddress` table. All the data in the column will be lost.
  - You are about to drop the `ShipmentLocation` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `area` to the `ShippingAddress` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `ShippingAddress` table without a default value. This is not possible if the table is not empty.
  - Added the required column `phone_number` to the `ShippingAddress` table without a default value. This is not possible if the table is not empty.
  - Added the required column `town` to the `ShippingAddress` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `ShipmentLocation` DROP FOREIGN KEY `ShipmentLocation_countyId_fkey`;

-- AlterTable
ALTER TABLE `Order` DROP COLUMN `mpesa_number`;

-- AlterTable
ALTER TABLE `ShipmentCounty` ADD COLUMN `active` BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE `ShippingAddress` DROP COLUMN `location`,
    ADD COLUMN `area` VARCHAR(191) NOT NULL,
    ADD COLUMN `name` VARCHAR(191) NOT NULL,
    ADD COLUMN `phone_number` VARCHAR(191) NOT NULL,
    ADD COLUMN `town` VARCHAR(191) NOT NULL;

-- DropTable
DROP TABLE `ShipmentLocation`;

-- CreateTable
CREATE TABLE `ShipmentTowns` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `countyId` INTEGER NOT NULL,
    `active` BOOLEAN NOT NULL DEFAULT true,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ShipmentArea` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `fees` DOUBLE NOT NULL,
    `townId` INTEGER NOT NULL,
    `active` BOOLEAN NOT NULL DEFAULT true,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `ShipmentTowns` ADD CONSTRAINT `ShipmentTowns_countyId_fkey` FOREIGN KEY (`countyId`) REFERENCES `ShipmentCounty`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ShipmentArea` ADD CONSTRAINT `ShipmentArea_townId_fkey` FOREIGN KEY (`townId`) REFERENCES `ShipmentTowns`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
