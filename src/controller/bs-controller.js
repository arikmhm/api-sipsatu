import bsService from "../service/bs-service.js";

const getAllBankSampah = async (req, res, next) => {
  try {
    const result = await bsService.getAllBankSampah();
    res.status(200).json({ data: result });
  } catch (e) {
    next(e);
  }
};

export default {
  getAllBankSampah,
};
