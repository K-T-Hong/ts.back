export default function errorHandler(err, req, res, next) {
  const status = err.status || err.code || 500;
  let message = err.message || "서버 내부 오류";

  if (err.name === "NotFoundError" || status === 404) {
    return res.status(404).json({
      message: message || "리소스를 찾을 수 없습니다.",
      errorType: err.errorType,
    });
  }
  if (status === 400) {
    return res.status(400).json({
      message: message || "잘못된 요청입니다.",
      errorType: err.errorType,
    });
  }
  if (status === 401) {
    return res.status(401).json({
      message: message || "인증이 필요합니다.",
      errorType: err.errorType,
    });
  }
  if (status === 403) {
    return res.status(403).json({
      message: message || "권한이 없습니다.",
      errorType: err.errorType,
    });
  }

  res.status(status).json({
    message,
    errorType: err.errorType,
  });

  console.error("Error:", err);
}
