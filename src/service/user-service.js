// src/service/user-service.js
import { prismaClient } from "../app/database.js";
import { ResponseError } from "../error/response-error.js";
import {
  registerUserValidation,
  loginUserValidation,
} from "../validation/user-validation.js";
import { validate } from "../validation/validation.js";
import bcrypt from "bcrypt";
import { v4 as uuid } from "uuid";

/* Pendaftaran User Nasabah */
const register = async (request) => {
  const userData = validate(registerUserValidation, request);

  try {
    const userRegistered = await prismaClient.user.count({
      where: { phone: userData.phone },
    });

    if (userRegistered > 0) {
      return {
        status: 400,
        message: "User already exists",
        data: null,
      };
    }

    // Hapus hashing, simpan password secara langsung
    const rawPassword = userData.password;

    await prismaClient.$transaction(async (prisma) => {
      await prisma.user.create({
        data: {
          phone: userData.phone,
          password: rawPassword, // Menyimpan password langsung
          id_role: userData.id_role,
          nasabah: {
            create: {
              nama: userData.nama,
              phone: userData.phone,
              alamat: userData.alamat,
              bank_sampah: {
                connect: { id_bank_sampah: userData.id_bank_sampah },
              },
            },
          },
        },
      });
    });

    return {
      status: 201,
      message: "User registered successfully",
      data: null,
    };
  } catch (error) {
    return {
      status: 500,
      message: "Internal server error",
      data: null,
    };
  }
};

/* Login User */
// const login = async (request) => {
//   const loginRequest = validate(loginUserValidation, request);

//   try {
//     const user = await prismaClient.user.findUnique({
//       where: { phone: loginRequest.phone },
//       select: {
//         phone: true,
//         password: true,
//         id_role: true,
//       },
//     });

//     if (!user || loginRequest.password !== user.password) {
//       return {
//         status: 401,
//         message: "Username / Password wrong",
//         data: null,
//       };
//     }

//     const token = uuid().toString();

//     const updatedUser = await prismaClient.user.update({
//       data: { token },
//       where: { phone: user.phone },
//       select: {
//         token: true,
//         id_role: true,
//       },
//     });

//     return {
//       status: 200,
//       message: "Login successful",
//       data: {
//         token: updatedUser.token,
//         id_role: updatedUser.id_role,
//       },
//     };
//   } catch (error) {
//     return {
//       status: 500,
//       message: "Internal server error",
//       data: null,
//     };
//   }
// };

/* Login User */
const login = async (request) => {
  const loginRequest = validate(loginUserValidation, request);

  try {
    const user = await prismaClient.user.findUnique({
      where: { phone: loginRequest.phone },
      select: {
        phone: true,
        password: true,
        id_role: true,
        token: true, // Include token in the selection
      },
    });

    if (!user || loginRequest.password !== user.password) {
      return {
        status: 401,
        message: "Username / Password wrong",
        data: null,
      };
    }

    // Cek apakah token sudah ada dan masih valid (jika Anda memiliki logika untuk mengecek validitas token, implementasikan di sini)
    let token = user.token;
    if (!token) {
      // Hanya buat token baru jika tidak ada token yang sudah ada
      token = uuid().toString();
      await prismaClient.user.update({
        data: { token },
        where: { phone: user.phone },
      });
    }

    return {
      status: 200,
      message: "Login successful",
      data: {
        token: token,
        id_role: user.id_role,
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

/* Mencari Nasabah Berdasarkan Nama */
const searchNasabahByName = async (name, userBankSampahId) => {
  try {
    const searchCriteria = {
      id_bank_sampah: userBankSampahId,
    };

    if (name) {
      searchCriteria.nama = { contains: name.toLowerCase() };
    }

    const nasabahList = await prismaClient.nasabah.findMany({
      where: searchCriteria,
      select: {
        id_nasabah: true,
        nama: true,
      },
    });

    if (nasabahList.length === 0) {
      return {
        status: 404,
        message: "Nasabah not found",
        data: null,
      };
    }

    return {
      status: 200,
      message: "Nasabah search successful",
      data: nasabahList,
    };
  } catch (error) {
    return {
      status: 500,
      message: "Internal server error",
      data: null,
    };
  }
};

/* Mendapatkan Nasabah Berdasarkan Bank Sampah */
const getNasabahByBankSampah = async (user) => {
  try {
    const bankSampah = await prismaClient.bankSampah.findUnique({
      where: { id_user: user.id_user },
      select: { id_bank_sampah: true },
    });

    if (!bankSampah) {
      return {
        status: 404,
        message: "Bank Sampah not found",
        data: null,
      };
    }

    const nasabahList = await prismaClient.nasabah.findMany({
      where: { id_bank_sampah: bankSampah.id_bank_sampah },
      select: {
        id_nasabah: true,
        nama: true,
      },
    });

    if (nasabahList.length === 0) {
      return {
        status: 404,
        message: "No Nasabah found for this Bank Sampah",
        data: null,
      };
    }

    return {
      status: 200,
      message: "Nasabah by bank sampah retrieved successfully",
      data: nasabahList,
    };
  } catch (error) {
    return {
      status: 500,
      message: "Internal server error",
      data: null,
    };
  }
};

/* Mendapatkan Nasabah yang Sedang Login */
const getUserCurrentNasabah = async (user) => {
  try {
    const nasabah = await prismaClient.nasabah.findUnique({
      where: {
        id_user: user.id_user,
      },
      select: {
        id_user: true,
        phone: true,
        id_nasabah: true,
        nama: true,
        id_bank_sampah: true,
        bank_sampah: {
          select: {
            nama: true, // Mengambil nama bank sampah
          },
        },
      },
    });

    if (!nasabah) {
      return {
        status: 404,
        message: "Nasabah not found",
        data: null,
      };
    }

    // Menambahkan nama bank sampah ke data nasabah
    const nasabahData = {
      id_user: nasabah.id_user,
      phone: nasabah.phone,
      id_nasabah: nasabah.id_nasabah,
      nama: nasabah.nama,
      id_bank_sampah: nasabah.id_bank_sampah,
      nama_bankSampah: nasabah.bank_sampah.nama, // Menambahkan nama bank sampah
    };

    return {
      status: 200,
      message: "Nasabah retrieved successfully",
      data: nasabahData,
    };
  } catch (error) {
    return {
      status: 500,
      message: "Internal server error",
      data: null,
    };
  }
};

// Fungsi untuk mendapatkan informasi bank sampah saat ini
const getUserCurrentBankSampah = async (user) => {
  try {
    const bankSampah = await prismaClient.bankSampah.findUnique({
      where: {
        id_user: user.id_user,
      },
      select: {
        id_user: true,
        phone: true,
        id_bank_sampah: true,
        nama: true,
      },
    });

    if (!bankSampah) {
      return {
        status: 404,
        message: "Bank Sampah not found",
        data: null,
      };
    }

    return {
      status: 200,
      message: "Bank Sampah retrieved successfully",
      data: bankSampah,
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
  register,
  login,
  searchNasabahByName,
  getNasabahByBankSampah,
  getUserCurrentNasabah,
  getUserCurrentBankSampah,
};
