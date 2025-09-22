import jwt from "jsonwebtoken";
import type { Request, Response, NextFunction } from "express";

function extractToken(req: Request): string | undefined {
  const authHeader = req.headers.authorization;
  if (authHeader?.startsWith("Bearer ")) return authHeader.split(" ")[1];
  if (req.cookies?.accessToken) return req.cookies.accessToken;
  return undefined;
}

export async function verifyAuth(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const token = extractToken(req);
  if (!token) return res.status(401).json({ error: "인증이 필요합니다." });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET) as { id: number };
    req.user = { id: decoded.id };
    next();
  } catch {
    res.status(403).json({ error: "유효하지 않은 토큰입니다." });
  }
}

export default { verifyAuth };
