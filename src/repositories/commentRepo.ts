import prisma from "../config/prisma.js";
import type { Prisma } from "@prisma/client";

export function findAll() {
  return prisma.comment.findMany({ orderBy: { createdAt: "asc" } });
}

export function findByProduct(productId: number | string) {
  return prisma.comment.findMany({
    where: { productId: Number(productId) },
    orderBy: { createdAt: "asc" },
  });
}

export function findByArticle(articleId: number | string) {
  return prisma.comment.findMany({
    where: { articleId: Number(articleId) },
    orderBy: { createdAt: "asc" },
  });
}

export function findById(id: number | string) {
  return prisma.comment.findUnique({ where: { id: Number(id) } });
}

export function create(data: Prisma.CommentCreateInput) {
  return prisma.comment.create({ data });
}

export function update(id: number | string, data: Prisma.CommentUpdateInput) {
  return prisma.comment.update({ where: { id: Number(id) }, data });
}

export function remove(id: number | string) {
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
