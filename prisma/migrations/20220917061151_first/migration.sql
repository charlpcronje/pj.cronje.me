-- CreateTable
CREATE TABLE `User` (
    `id` VARCHAR(191) NOT NULL,
    `role` ENUM('BASIC', 'EDITOR', 'ADMIN') NOT NULL DEFAULT 'BASIC',
    `referrerId` VARCHAR(191) NULL,
    `firstName` VARCHAR(191) NOT NULL,
    `lastName` VARCHAR(191) NOT NULL,
    `initials` VARCHAR(191) NOT NULL,
    `nickname` VARCHAR(191) NOT NULL,
    `countryId` VARCHAR(191) NOT NULL,
    `address` VARCHAR(191) NOT NULL,
    `aboutMe` VARCHAR(191) NOT NULL,
    `contactNumber` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `status` ENUM('PENDING', 'ACTIVE', 'INACTIVE', 'DELETED') NOT NULL DEFAULT 'PENDING',

    UNIQUE INDEX `User_referrerId_key`(`referrerId`),
    UNIQUE INDEX `User_email_key`(`email`),
    INDEX `User_email_idx`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `PaymentMethod` (
    `id` VARCHAR(191) NOT NULL,
    `type` ENUM('BANK', 'GATEWAY') NOT NULL DEFAULT 'BANK',
    `bankId` VARCHAR(191) NULL,
    `userId` VARCHAR(191) NOT NULL,
    `gatewayId` VARCHAR(191) NULL,
    `account` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `status` ENUM('PENDING', 'ACTIVE', 'INACTIVE', 'DELETED') NOT NULL DEFAULT 'ACTIVE',

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `PaymentGateway` (
    `id` VARCHAR(191) NOT NULL,
    `gateway` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `status` ENUM('PENDING', 'ACTIVE', 'INACTIVE', 'DELETED') NOT NULL DEFAULT 'ACTIVE',

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Bank` (
    `id` VARCHAR(191) NOT NULL,
    `countryId` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `status` ENUM('PENDING', 'ACTIVE', 'INACTIVE', 'DELETED') NOT NULL DEFAULT 'ACTIVE',

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Country` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `status` ENUM('PENDING', 'ACTIVE', 'INACTIVE', 'DELETED') NOT NULL DEFAULT 'ACTIVE',

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `User` ADD CONSTRAINT `User_referrerId_fkey` FOREIGN KEY (`referrerId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `User` ADD CONSTRAINT `User_countryId_fkey` FOREIGN KEY (`countryId`) REFERENCES `Country`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PaymentMethod` ADD CONSTRAINT `PaymentMethod_bankId_fkey` FOREIGN KEY (`bankId`) REFERENCES `Bank`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PaymentMethod` ADD CONSTRAINT `PaymentMethod_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PaymentMethod` ADD CONSTRAINT `PaymentMethod_gatewayId_fkey` FOREIGN KEY (`gatewayId`) REFERENCES `PaymentGateway`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Bank` ADD CONSTRAINT `Bank_countryId_fkey` FOREIGN KEY (`countryId`) REFERENCES `Country`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
