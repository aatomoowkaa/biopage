SET FOREIGN_KEY_CHECKS = 0;

-- CreateTable
CREATE TABLE `User` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NULL,
    `email` VARCHAR(191) NULL,
    `emailVerified` DATETIME(3) NULL,
    `image` VARCHAR(191) NULL,

    UNIQUE INDEX `User_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Account` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `type` VARCHAR(191) NOT NULL,
    `provider` VARCHAR(191) NOT NULL,
    `providerAccountId` VARCHAR(191) NOT NULL,
    `refresh_token` VARCHAR(191) NULL,
    `access_token` VARCHAR(1100) NULL,
    `expires_at` INTEGER NULL,
    `token_type` VARCHAR(191) NULL,
    `scope` VARCHAR(191) NULL,
    `id_token` TEXT NULL,
    `session_state` VARCHAR(191) NULL,

    UNIQUE INDEX `Account_provider_providerAccountId_key`(`provider`, `providerAccountId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Session` (
    `id` VARCHAR(191) NOT NULL,
    `sessionToken` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `expires` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Session_sessionToken_key`(`sessionToken`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `VerificationToken` (
    `identifier` VARCHAR(191) NOT NULL,
    `token` VARCHAR(191) NOT NULL,
    `expires` DATETIME(3) NOT NULL,

    UNIQUE INDEX `VerificationToken_token_key`(`token`),
    UNIQUE INDEX `VerificationToken_identifier_token_key`(`identifier`, `token`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `BioPage` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `username` VARCHAR(191) NOT NULL,
    `displayName` VARCHAR(191) NULL,
    `description` TEXT NULL,
    `avatarUrl` VARCHAR(191) NULL,
    `bannerUrl` VARCHAR(191) NULL,
    `themeColor` VARCHAR(191) NOT NULL DEFAULT '#7289da',
    `textColor` VARCHAR(191) NOT NULL DEFAULT '#ffffff',
    `bgColor` VARCHAR(191) NOT NULL DEFAULT '#0f0f0f',
    `fontFamily` VARCHAR(191) NOT NULL DEFAULT 'Inter',
    `backgroundEffect` VARCHAR(191) NOT NULL DEFAULT 'none',
    `backgroundVideoUrl` VARCHAR(191) NULL,
    `showDiscordPresence` BOOLEAN NOT NULL DEFAULT false,
    `musicUrl` VARCHAR(191) NULL,
    `cursorUrl` VARCHAR(191) NULL,
    `socialLinks` TEXT NOT NULL DEFAULT '[]',
    `views` INTEGER NOT NULL DEFAULT 0,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `BioPage_userId_key`(`userId`),
    UNIQUE INDEX `BioPage_username_key`(`username`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Account` ADD CONSTRAINT `Account_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Session` ADD CONSTRAINT `Session_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `BioPage` ADD CONSTRAINT `BioPage_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- Data for User
INSERT INTO `User` (`id`, `name`, `email`, `emailVerified`, `image`) VALUES ('cmn1zu8540000umis8h49ix7q', 'atomówka', 'mccolor72@gmail.com', NULL, 'https://cdn.discordapp.com/avatars/1412034112646152192/9bfd6da0dc8f552be29f8c83ef57a0ef.png');

-- Data for Account
INSERT INTO `Account` (`id`, `userId`, `type`, `provider`, `providerAccountId`, `refresh_token`, `access_token`, `expires_at`, `token_type`, `scope`, `id_token`, `session_state`) VALUES ('cmn1zu85b0002umisih08pgrz', 'cmn1zu8540000umis8h49ix7q', 'oauth', 'discord', '1412034112646152192', '3wLI8kaYi3N6MxgoG8Rrl43AHdoY2O', 'MTQ0MDk4MTIwMzcwNzc2MDcxNA.vJPnESuWjOgkweYNRXD63bIhr5K8n5', 1774803066, 'bearer', 'email identify applications.commands', NULL, NULL);

-- Data for Session
INSERT INTO `Session` (`id`, `sessionToken`, `userId`, `expires`) VALUES ('cmn1zu85g0004umis6s6i2ef6', '4c44c28c-4ebe-4e2e-9920-24ff32f18615', 'cmn1zu8540000umis8h49ix7q', '2026-04-21 16:51:06');
INSERT INTO `Session` (`id`, `sessionToken`, `userId`, `expires`) VALUES ('cmn21535c0001um1wpqazk0m6', '4e6096bb-108c-499f-b0ed-aafcf663b5d9', 'cmn1zu8540000umis8h49ix7q', '2026-04-21 17:27:33');

-- Data for BioPage
INSERT INTO `BioPage` (`id`, `userId`, `username`, `displayName`, `description`, `avatarUrl`, `bannerUrl`, `themeColor`, `textColor`, `bgColor`, `fontFamily`, `backgroundEffect`, `backgroundVideoUrl`, `showDiscordPresence`, `musicUrl`, `cursorUrl`, `socialLinks`, `views`, `createdAt`, `updatedAt`) VALUES ('cmn1zukk80006umisacxfwk7l', 'cmn1zu8540000umis8h49ix7q', 'atomowka', 'atomowka', 'GOAT CO STWORZYŁ BIOPAGE.LOL', 'https://cdn.discordapp.com/avatars/1412034112646152192/9bfd6da0dc8f552be29f8c83ef57a0ef.png', NULL, '#f400ff', '#ffffff', '#0f0f0f', 'Inter', 'matrix', '/uploads/5db768d7-2bbb-4ae8-863a-37bc0b2e535c.mp4', true, 'https://multiversemc.pl/stereo/songs/sc_1774199575_913.mp3', NULL, '[{"platform":"twitter","url":"twitter.com/test"},{"platform":"github","url":"github.com/anonimovy"},{"platform":"discord","url":"discord.gg/cwel"}]', 11, '2026-03-22 16:51:22', '2026-03-22 19:40:36');

SET FOREIGN_KEY_CHECKS = 1;
