// src/validation/validation.js
import { ResponseError } from "../error/response-error.js";
import Joi from "joi";

// Fungsi untuk validasi menggunakan schema dari Joi
const validate = (schema, request) => {
  const result = schema.validate(request, {
    abortEarly: false, // Validasi semua field, bukan hanya satu kesalahan
    allowUnknown: false, // Tidak memperbolehkan field yang tidak didefinisikan
  });

  if (result.error) {
    // Buang error jika ada kesalahan validasi
    throw new ResponseError(
      400,
      result.error.details.map((detail) => detail.message).join(", ")
    );
  }

  return result.value;
};

export { validate };
