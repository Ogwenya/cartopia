/*
  Warnings:

  - You are about to drop the `ShipmentTowns` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `ShipmentArea` DROP FOREIGN KEY `ShipmentArea_townId_fkey`;

-- DropForeignKey
ALTER TABLE `ShipmentTowns` DROP FOREIGN KEY `ShipmentTowns_countyId_fkey`;

-- DropTable
DROP TABLE `ShipmentTowns`;

-- CreateTable
CREATE TABLE `ShipmentTown` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `countyId` INTEGER NOT NULL,
    `active` BOOLEAN NOT NULL DEFAULT true,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `ShipmentTown` ADD CONSTRAINT `ShipmentTown_countyId_fkey` FOREIGN KEY (`countyId`) REFERENCES `ShipmentCounty`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ShipmentArea` ADD CONSTRAINT `ShipmentArea_townId_fkey` FOREIGN KEY (`townId`) REFERENCES `ShipmentTown`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
