import prisma from "../config/prisma.js";
import type { Prisma } from "@prisma/client";
import type { ArticleListItem } from "../types/domain.js";

export type ArticleFindManyParams = {
  where?: Prisma.ArticleWhereInput;
  orderBy?:
    | Prisma.ArticleOrderByWithRelationInput
    | Prisma.ArticleOrderByWithRelationInput[];
  skip?: number;
  take?: number;
};

export async function findMany({
  where,
  orderBy,
  skip,
  take,
}: ArticleFindManyParams): Promise<ArticleListItem[]> {
  const args: Prisma.ArticleFindManyArgs = {
    select: {
      id: true,
      title: true,
      content: true,
      userId: true,
      createdAt: true,
      updatedAt: true,
    },
    ...(where && { where }),
    ...(orderBy && { orderBy }),
    ...(typeof skip === "number" && { skip }),
    ...(typeof take === "number" && { take }),
  };
  return prisma.article.findMany(args);
}

export async function count({
  where,
}: Pick<ArticleFindManyParams, "where">): Promise<number> {
  const args: Prisma.ArticleCountArgs = { ...(where && { where }) };
  return prisma.article.count(args);
}

export function findById(id: number | string) {
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

export async function create(data: Prisma.ArticleCreateInput) {
  return prisma.article.create({ data });
}

export async function update(
  id: number | string,
  data: Prisma.ArticleUpdateInput
) {
  return prisma.article.update({
    where: { id: Number(id) },
    data,
  });
}

export async function remove(id: number | string) {
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
