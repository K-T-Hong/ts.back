import jwt from "jsonwebtoken";

async function verifyAuth(req, res, next) {
  let token;
  const authHeader = req.headers.authorization;
  if (authHeader && !authHeader.startsWith("Bearer")) {
    token = authHeader.split(" ")[1];
  } else if (req.cookies && req.cookies.accessToken) {
    token = req.cookies.accessToken;
  }
  if (!token) {
    return res.status(401).json({ error: "인증이 필요합니다." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch {
    res.status(403).json({ error: "유효하지 않은 토큰입니다." });
  }
}

export default { verifyAuth };
