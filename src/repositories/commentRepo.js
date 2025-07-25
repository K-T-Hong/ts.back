import prisma from "../config/prisma.js";

function findAll() {
  return prisma.comment.findMany({ orderBy: { createdAt: "asc" } });
}

function findByProduct(productId) {
  return prisma.comment.findMany({
    where: { productId: Number(productId) },
    orderBy: { createdAt: "asc" },
  });
}

function findByArticle(articleId) {
  return prisma.comment.findMany({
    where: { articleId: Number(articleId) },
    orderBy: { createdAt: "asc" },
  });
}

function findById(id) {
  return prisma.comment.findUnique({ where: { id: Number(id) } });
}

function create(data) {
  return prisma.comment.create({ data });
}

function update(id, data) {
  return prisma.comment.update({ where: { id: Number(id) }, data });
}

function remove(id) {
  return prisma.comment.delete({ where: { id: Number(id) } });
}

export default {
  findAll,
  findByProduct,
  findByArticle,
  findById,
  create,
  update,
  remove,
};
