// src/controller/pembelian-controller.js

import pembelianService from "../service/pembelian-service.js";

// Controller untuk membuat transaksi pembelian baru
const createPembelian = async (req, res, next) => {
  try {
    const user = req.user;
    const result = await pembelianService.createPembelian(user, req.body);
    res.status(result.status).json(result);
  } catch (e) {
    next(e);
  }
};

// Controller untuk menambahkan detail pembelian
const addDetailPembelian = async (req, res, next) => {
  try {
    const user = req.user;
    const id_pembelian = req.params.id_pembelian;
    const result = await pembelianService.addDetailPembelian(
      user,
      id_pembelian,
      req.body
    );
    res.status(result.status).json(result);
  } catch (e) {
    next(e);
  }
};

// Controller untuk menyelesaikan transaksi pembelian
const completePembelian = async (req, res, next) => {
  try {
    const user = req.user;
    const id_pembelian = req.params.id_pembelian;
    const result = await pembelianService.completePembelian(user, id_pembelian);
    res.status(result.status).json(result);
  } catch (e) {
    next(e);
  }
};

// Controller untuk mendapatkan total pembelian yang selesai oleh nasabah
const getTotalPembelianCompletedByNasabah = async (req, res, next) => {
  try {
    const { id_nasabah } = req.params;
    const result = await pembelianService.getTotalPembelianCompletedByNasabah(
      parseInt(id_nasabah, 10)
    );
    res.status(result.status).json(result);
  } catch (e) {
    next(e);
  }
};

const getDaftarPembelianCompletedByBankSampah = async (req, res, next) => {
  try {
    const { id_bank_sampah } = req.params;
    const { month, year } = req.query; // Mendapatkan month dan year dari query parameter

    const result =
      await pembelianService.getDaftarPembelianCompletedByBankSampah(
        parseInt(id_bank_sampah, 10),
        parseInt(month),
        parseInt(year)
      );

    res.status(result.status).json(result);
  } catch (e) {
    next(e);
  }
};

// Controller untuk mendapatkan daftar pembelian yang selesai oleh nasabah
const getPembelianCompletedByNasabah = async (req, res, next) => {
  try {
    const { id_nasabah } = req.params;
    const result = await pembelianService.getPembelianCompletedByNasabah(
      parseInt(id_nasabah, 10)
    );
    res.status(result.status).json(result);
  } catch (e) {
    next(e);
  }
};

// Controller untuk mendapatkan detail pembelian berdasarkan ID Pembelian
const getDetailPembelianById = async (req, res, next) => {
  try {
    const { id_pembelian } = req.params;
    const result = await pembelianService.getDetailPembelianById(
      parseInt(id_pembelian, 10)
    );
    res.status(result.status).json(result);
  } catch (e) {
    next(e);
  }
};

// Controller untuk menghapus pembelian beserta detailnya
const deletePembelian = async (req, res, next) => {
  try {
    const user = req.user;
    const { id_pembelian } = req.params;
    const result = await pembelianService.deletePembelian(user, id_pembelian);
    res.status(result.status).json(result);
  } catch (e) {
    next(e);
  }
};

const getCombinedPembelianById = async (req, res, next) => {
  try {
    const { id_pembelian } = req.params;
    const result = await pembelianService.getCombinedPembelianById(
      parseInt(id_pembelian, 10)
    );
    res.status(result.status).json({
      status: result.status,
      message: result.message,
      data: result.data,
    });
  } catch (e) {
    res.status(500).json({
      status: 500,
      message: "Internal server error",
      data: null,
    });
  }
};

export default {
  createPembelian,
  addDetailPembelian,
  completePembelian,
  getTotalPembelianCompletedByNasabah,
  getPembelianCompletedByNasabah,
  getDetailPembelianById,
  deletePembelian,
  getCombinedPembelianById,
  getDaftarPembelianCompletedByBankSampah,
};
