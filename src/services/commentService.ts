import * as commentRepo from "../repositories/commentRepo.js";
import HttpError from "../utiles/HttpError.js";

export function getAll() {
  return commentRepo.findAll();
}
export function getByProduct(productId: number | string) {
  return commentRepo.findByProduct(productId);
}
export function getByArticle(articleId: number | string) {
  return commentRepo.findByArticle(articleId);
}

export async function createForProduct({
  userId,
  productId,
  content,
}: {
  userId: number;
  productId: number;
  content: string;
}) {
  if (
    !content ||
    typeof content !== "string" ||
    content.trim().length < 1 ||
    content.trim().length > 200
  ) {
    throw new HttpError(400, "댓글은 200자 이내로 입력해주세요.", "validation");
  }
  return commentRepo.create({
    content: content.trim(),
    user: { connect: { id: Number(userId) } },
    product: { connect: { id: Number(productId) } },
  });
}

export async function createForArticle({
  userId,
  articleId,
  content,
}: {
  userId: number;
  articleId: number;
  content: string;
}) {
  if (
    !content ||
    typeof content !== "string" ||
    content.trim().length < 1 ||
    content.trim().length > 200
  ) {
    throw new HttpError(400, "댓글은 200자 이내로 입력해주세요.", "validation");
  }
  return commentRepo.create({
    content: content.trim(),
    user: { connect: { id: Number(userId) } },
    article: { connect: { id: Number(articleId) } },
  });
}

export async function update(
  id: number | string,
  userId: number,
  content: string
) {
  if (
    !content ||
    typeof content !== "string" ||
    content.trim().length < 1 ||
    content.trim().length > 200
  ) {
    throw new HttpError(400, "댓글은 200자 이내로 입력해주세요.", "validation");
  }
  const comment = await commentRepo.findById(id);
  if (!comment) {
    throw new HttpError(404, "댓글이 존재하지 않습니다.", "notfound");
  }
  if (comment.userId !== userId) {
    throw new HttpError(403, "수정 권한이 없습니다.", "auth");
  }
  return commentRepo.update(id, { content: content.trim() });
}

export async function remove(id: number | string, userId: number) {
  const comment = await commentRepo.findById(id);
  if (!comment) {
    throw new HttpError(404, "댓글이 존재하지 않습니다.", "notfound");
  }
  if (comment.userId !== userId) {
    throw new HttpError(403, "삭제 권한이 없습니다.", "auth");
  }
  return commentRepo.remove(id);
}

export default {
  getAll,
  getByProduct,
  getByArticle,
  createForProduct,
  createForArticle,
  update,
  remove,
};
