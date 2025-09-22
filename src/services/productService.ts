import prisma from "../config/prisma.js";
import { Prisma } from "@prisma/client";
import type { Paginated } from "../types/pagination.js";
import type { ProductListItem } from "../types/domain.js";
import * as productRepo from "../repositories/productRepo.js";
import { calcSkip } from "../types/pagination.js";
import HttpError from "../utiles/HttpError.js";

type ProductSort = "recent";
export type ProductListQuery = {
  page: number | string;
  pageSize: number | string;
  sort?: ProductSort;
  keyword?: string;
};

export async function getList({
  page,
  pageSize,
  sort = "recent",
  keyword,
}: ProductListQuery): Promise<Paginated<ProductListItem>> {
  const {
    page: p,
    pageSize: s,
    skip,
    take,
  } = calcSkip({ page: Number(page), pageSize: Number(pageSize) });
  const where: Prisma.ProductWhereInput = keyword
    ? {
        OR: [
          { name: { contains: keyword, mode: "insensitive" } },
          { description: { contains: keyword, mode: "insensitive" } },
        ],
      }
    : {};
  const orderBy: Prisma.ProductOrderByWithRelationInput =
    sort === "recent" ? { createdAt: "desc" } : { createdAt: "desc" };
  const [list, totalCount] = await Promise.all([
    productRepo.findMany({ where, orderBy, skip, take }),
    productRepo.count({ where }),
  ]);
  return { list, totalCount, page: p, pageSize: s };
}

export async function getById(id: number | string, userId: number | string) {
  return prisma.$transaction(async tx => {
    const product = await tx.product.findUnique({
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
    if (!product) {
      throw new HttpError(404, "상품을 찾을 수 없습니다.", "notfound");
    }
    const favorite = userId
      ? await tx.favorite.findUnique({
          where: {
            userId_productId: {
              userId: Number(userId),
              productId: Number(id),
            },
          },
        })
      : null;
    return { ...product, isLiked: !!favorite };
  });
}

export async function create({
  userId,
  name,
  description,
  price,
  images,
  tags,
}: {
  userId: number;
  name: string;
  description: string;
  price: number | string;
  images: string[];
  tags: string[];
}) {
  if (!userId || isNaN(Number(userId))) {
    throw new HttpError(400, "유효한 userId가 필요합니다.", "auth");
  }
  return productRepo.create({
    user: { connect: { id: Number(userId) } },
    name: name.trim(),
    description: description.trim(),
    price: Number(price),
    images,
    tags: tags.map(tag => tag.trim()),
  });
}

export async function update(
  id: number | string,
  {
    name,
    description,
    price,
    images,
    tags,
  }: {
    name: string;
    description: string;
    price: number | string;
    images: string[];
    tags: string[];
  },
  currentUserId: number
) {
  const product = await productRepo.findById(id);
  if (!product) {
    throw new HttpError(404, "상품이 존재하지 않습니다.", "notfound");
  }
  if (product.userId !== currentUserId) {
    throw new HttpError(403, "해당 상품의 수정 권한이 없습니다.", "auth");
  }

  return productRepo.update(id, {
    name: name.trim(),
    description: description.trim(),
    price: Number(price),
    images,
    tags: tags.map(t => t.trim()),
  });
}

export async function remove(id: number | string, currentUserId: number) {
  const product = await productRepo.findById(id);
  if (!product) {
    throw new HttpError(404, "상품이 존재하지 않습니다.", "notfound");
  }
  if (product.userId !== currentUserId) {
    throw new HttpError(403, "해당 상품의 삭제 권한이 없습니다.", "auth");
  }
  return productRepo.remove(id);
}

export default {
  getList,
  getById,
  create,
  update,
  remove,
};
