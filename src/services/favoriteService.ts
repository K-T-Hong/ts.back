import prisma from "../config/prisma.js";
import * as favoriteRepo from "../repositories/favoriteRepo.js";

export async function favorite(userId: number, productId: number) {
  return prisma.$transaction(async tx => {
    const existing = await tx.favorite.findUnique({
      where: {
        userId_productId: {
          userId: Number(userId),
          productId: Number(productId),
        },
      },
    });
    if (existing) {
      await tx.favorite.delete({
        where: {
          userId_productId: {
            userId: Number(userId),
            productId: Number(productId),
          },
        },
      });
      return { favorited: false };
    } else {
      await tx.favorite.create({
        data: { userId: Number(userId), productId: Number(productId) },
      });
      return { favorited: true };
    }
  });
}

export async function count(productId: number) {
  return favoriteRepo.countByProduct(productId);
}

export default { favorite, count };
