import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import userRepo from "../repositories/userRepo.js";

const JWT_SECRET = process.env.JWT_SECRET;
const ACCESS_EXPIRES_IN = "15m";
const REFRESH_EXPIRES_IN = "7d";
const SALT_ROUNDS = 10;

function generateAccessToken(user) {
  return jwt.sign({ id: user.id }, JWT_SECRET, {
    expiresIn: ACCESS_EXPIRES_IN,
  });
}
function generateRefreshToken(user) {
  return jwt.sign({ id: user.id }, JWT_SECRET, {
    expiresIn: REFRESH_EXPIRES_IN,
  });
}

async function signup({ email, nickname, password }) {
  if (!email || !password || !nickname) throw new Error("필수 항목 누락");
  const existing = await userRepo.findByEmail(email);
  if (existing) throw new Error("이미 등록된 이메일입니다.");
  const hashed = await bcrypt.hash(password, SALT_ROUNDS);
  const user = await userRepo.create({ email, nickname, password: hashed });
  const { password: _, ...safeUser } = user;
  return safeUser;
}

async function signin({ email, password }) {
  const user = await userRepo.findByEmail(email);
  if (!user || !user.password) throw new Error("이메일 또는 비밀번호 오류");
  const valid = await bcrypt.compare(password, user.password);
  if (!valid) throw new Error("이메일 또는 비밀번호 오류");

  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);
  await userRepo.updateRefreshToken(user.id, refreshToken);
  return { accessToken, refreshToken };
}

async function refresh(refreshToken) {
  try {
    const decoded = jwt.verify(refreshToken, JWT_SECRET);
    const user = await userRepo.findById(decoded.id);
    if (!user || user.refreshToken !== refreshToken) {
      throw new Error("RefreshToken이 유효하지 않습니다.");
    }
    const newAccessToken = generateAccessToken(user);
    return { accessToken: newAccessToken };
  } catch {
    throw new Error("토큰 갱신 실패");
  }
}

async function logout(userId) {
  await userRepo.updateRefreshToken(userId, null);
}

function getMe(id) {
  return userRepo.findSafeById(id);
}

export default {
  signup,
  signin,
  refresh,
  logout,
  getMe,
};
