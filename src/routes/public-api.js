import bsController from "../controller/bs-controller.js";
import userController from "../controller/user-controller.js";
import express from "express";

const publicRouter = new express.Router();
// Route untuk pendaftaran user
publicRouter.post("/api/register", userController.register);
// Route untuk login user
publicRouter.post("/api/login", userController.login);
// publicRouter.get("/api/api/bs", bsController.getAllBankSampah);
publicRouter.get("/api/banksampah", bsController.getAllBankSampah);

// Route untuk mencari nasabah berdasarkan nama
publicRouter.get("/api/nasabah/search", userController.searchNasabah);
export { publicRouter };
