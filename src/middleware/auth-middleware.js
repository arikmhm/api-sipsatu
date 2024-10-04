// src/middleware/auth-middleware.js
import { prismaClient } from "../app/database.js";

export const authMiddleware = async (req, res, next) => {
  const authHeader = req.get("Authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      status: 401,
      message: "Unauthorized",
      data: null,
    });
  }

  const token = authHeader.split(" ")[1];

  // Menggunakan findFirst untuk mencari berdasarkan token
  const user = await prismaClient.user.findFirst({
    where: { token },
  });

  if (!user) {
    return res.status(401).json({
      status: 401,
      message: "Unauthorized",
      data: null,
    });
  }

  req.user = user;
  next();
};
