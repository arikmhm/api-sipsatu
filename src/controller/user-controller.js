// src/controller/user-controller.js
import userService from "../service/user-service.js";

const register = async (req, res, next) => {
  try {
    const result = await userService.register(req.body);
    res.status(result.status).json({
      status: result.status,
      message: result.message,
      data: result.data,
    });
  } catch (e) {
    next(e);
  }
};

const login = async (req, res, next) => {
  try {
    const result = await userService.login(req.body);
    res.status(result.status).json({
      status: result.status,
      message: result.message,
      data: result.data,
    });
  } catch (e) {
    next(e);
  }
};

// Controller untuk mencari Nasabah berdasarkan nama dan id_banksampah
const searchNasabah = async (req, res, next) => {
  try {
    const { name, id_bank_sampah } = req.query;

    if (!id_bank_sampah) {
      return res.status(400).json({
        status: 400,
        message: "Parameter id_bank_sampah is required",
      });
    }

    const result = await userService.searchNasabahByName(
      name,
      parseInt(id_bank_sampah, 10)
    );

    res.status(result.status).json({
      status: result.status,
      message: result.message,
      data: result.data,
    });
  } catch (e) {
    next(e);
  }
};

const getNasabahByBankSampah = async (req, res, next) => {
  try {
    const user = req.user;
    const result = await userService.getNasabahByBankSampah(user);
    res.status(result.status).json({
      status: result.status,
      message: result.message,
      data: result.data,
    });
  } catch (e) {
    next(e);
  }
};

const getUserCurrentNasabah = async (req, res, next) => {
  try {
    const user = req.user;
    const result = await userService.getUserCurrentNasabah(user);
    res.status(result.status).json({
      status: result.status,
      message: result.message,
      data: result.data,
    });
  } catch (e) {
    next(e);
  }
};

// Controller untuk mendapatkan informasi bank sampah saat ini
const getUserCurrentBankSampah = async (req, res, next) => {
  try {
    const user = req.user; // Mendapatkan user dari middleware
    const result = await userService.getUserCurrentBankSampah(user);
    res.status(result.status).json({
      status: result.status,
      message: result.message,
      data: result.data,
    });
  } catch (e) {
    next(e);
  }
};

export default {
  register,
  login,
  searchNasabah,
  getNasabahByBankSampah,
  getUserCurrentNasabah,
  getUserCurrentBankSampah,
};
