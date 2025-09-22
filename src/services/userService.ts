import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import * as userRepo from "../repositories/userRepo.js";
import type { User } from "@prisma/client";
import type { SafeUser } from "../types/domain.js";
import HttpError from "../utiles/HttpError.js";

type SignUpDto = { email: string; nickname: string; password: string };
type SignInDto = { email: string; password: string };
type Tokens = { accessToken: string; refreshToken: string };

const JWT_SECRET = process.env.JWT_SECRET as string;
const ACCESS_EXPIRES_IN = "15m";
const REFRESH_EXPIRES_IN = "7d";
const SALT_ROUNDS = 10;

function generateAccessToken(user: Pick<User, "id">) {
  return jwt.sign({ id: user.id }, JWT_SECRET, {
    expiresIn: ACCESS_EXPIRES_IN,
  });
}
function generateRefreshToken(user: Pick<User, "id">) {
  return jwt.sign({ id: user.id }, JWT_SECRET, {
    expiresIn: REFRESH_EXPIRES_IN,
  });
}

function toSafeUser(user: User): SafeUser {
  return {
    id: user.id,
    email: user.email,
    nickname: user.nickname,
    createdAt: user.createdAt,
  };
}

export async function signup({
  email,
  nickname,
  password,
}: SignUpDto): Promise<SafeUser> {
  if (!email || !password || !nickname) {
    throw new HttpError(400, "필수 항목 누락!", "validation");
  }
  const existing = await userRepo.findByEmail(email);
  if (existing) {
    throw new HttpError(409, "이미 등록된 이메일입니다.", "email");
  }
  const hashed = await bcrypt.hash(password, SALT_ROUNDS);
  const user = await userRepo.create({ email, nickname, password: hashed });
  return toSafeUser(user);
}

export async function signin({ email, password }: SignInDto): Promise<Tokens> {
  const user = await userRepo.findByEmail(email);
  if (!user || !user.password) {
    throw new HttpError(401, "존재하지 않는 이메일입니다.", "email");
  }
  const valid = await bcrypt.compare(password, user.password);
  if (!valid) {
    throw new HttpError(401, "잘못된 비밀번호 입니다.", "password");
  }

  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);
  await userRepo.updateRefreshToken(user.id, refreshToken);
  return { accessToken, refreshToken };
}

export async function refresh(
  refreshToken: string
): Promise<{ accessToken: string }> {
  try {
    const decoded = jwt.verify(refreshToken, JWT_SECRET) as {
      id: number;
    };
    const user = await userRepo.findById(decoded.id);
    if (!user || user.refreshToken !== refreshToken) {
      throw new HttpError(401, "RefreshToken이 유효하지 않습니다.", "auth");
    }
    const newAccessToken = generateAccessToken(user);
    return { accessToken: newAccessToken };
  } catch {
    throw new HttpError(401, "토큰 갱신 실패!", "auth");
  }
}

export async function logout(userId: number): Promise<void> {
  await userRepo.updateRefreshToken(userId, null);
}

export function getMe(id: number): Promise<SafeUser | null> {
  return userRepo.findSafeById(id);
}

export default {
  signup,
  signin,
  refresh,
  logout,
  getMe,
};
