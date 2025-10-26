import prisma from "../config/prisma.js";
import type { Prisma } from "@prisma/client";
import type { Paginated } from "../types/pagination.js";
import type { ArticleListItem } from "../types/domain.js";
import * as articleRepo from "../repositories/articleRepo.js";
import { calcSkip } from "../types/pagination.js";
import HttpError from "../utiles/HttpError.js";

type ArticleSort = "recent";
export type ArticleListQuery = {
  page: number | string;
  pageSize: number | string;
  sort?: ArticleSort;
  keyword?: string;
};

export async function getList({
  page,
  pageSize,
  sort = "recent",
  keyword,
}: ArticleListQuery): Promise<Paginated<ArticleListItem>> {
  const {
    page: p,
    pageSize: s,
    skip,
    take,
  } = calcSkip({ page: Number(page), pageSize: Number(pageSize) });
  const where: Prisma.ArticleWhereInput = keyword
    ? {
        OR: [
          { title: { contains: keyword, mode: "insensitive" } },
          { content: { contains: keyword, mode: "insensitive" } },
        ],
      }
    : {};
  const orderBy: Prisma.ArticleOrderByWithRelationInput =
    sort === "recent" ? { createdAt: "desc" } : { createdAt: "desc" };
  const [list, totalCount] = await Promise.all([
    articleRepo.findMany({ where, orderBy, skip, take }),
    articleRepo.count({ where }),
  ]);
  return { list, totalCount, page: p, pageSize: s };
}

export async function getById(id: number | string, userId?: number) {
  return prisma.$transaction(async tx => {
    const article = await tx.article.findUnique({
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
    if (!article) {
      throw new HttpError(404, "게시글을 찾을 수 없습니다.", "notfound");
    }
    const like = userId
      ? await tx.like.findUnique({
          where: {
            userId_articleId: {
              userId: Number(userId),
              articleId: Number(id),
            },
          },
        })
      : null;
    return { ...article, isLiked: !!like };
  });
}

export async function create({
  userId,
  title,
  content,
}: {
  userId: number;
  title: string;
  content: string;
}) {
  if (!userId || isNaN(Number(userId))) {
    throw new HttpError(400, "유효한 userId가 필요합니다.", "validation");
  }
  if (
    typeof title !== "string" ||
    title.trim().length < 1 ||
    title.trim().length > 30
  ) {
    throw new HttpError(400, "제목은 30자 이내로 입력해주세요.", "validation");
  }
  if (
    typeof content !== "string" ||
    content.trim().length < 1 ||
    content.trim().length > 1000
  ) {
    throw new HttpError(
      400,
      "내용은 1000자 이내로 입력해주세요.",
      "validation"
    );
  }
  return articleRepo.create({
    title: title.trim(),
    content: content.trim(),
    user: { connect: { id: Number(userId) } },
  });
}

export async function update(
  id: number | string,
  { title, content }: { title?: string; content?: string },
  currentUserId: number
) {
  const article = await articleRepo.findById(id);
  if (!article) {
    throw new HttpError(404, "게시글이 존재하지 않습니다.", "notfound");
  }
  if (article.userId !== currentUserId) {
    throw new HttpError(403, "해당 게시글의 수정 권한이 없습니다.", "auth");
  }

  const updateData: Prisma.ArticleUpdateInput = {};
  if (title !== undefined) {
    if (
      typeof title !== "string" ||
      title.trim().length < 1 ||
      title.trim().length > 30
    ) {
      throw new HttpError(
        400,
        "제목은 30자 이내로 입력해주세요.",
        "validation"
      );
    }
    updateData.title = title.trim();
  }
  if (content !== undefined) {
    if (
      typeof content !== "string" ||
      content.trim().length < 1 ||
      content.trim().length > 1000
    ) {
      throw new HttpError(
        400,
        "내용은 1000자 이내로 입력해주세요.",
        "validation"
      );
    }
    updateData.content = content.trim();
  }
  return articleRepo.update(id, updateData);
}

export async function remove(id: number | string, currentUserId: number) {
  const article = await articleRepo.findById(id);
  if (!article) {
    throw new HttpError(404, "게시글이 존재하지 않습니다.", "notfound");
  }
  if (article.userId !== currentUserId) {
    throw new HttpError(403, "해당 게시글의 삭제 권한이 없습니다.", "auth");
  }
  return articleRepo.remove(id);
}

export default {
  getList,
  getById,
  create,
  update,
  remove,
};
