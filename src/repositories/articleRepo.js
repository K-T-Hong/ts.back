import prisma from "../config/prisma.js";

async function findMany({ where, orderBy, skip, take }) {
  return prisma.article.findMany({
    where,
    orderBy,
    skip,
    take,
    select: {
      id: true,
      title: true,
      content: true,
      userId: true,
      createdAt: true,
      updatedAt: true,
    },
  });
}

async function count({ where }) {
  return prisma.article.count({ where });
}

async function findById(id) {
  return prisma.article.findUnique({
    where: { id: Number(id) },
    select: {
      id: true,
      userId: true,
      title: true,
      content: true,
      createdAt: true,
      updatedAt: true,
    },
  });
}

async function create(data) {
  return prisma.article.create({ data });
}

async function update(id, data) {
  return prisma.article.update({
    where: { id: Number(id) },
    data,
  });
}

async function remove(id) {
  return prisma.article.delete({
    where: { id: Number(id) },
  });
}

export default {
  findMany,
  count,
  findById,
  create,
  update,
  remove,
};
