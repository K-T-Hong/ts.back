import prisma from "../config/prisma.js";
import type { Prisma } from "@prisma/client";
import type { ProductListItem } from "../types/domain.js";

export type ProductFindManyParams = {
  where?: Prisma.ProductWhereInput;
  orderBy?:
    | Prisma.ProductOrderByWithRelationInput
    | Prisma.ProductOrderByWithRelationInput[];
  skip?: number;
  take?: number;
};

export async function findMany({
  where,
  orderBy,
  skip,
  take,
}: ProductFindManyParams): Promise<ProductListItem[]> {
  const args: Prisma.ProductFindManyArgs = {
    select: {
      id: true,
      name: true,
      price: true,
      createdAt: true,
      updatedAt: true,
    },
    ...(where && { where }),
    ...(orderBy && { orderBy }),
    ...(typeof skip === "number" && { skip }),
    ...(typeof take === "number" && { take }),
  };
  return prisma.product.findMany(args);
}

export async function count({ where }: Pick<ProductFindManyParams, "where">) {
  const args: Prisma.ProductCountArgs = { ...(where && { where }) };
  return prisma.product.count(args);
}

export function findById(id: number | string) {
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

export async function create(data: Prisma.ProductCreateInput) {
  return prisma.product.create({ data });
}

export async function update(
  id: number | string,
  data: Prisma.ProductUpdateInput
) {
  return prisma.product.update({ where: { id: Number(id) }, data });
}

export async function remove(id: number | string) {
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
