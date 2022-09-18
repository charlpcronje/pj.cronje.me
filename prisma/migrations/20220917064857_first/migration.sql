/*
  Warnings:

  - You are about to drop the column `name` on the `Country` table. All the data in the column will be lost.
  - Added the required column `countryCode` to the `Country` table without a default value. This is not possible if the table is not empty.
  - Added the required column `countryName` to the `Country` table without a default value. This is not possible if the table is not empty.
  - Added the required column `phoneCode` to the `Country` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Country` DROP COLUMN `name`,
    ADD COLUMN `countryCode` VARCHAR(191) NOT NULL,
    ADD COLUMN `countryName` VARCHAR(191) NOT NULL,
    ADD COLUMN `phoneCode` VARCHAR(191) NOT NULL;
