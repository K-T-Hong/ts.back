import prisma from "../config/prisma.js";

export function findByFavorite(
  userId: number | string,
  productId: number | string
) {
  return prisma.favorite.findUnique({
    where: {
      userId_productId: {
        userId: Number(userId),
        productId: Number(productId),
      },
    },
  });
}

export async function create(
  userId: number | string,
  productId: number | string
) {
  return prisma.favorite.create({
    data: { userId: Number(userId), productId: Number(productId) },
  });
}

export async function remove(
  userId: number | string,
  productId: number | string
) {
  return prisma.favorite.delete({
    where: {
      userId_productId: {
        userId: Number(userId),
        productId: Number(productId),
      },
    },
  });
}

export async function countByProduct(productId: number | string) {
  return prisma.favorite.count({ where: { productId: Number(productId) } });
}

export default { findByFavorite, create, remove, countByProduct };
