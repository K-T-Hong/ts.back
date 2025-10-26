import prisma from "../config/prisma.js";

export function findByLike(
  userId: number | string,
  articleId: number | string
) {
  return prisma.like.findUnique({
    where: {
      userId_articleId: {
        userId: Number(userId),
        articleId: Number(articleId),
      },
    },
  });
}

export async function create(
  userId: number | string,
  articleId: number | string
) {
  return prisma.like.create({
    data: { userId: Number(userId), articleId: Number(articleId) },
  });
}

export async function remove(
  userId: number | string,
  articleId: number | string
) {
  return prisma.like.delete({
    where: {
      userId_articleId: {
        userId: Number(userId),
        articleId: Number(articleId),
      },
    },
  });
}

export async function countByArticle(articleId: number | string) {
  return prisma.like.count({ where: { articleId: Number(articleId) } });
}

export default { findByLike, create, remove, countByArticle };
