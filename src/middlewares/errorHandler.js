export default function errorHandler(error, req, res, next) {
  let status = error.code ?? 500;
  console.error(error);

  if (error.code === "credentials_required") {
    status = error.status;
  }
  return res.status(status).json({
    path: req.path,
    method: req.method,
    message: error.message ?? "Internal Server Error",
    data: error.data ?? undefined,
    date: new Date(),
  });
}
