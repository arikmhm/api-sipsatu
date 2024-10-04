// src/service/pembelian-service.js

import { prismaClient } from "../app/database.js";
import { ResponseError } from "../error/response-error.js";
import {
  addDetailPembelianValidation,
  createPembelianValidation,
} from "../validation/pembelian-validation.js";
import { validate } from "../validation/validation.js";

// Membuat transaksi pembelian baru
const createPembelian = async (user, request) => {
  validate(createPembelianValidation, request);

  const { id_nasabah, keterangan } = request;

  const nasabah = await prismaClient.nasabah.findUnique({
    where: { id_nasabah },
  });

  if (!nasabah) {
    throw new ResponseError(404, "Nasabah not found");
  }

  const pembelian = await prismaClient.pembelian.create({
    data: {
      id_nasabah: nasabah.id_nasabah,
      id_user: user.id_user,
      keterangan: keterangan || null,
      total: 0,
      status: "Pending",
    },
    select: {
      id_pembelian: true,
    },
  });

  return {
    status: 201,
    message: "Pembelian created successfully",
    data: {
      id_pembelian: pembelian.id_pembelian,
    },
  };
};

// Menambahkan detail pembelian ke transaksi yang sudah dibuat
const addDetailPembelian = async (user, pembelianId, request) => {
  validate(addDetailPembelianValidation, request);

  const { id_sampah, berat } = request;

  const sampah = await prismaClient.sampah.findUnique({
    where: { id_sampah },
  });

  if (!sampah) {
    throw new ResponseError(404, "Sampah not found");
  }

  const pembelianIdInt = parseInt(pembelianId, 10);
  const subtotal = sampah.harga * berat;

  await prismaClient.detailPembelian.create({
    data: {
      id_pembelian: pembelianIdInt,
      id_sampah: sampah.id_sampah,
      berat,
      subtotal,
    },
  });

  await prismaClient.pembelian.update({
    where: { id_pembelian: pembelianIdInt },
    data: {
      total: {
        increment: subtotal,
      },
    },
  });

  return {
    status: 200,
    message: "Detail pembelian added successfully",
    data: {
      id_pembelian: pembelianIdInt,
    },
  };
};

// Menyelesaikan transaksi pembelian
const completePembelian = async (user, id_pembelian) => {
  const pembelianIdInt = parseInt(id_pembelian, 10);

  const pembelian = await prismaClient.pembelian.findUnique({
    where: {
      id_pembelian: pembelianIdInt,
      id_user: user.id_user,
    },
    select: {
      id_pembelian: true,
    },
  });

  if (!pembelian) {
    throw new ResponseError(404, "Pembelian not found or not authorized");
  }

  const total = await prismaClient.detailPembelian.aggregate({
    _sum: {
      subtotal: true,
    },
    where: {
      id_pembelian: pembelian.id_pembelian,
    },
  });

  await prismaClient.pembelian.update({
    where: { id_pembelian: pembelian.id_pembelian },
    data: {
      total: total._sum.subtotal || 0,
      status: "Completed",
    },
  });

  return {
    status: 200,
    message: "Pembelian completed successfully",
    data: {
      id_pembelian: pembelian.id_pembelian,
      status: "Completed",
    },
  };
};

// Mendapatkan daftar pembelian yang selesai oleh nasabah
const getPembelianCompletedByNasabah = async (id_nasabah) => {
  const nasabah = await prismaClient.nasabah.findUnique({
    where: { id_nasabah },
  });

  if (!nasabah) {
    throw new ResponseError(404, "Nasabah not found");
  }

  const pembelianList = await prismaClient.pembelian.findMany({
    where: {
      id_nasabah: id_nasabah,
      status: "Completed",
    },
    select: {
      id_pembelian: true,
      tanggal: true,
      total: true,
      keterangan: true,
    },
  });

  return {
    status: 200,
    message: "Pembelian list retrieved successfully",
    data: pembelianList,
  };
};

// Mendapatkan detail pembelian berdasarkan ID
const getDetailPembelianById = async (id_pembelian) => {
  const pembelian = await prismaClient.pembelian.findUnique({
    where: { id_pembelian },
    select: {
      id_pembelian: true,
      id_nasabah: true,
      nasabah: {
        select: {
          nama: true,
          bank_sampah: {
            select: {
              nama: true,
            },
          },
        },
      },
      tanggal: true,
      total: true,
      keterangan: true,
      detail_pembelian: {
        select: {
          id_detail_pembelian: true,
          id_sampah: true,
          sampah: {
            select: {
              kategori_sampah: true,
              harga: true,
              satuan_sampah: true,
            },
          },
          berat: true,
          subtotal: true,
        },
      },
    },
  });

  if (!pembelian) {
    throw new ResponseError(404, "Pembelian not found");
  }

  return {
    status: 200,
    message: "Pembelian details retrieved successfully",
    data: {
      id_pembelian: pembelian.id_pembelian,
      id_nasabah: pembelian.id_nasabah,
      nama_nasabah: pembelian.nasabah.nama,
      nama_bankSampah: pembelian.nasabah.bank_sampah.nama,
      tanggal: pembelian.tanggal,
      total: pembelian.total,
      keterangan: pembelian.keterangan,
      detail_pembelian: pembelian.detail_pembelian.map((detail) => ({
        id_detail_pembelian: detail.id_detail_pembelian,
        id_sampah: detail.id_sampah,
        kategori_sampah: detail.sampah.kategori_sampah,
        berat: detail.berat,
        subtotal: detail.subtotal,
        harga: detail.sampah.harga,
        satuan_sampah: detail.sampah.satuan_sampah,
      })),
    },
  };
};

