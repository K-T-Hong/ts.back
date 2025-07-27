export default function errorHandler(err, req, res, next) {
  const status = err.status || err.code || 500;
  let message = err.message || "서버 내부 오류";

  if (err.name === "NotFoundError" || status === 404) {
    return res
      .status(404)
      .json({ error: message || "리소스를 찾을 수 없습니다." });
  }
  if (status === 400) {
    return res.status(400).json({ error: message || "잘못된 요청입니다." });
  }
  if (status === 401) {
    return res.status(401).json({ error: message || "인증이 필요합니다." });
  }
  if (status === 403) {
    return res.status(403).json({ error: message || "권한이 없습니다." });
  }

  console.error("Error:", err);
  res.status(500).json({ error: "서버 내부 오류" });
}
