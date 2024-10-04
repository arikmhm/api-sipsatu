import { prismaClient } from "../app/database.js";
import { ResponseError } from "../error/response-error.js";

const getAllBankSampah = async () => {
  // Mengambil semua data bank sampah
  const bankSampahList = await prismaClient.bankSampah.findMany({
    select: {
      id_bank_sampah: true,
      nama: true,
    },
  });

  if (!bankSampahList || bankSampahList.length === 0) {
    throw new ResponseError(404, "No Bank Sampah found");
  }

  return bankSampahList;
};

export default { getAllBankSampah };
