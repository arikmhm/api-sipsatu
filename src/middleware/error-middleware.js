// src/middleware/error-middleware.js

const errorMiddleware = async (err, req, res, next) => {
  if (!err) {
    next();
    return;
  }

  res.status(err.status || 500).json({
    status: err.status || 500,
    message: err.message || "Internal server error",
    data: null,
  });
};

export { errorMiddleware };
