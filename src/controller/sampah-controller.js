// src/controller/sampah-controller.js
import sampahService from "../service/sampah-service.js";

const create = async (req, res, next) => {
  try {
    const user = req.user;
    const request = req.body;
    const result = await sampahService.create(user, request);
    res.status(result.status).json({
      status: result.status,
      message: result.message,
      data: result.data,
    });
  } catch (e) {
    next(e);
  }
};

const getSampahList = async (req, res, next) => {
  try {
    const user = req.user;
    const result = await sampahService.getAllSampahByUserBankSampah(user);
    res.status(result.status).json({
      status: result.status,
      message: result.message,
      data: result.data,
    });
  } catch (e) {
    next(e);
  }
};

const editSampah = async (req, res, next) => {
  try {
    const { id_sampah } = req.params;
    const updates = req.body;
    const user = req.user;
    const result = await sampahService.edit(user, id_sampah, updates);
    res.status(result.status).json({
      status: result.status,
      message: result.message,
    });
  } catch (e) {
    next(e);
  }
};

const deleteSampah = async (req, res, next) => {
  try {
    const { id_sampah } = req.params;
    const user = req.user;
    const result = await sampahService.remove(user, id_sampah);
    res.status(result.status).json({
      status: result.status,
      message: result.message,
    });
  } catch (e) {
    next(e);
  }
};

export default { create, getSampahList, editSampah, deleteSampah };