// Mendapatkan daftar pembelian yang selesai oleh nasabah
const getTotalPembelianCompletedByNasabah = async (id_nasabah) => {
  const nasabah = await prismaClient.nasabah.findUnique({
    where: { id_nasabah },
  });

  if (!nasabah) {
    throw new ResponseError(404, "Nasabah not found");
  }

  const totalPembelian = await prismaClient.pembelian.aggregate({
    where: {
      id_nasabah: id_nasabah,
      status: "Completed",
    },
    _sum: {
      total: true, // Menghitung jumlah total dari semua pembelian yang selesai
    },
  });

  return {
    status: 200,
    message: "Total pembelian retrieved successfully",
    data: {
      total: totalPembelian._sum.total || 0, // Mengembalikan total, atau 0 jika tidak ada pembelian yang selesai
    },
  };
};

const getDaftarPembelianCompletedByBankSampah = async (
  id_bank_sampah,
  month,
  year
) => {
  const bankSampah = await prismaClient.bankSampah.findUnique({
    where: { id_bank_sampah },
  });

  if (!bankSampah) {
    throw new ResponseError(404, "Bank Sampah not found");
  }

  let whereClause = {
    nasabah: {
      id_bank_sampah: id_bank_sampah,
    },
    status: "Completed",
  };

  // Menambahkan logika pemfilteran jika bulan dan tahun disediakan
  if (month && year) {
    whereClause.tanggal = {
      gte: new Date(year, month - 1, 1), // Bulan di JavaScript dimulai dari 0
      lt: new Date(year, month, 1),
    };
  }

  const pembelianList = await prismaClient.pembelian.findMany({
    where: whereClause,
    select: {
      id_pembelian: true,
      tanggal: true,
      total: true,
      keterangan: true,
      nasabah: {
        select: {
          nama: true,
        },
      },
    },
  });

  return {
    status: 200,
    message: "Daftar pembelian retrieved successfully",
    data: pembelianList,
  };
};

// src/service/pembelian-service.js

const deletePembelian = async (user, id_pembelian) => {
  const pembelianIdInt = parseInt(id_pembelian, 10);

  const pembelian = await prismaClient.pembelian.findUnique({
    where: { id_pembelian: pembelianIdInt, id_user: user.id_user },
  });

  if (!pembelian) {
    throw new ResponseError(404, "Pembelian not found or not authorized");
  }

  // Hapus detail pembelian terlebih dahulu
  await prismaClient.detailPembelian.deleteMany({
    where: { id_pembelian: pembelianIdInt },
  });

  // Hapus pembelian setelah detailnya dihapus
  await prismaClient.pembelian.delete({
    where: { id_pembelian: pembelianIdInt },
  });

  return {
    status: 200,
    message: "Pembelian and its details deleted successfully",
    data: {
      id_pembelian: pembelianIdInt,
    },
  };
};

const getCombinedPembelianById = async (id_pembelian) => {
  try {
    const pembelian = await prismaClient.pembelian.findUnique({
      where: { id_pembelian },
      select: {
        id_pembelian: true,
        id_nasabah: true,
        nasabah: {
          select: {
            nama: true,
            bank_sampah: {
              select: {
                nama: true,
              },
            },
          },
        },
        tanggal: true,
        total: true,
        keterangan: true,
        detail_pembelian: {
          select: {
            id_sampah: true,
            sampah: {
              select: {
                kategori_sampah: true,
                harga: true,
                satuan_sampah: true,
              },
            },
            berat: true,
            subtotal: true,
          },
        },
      },
    });

    if (!pembelian) {
      return {
        status: 404,
        message: "Pembelian not found",
        data: null,
      };
    }

    const combinedDetail = {};
    pembelian.detail_pembelian.forEach((detail) => {
      const id_sampah = detail.id_sampah;
      if (!combinedDetail[id_sampah]) {
        combinedDetail[id_sampah] = {
          id_sampah: id_sampah,
          kategori_sampah: detail.sampah.kategori_sampah,
          harga: detail.sampah.harga,
          satuan_sampah: detail.sampah.satuan_sampah,
          total_berat: 0,
          total_subtotal: 0,
        };
      }
      combinedDetail[id_sampah].total_berat += detail.berat;
      combinedDetail[id_sampah].total_subtotal += detail.subtotal;
    });

    return {
      status: 200,
      message: "Combined pembelian details retrieved successfully",
      data: {
        id_pembelian: pembelian.id_pembelian,
        id_nasabah: pembelian.id_nasabah,
        nama_nasabah: pembelian.nasabah.nama,
        nama_bankSampah: pembelian.nasabah.bank_sampah.nama,
        tanggal: pembelian.tanggal,
        total: pembelian.total,
        keterangan: pembelian.keterangan,
        detail_combined: Object.values(combinedDetail),
      },
    };
  } catch (error) {
    return {
      status: 500,
      message: "Internal server error",
      data: null,
    };
  }
};

export default {
  createPembelian,
  addDetailPembelian,
  completePembelian,
  getPembelianCompletedByNasabah,
  getDetailPembelianById,
  getTotalPembelianCompletedByNasabah,
  deletePembelian,
  getCombinedPembelianById,
  getDaftarPembelianCompletedByBankSampah,
};
