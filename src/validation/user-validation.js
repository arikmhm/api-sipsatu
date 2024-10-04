// src/validation/user-validation.js
import Joi from "joi";

// Validasi Pendaftaran User (Nasabah)
const registerUserValidation = Joi.object({
  phone: Joi.string().max(255).required(),
  password: Joi.string().max(255).required(),
  token: Joi.string().max(255).optional(),
  id_role: Joi.number().default(1).optional(),
  nama: Joi.string().max(255).required(),
  alamat: Joi.string().max(255).required(),
  id_bank_sampah: Joi.number().required(),
});

// Validasi Login User (All User)
const loginUserValidation = Joi.object({
  phone: Joi.string().max(255).required(),
  password: Joi.string().max(255).required(),
});

// Validasi untuk mendapatkan data user
const getUserValidation = Joi.string().max(191).required();

export { registerUserValidation, loginUserValidation, getUserValidation };
