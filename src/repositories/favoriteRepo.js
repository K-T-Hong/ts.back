import prisma from "../config/prisma.js";

async function findByFavorite(userId, productId) {
  return prisma.favorite.findUnique({
    where: {
      userId_productId: {
        userId: Number(userId),
        productId: Number(productId),
      },
    },
  });
}

async function create(userId, productId) {
  return prisma.favorite.create({
    data: { userId: Number(userId), productId: Number(productId) },
  });
}

async function remove(userId, productId) {
  return prisma.favorite.delete({
    where: {
      userId_productId: {
        userId: Number(userId),
        productId: Number(productId),
      },
    },
  });
}

async function countByProduct(productId) {
  return prisma.favorite.count({ where: { productId: Number(productId) } });
}

export default { findByFavorite, create, remove, countByProduct };
