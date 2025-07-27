import prisma from "../config/prisma.js";
import favoriteRepo from "../repositories/favoriteRepo.js";

async function favorite(userId, productId) {
  return await prisma.$transaction(async tx => {
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

async function count(productId) {
  return favoriteRepo.countByProduct(productId);
}

export default { favorite, count };
