import prisma from "../config/prisma.js";

async function findById(id) {
  return prisma.user.findUnique({
    where: {
      id,
    },
  });
}

async function findByEmail(email) {
  return prisma.user.findUnique({ where: { email } });
}

async function findSafeById(id) {
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

async function create(user) {
  return prisma.user.create({
    data: {
      email: user.email,
      nickname: user.nickname,
      password: user.password,
    },
  });
}

async function update(id, data) {
  return prisma.user.update({
    where: {
      id,
    },
    data: data,
  });
}

async function updateRefreshToken(id, refreshToken) {
  return prisma.user.update({ where: { id }, data: { refreshToken } });
}

async function findBySocial(provider, providerId) {
  return prisma.user.findUnique({
    where: {
      provider_providerId: { provider, providerId: String(providerId) },
    },
  });
}

async function createSocial({ provider, providerId, email, nickname, image }) {
  return prisma.user.create({
    data: { provider, providerId: String(providerId), email, nickname, image },
  });
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
