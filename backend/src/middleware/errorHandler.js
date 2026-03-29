export const errorHandler = (err, req, res, next) => {
  console.error("Error:", err);

  const statusCode = res.statusCode === res.statusCode || 400;

  res.status(statusCode).json({
    success: false,
    message: err.message || "Internal Server Error",
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
  });
};