import prisma from "../config/prisma.js";
import type { Prisma } from "@prisma/client";

export async function findById(id: number) {
  return prisma.user.findUnique({
    where: {
      id,
    },
  });
}

export async function findByEmail(email: string) {
  return prisma.user.findUnique({ where: { email } });
}

export async function findSafeById(id: number) {
  return prisma.user.findUnique({
    where: { id: Number(id) },
    select: {
      id: true,
      email: true,
      nickname: true,
      createdAt: true,
    },
  });
}

export async function create(user: {
  email: string;
  nickname?: string | null;
  password?: string | null;
}) {
  return prisma.user.create({
    data: {
      email: user.email,
      ...(user.nickname !== undefined ? { nickname: user.nickname } : {}),
      ...(user.password !== undefined ? { password: user.password } : {}),
    },
  });
}

export async function update(id: number, data: Prisma.UserUpdateInput) {
  return prisma.user.update({
    where: {
      id,
    },
    data,
  });
}

export async function updateRefreshToken(
  id: number,
  refreshToken: string | null
) {
  return prisma.user.update({ where: { id }, data: { refreshToken } });
}

export async function findBySocial(
  provider: string,
  providerId: string | number
) {
  return prisma.user.findUnique({
    where: {
      provider_providerId: { provider, providerId: String(providerId) },
    },
  });
}

function ensureEmail(
  provider: string,
  providerId: string | number,
  email?: string | null
): string {
  return email ?? `${provider}_${String(providerId)}@oauth.local`;
}

export async function createSocial({
  provider,
  providerId,
  email,
  nickname,
  image,
}: {
  provider: string;
  providerId: string | number;
  email?: string | null;
  nickname?: string | null;
  image?: string | null;
}) {
  const data: Prisma.UserCreateInput = {
    provider,
    providerId: String(providerId),
    email: ensureEmail(provider, providerId, email ?? null),
    ...(nickname !== undefined ? { nickname } : {}),
    ...(image !== undefined ? { image } : {}),
  };
  return prisma.user.create({ data });
}

export default {
  findById,
  findByEmail,
  findSafeById,
  create,
  update,
  updateRefreshToken,
  findBySocial,
  createSocial,
};
