import prisma from "../config/prisma.js";
import * as likeRepo from "../repositories/likeRepo.js";

export async function like(userId: number, articleId: number) {
  return prisma.$transaction(async tx => {
    const existing = await tx.like.findUnique({
      where: {
        userId_articleId: {
          userId: Number(userId),
          articleId: Number(articleId),
        },
      },
    });
    if (existing) {
      await tx.like.delete({
        where: {
          userId_articleId: {
            userId: Number(userId),
            articleId: Number(articleId),
          },
        },
      });
      return { liked: false };
    } else {
      await tx.like.create({
        data: { userId: Number(userId), articleId: Number(articleId) },
      });
      return { liked: true };
    }
  });
}

export async function count(articleId: number) {
  return likeRepo.countByArticle(articleId);
}

export default { like, count };
