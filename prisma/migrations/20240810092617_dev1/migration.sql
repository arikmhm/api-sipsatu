-- CreateTable
CREATE TABLE `role` (
    `id_role` INTEGER NOT NULL AUTO_INCREMENT,
    `nama_role` VARCHAR(255) NOT NULL,

    PRIMARY KEY (`id_role`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `user` (
    `id_user` INTEGER NOT NULL AUTO_INCREMENT,
    `phone` VARCHAR(255) NOT NULL,
    `password` VARCHAR(255) NOT NULL,
    `token` VARCHAR(255) NULL,
    `id_role` INTEGER NOT NULL,
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME NOT NULL,

    UNIQUE INDEX `user_phone_key`(`phone`),
    PRIMARY KEY (`id_user`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `bank_sampah` (
    `id_bank_sampah` INTEGER NOT NULL AUTO_INCREMENT,
    `id_user` INTEGER NOT NULL,
    `nama` VARCHAR(255) NOT NULL,
    `alamat` VARCHAR(255) NOT NULL,
    `phone` VARCHAR(20) NULL,
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME NOT NULL,

    UNIQUE INDEX `bank_sampah_id_user_key`(`id_user`),
    PRIMARY KEY (`id_bank_sampah`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `nasabah` (
    `id_nasabah` INTEGER NOT NULL AUTO_INCREMENT,
    `id_user` INTEGER NOT NULL,
    `nama` VARCHAR(255) NOT NULL,
    `phone` VARCHAR(20) NULL,
    `alamat` VARCHAR(255) NOT NULL,
    `id_bank_sampah` INTEGER NOT NULL,
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME NOT NULL,

    UNIQUE INDEX `nasabah_id_user_key`(`id_user`),
    PRIMARY KEY (`id_nasabah`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `mitra` (
    `id_mitra` INTEGER NOT NULL AUTO_INCREMENT,
    `nama` VARCHAR(255) NOT NULL,
    `alamat` VARCHAR(255) NOT NULL,
    `no_telpon` VARCHAR(20) NULL,

    PRIMARY KEY (`id_mitra`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `sampah` (
    `id_sampah` INTEGER NOT NULL AUTO_INCREMENT,
    `kategori_sampah` VARCHAR(255) NOT NULL,
    `satuan_sampah` VARCHAR(50) NOT NULL,
    `harga` DOUBLE NOT NULL,
    `tanggal_insert` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `tanggal_update` DATETIME NOT NULL,
    `id_bank_sampah` INTEGER NOT NULL,
    `id_user` INTEGER NOT NULL,

    PRIMARY KEY (`id_sampah`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `produk` (
    `id_produk` INTEGER NOT NULL AUTO_INCREMENT,
    `nama_produk` VARCHAR(255) NOT NULL,
    `gambar` VARCHAR(255) NULL,
    `harga` DOUBLE NOT NULL,
    `tanggal_insert` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `tanggal_update` DATETIME NOT NULL,
    `id_user` INTEGER NOT NULL,

    PRIMARY KEY (`id_produk`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `penjualan` (
    `id_penjualan` INTEGER NOT NULL AUTO_INCREMENT,
    `id_mitra` INTEGER NOT NULL,
    `id_user` INTEGER NOT NULL,
    `tanggal` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `total` DOUBLE NOT NULL,
    `keterangan` VARCHAR(255) NOT NULL,
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME NOT NULL,

    PRIMARY KEY (`id_penjualan`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `pembelian` (
    `id_pembelian` INTEGER NOT NULL AUTO_INCREMENT,
    `id_nasabah` INTEGER NOT NULL,
    `id_user` INTEGER NOT NULL,
    `tanggal` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `total` DOUBLE NOT NULL,
    `keterangan` VARCHAR(255) NOT NULL,
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME NOT NULL,

    PRIMARY KEY (`id_pembelian`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `detail_penjualan` (
    `id_detail_penjualan` INTEGER NOT NULL AUTO_INCREMENT,
    `id_penjualan` INTEGER NOT NULL,
    `id_sampah` INTEGER NOT NULL,
    `berat` DOUBLE NOT NULL,
    `subtotal` DOUBLE NOT NULL,

    PRIMARY KEY (`id_detail_penjualan`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `detail_pembelian` (
    `id_detail_pembelian` INTEGER NOT NULL AUTO_INCREMENT,
    `id_pembelian` INTEGER NOT NULL,
    `id_sampah` INTEGER NOT NULL,
    `berat` DOUBLE NOT NULL,
    `subtotal` DOUBLE NOT NULL,

    PRIMARY KEY (`id_detail_pembelian`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `user` ADD CONSTRAINT `user_id_role_fkey` FOREIGN KEY (`id_role`) REFERENCES `role`(`id_role`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `bank_sampah` ADD CONSTRAINT `bank_sampah_id_user_fkey` FOREIGN KEY (`id_user`) REFERENCES `user`(`id_user`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `nasabah` ADD CONSTRAINT `nasabah_id_user_fkey` FOREIGN KEY (`id_user`) REFERENCES `user`(`id_user`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `nasabah` ADD CONSTRAINT `nasabah_id_bank_sampah_fkey` FOREIGN KEY (`id_bank_sampah`) REFERENCES `bank_sampah`(`id_bank_sampah`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `sampah` ADD CONSTRAINT `sampah_id_bank_sampah_fkey` FOREIGN KEY (`id_bank_sampah`) REFERENCES `bank_sampah`(`id_bank_sampah`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `sampah` ADD CONSTRAINT `sampah_id_user_fkey` FOREIGN KEY (`id_user`) REFERENCES `user`(`id_user`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `produk` ADD CONSTRAINT `produk_id_user_fkey` FOREIGN KEY (`id_user`) REFERENCES `user`(`id_user`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `penjualan` ADD CONSTRAINT `penjualan_id_mitra_fkey` FOREIGN KEY (`id_mitra`) REFERENCES `mitra`(`id_mitra`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `penjualan` ADD CONSTRAINT `penjualan_id_user_fkey` FOREIGN KEY (`id_user`) REFERENCES `user`(`id_user`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `pembelian` ADD CONSTRAINT `pembelian_id_nasabah_fkey` FOREIGN KEY (`id_nasabah`) REFERENCES `nasabah`(`id_nasabah`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `pembelian` ADD CONSTRAINT `pembelian_id_user_fkey` FOREIGN KEY (`id_user`) REFERENCES `user`(`id_user`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `detail_penjualan` ADD CONSTRAINT `detail_penjualan_id_penjualan_fkey` FOREIGN KEY (`id_penjualan`) REFERENCES `penjualan`(`id_penjualan`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `detail_penjualan` ADD CONSTRAINT `detail_penjualan_id_sampah_fkey` FOREIGN KEY (`id_sampah`) REFERENCES `sampah`(`id_sampah`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `detail_pembelian` ADD CONSTRAINT `detail_pembelian_id_pembelian_fkey` FOREIGN KEY (`id_pembelian`) REFERENCES `pembelian`(`id_pembelian`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `detail_pembelian` ADD CONSTRAINT `detail_pembelian_id_sampah_fkey` FOREIGN KEY (`id_sampah`) REFERENCES `sampah`(`id_sampah`) ON DELETE RESTRICT ON UPDATE CASCADE;
