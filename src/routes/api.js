// src/routes/api.js

import express from "express";
import { authMiddleware } from "../middleware/auth-middleware.js";
import userController from "../controller/user-controller.js";
import sampahController from "../controller/sampah-controller.js";
import pembelianController from "../controller/pembelian-controller.js";

// Inisialisasi router
const userRouter = new express.Router();

// Semua rute dilindungi oleh authMiddleware
userRouter.use(authMiddleware);

/* USER ROUTES */

// Route untuk mendapatkan data nasabah yang sedang login
userRouter.get("/api/nasabah/current", userController.getUserCurrentNasabah);

// Route untuk mendapatkan data bank sampah yang sedang login
userRouter.get(
  "/api/bank-sampah/current",
  userController.getUserCurrentBankSampah
);

/* NASABAH & PEMBELIAN ROUTES */

// Route untuk mendapatkan pembelian yang selesai oleh nasabah
userRouter.get(
  "/api/nasabah/:id_nasabah/pembelian/completed",
  pembelianController.getPembelianCompletedByNasabah
);

// Route untuk mendapatkan total pembelian yang selesai oleh nasabah
userRouter.get(
  "/api/nasabah/:id_nasabah/pembelian/completed/total",
  pembelianController.getTotalPembelianCompletedByNasabah
);

/* PEMBELIAN ROUTES */

// Route untuk membuat pembelian baru
userRouter.post("/api/pembelian", pembelianController.createPembelian);

// Route untuk menambahkan detail ke pembelian
userRouter.post(
  "/api/pembelian/:id_pembelian/details",
  pembelianController.addDetailPembelian
);

// Route untuk menyelesaikan pembelian
userRouter.post(
  "/api/pembelian/:id_pembelian/complete",
  pembelianController.completePembelian
);

userRouter.get(
  "/api/banksampah/:id_bank_sampah/pembelian/completed",
  pembelianController.getDaftarPembelianCompletedByBankSampah
);

// Route untuk mendapatkan detail pembelian berdasarkan ID Pembelian
userRouter.get(
  "/api/pembelian/:id_pembelian/details",
  pembelianController.getDetailPembelianById
);

// Route untuk mendapatkan detail pembelian yang digabungkan berdasarkan ID Pembelian
userRouter.get(
  "/api/pembelian/:id_pembelian/combined",
  pembelianController.getCombinedPembelianById
);

// Route untuk menghapus pembelian dan detailnya
userRouter.delete(
  "/api/pembelian/:id_pembelian",
  pembelianController.deletePembelian
);

/* SAMPAH ROUTES */

// Rute untuk membuat sampah baru
userRouter.post("/api/sampah/create", sampahController.create);

// Rute untuk mendapatkan daftar sampah
userRouter.get("/api/sampah/list", sampahController.getSampahList);

// Rute untuk mengedit data sampah
userRouter.patch("/api/sampah/:id_sampah", sampahController.editSampah);

// Route untuk menghapus sampah
userRouter.delete("/api/sampah/:id_sampah", sampahController.deleteSampah);

export { userRouter };
