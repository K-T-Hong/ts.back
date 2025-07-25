import prisma from "../config/prisma.js";

async function findMany({ where, orderBy, skip, take }) {
  return prisma.product.findMany({
    where,
    orderBy,
    skip,
    take,
    select: {
      id: true,
      name: true,
      price: true,
      createdAt: true,
      updatedAt: true,
    },
  });
}

async function count({ where }) {
  return prisma.product.count({ where });
}

async function findById(id) {
  return prisma.product.findUnique({
    where: { id: Number(id) },
    select: {
      id: true,
      name: true,
      description: true,
      price: true,
      tags: true,
      images: true,
      userId: true,
      createdAt: true,
    },
  });
}

async function create(data) {
  return prisma.product.create({ data });
}

async function update(id, data) {
  return prisma.product.update({ where: { id: Number(id) }, data });
}

async function remove(id) {
  return prisma.product.delete({ where: { id: Number(id) } });
}

export default {
  findMany,
  count,
  findById,
  create,
  update,
  remove,
};
