/*
  Warnings:

  - You are about to drop the column `area` on the `ShippingAddress` table. All the data in the column will be lost.
  - You are about to drop the column `county` on the `ShippingAddress` table. All the data in the column will be lost.
  - You are about to drop the column `town` on the `ShippingAddress` table. All the data in the column will be lost.
  - Added the required column `shipmentAreaId` to the `ShippingAddress` table without a default value. This is not possible if the table is not empty.
  - Added the required column `shipmentCountyId` to the `ShippingAddress` table without a default value. This is not possible if the table is not empty.
  - Added the required column `shipmentTownId` to the `ShippingAddress` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `ShippingAddress` DROP COLUMN `area`,
    DROP COLUMN `county`,
    DROP COLUMN `town`,
    ADD COLUMN `shipmentAreaId` INTEGER NOT NULL,
    ADD COLUMN `shipmentCountyId` INTEGER NOT NULL,
    ADD COLUMN `shipmentTownId` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `ShippingAddress` ADD CONSTRAINT `ShippingAddress_shipmentCountyId_fkey` FOREIGN KEY (`shipmentCountyId`) REFERENCES `ShipmentCounty`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ShippingAddress` ADD CONSTRAINT `ShippingAddress_shipmentTownId_fkey` FOREIGN KEY (`shipmentTownId`) REFERENCES `ShipmentTown`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ShippingAddress` ADD CONSTRAINT `ShippingAddress_shipmentAreaId_fkey` FOREIGN KEY (`shipmentAreaId`) REFERENCES `ShipmentArea`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
