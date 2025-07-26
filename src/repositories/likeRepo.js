import prisma from "../config/prisma.js";

async function findByLike(userId, articleId) {
  return prisma.like.findUnique({
    where: {
      userId_articleId: {
        userId: Number(userId),
        articleId: Number(articleId),
      },
    },
  });
}

async function create(userId, articleId) {
  return prisma.like.create({
    data: { userId: Number(userId), articleId: Number(articleId) },
  });
}

async function remove(userId, articleId) {
  return prisma.like.delete({
    where: {
      userId_articleId: {
        userId: Number(userId),
        articleId: Number(articleId),
      },
    },
  });
}

async function countByArticle(articleId) {
  return prisma.like.count({ where: { articleId: Number(articleId) } });
}

export default { findByLike, create, remove, countByArticle };
