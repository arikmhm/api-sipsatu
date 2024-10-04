// src/validation/pembelian-validation.js

import Joi from "joi";

const createPembelianValidation = Joi.object({
  id_nasabah: Joi.number().integer().positive().required().messages({
    "number.base": "ID Nasabah harus berupa angka",
    "number.integer": "ID Nasabah harus berupa bilangan bulat",
    "number.positive": "ID Nasabah harus bernilai positif",
    "any.required": "ID Nasabah wajib diisi",
  }),
  keterangan: Joi.string().max(255).optional().messages({
    "string.base": "Keterangan harus berupa teks",
    "string.max": "Keterangan tidak boleh lebih dari 255 karakter",
  }),
});

const addDetailPembelianValidation = Joi.object({
  id_sampah: Joi.number().integer().positive().required().messages({
    "number.base": "ID Sampah harus berupa angka",
    "number.integer": "ID Sampah harus berupa bilangan bulat",
    "number.positive": "ID Sampah harus bernilai positif",
    "any.required": "ID Sampah wajib diisi",
  }),
  berat: Joi.number().positive().required().messages({
    "number.base": "Berat harus berupa angka",
    "number.positive": "Berat harus bernilai positif",
    "any.required": "Berat wajib diisi",
  }),
});

export { createPembelianValidation, addDetailPembelianValidation };
