import prisma from "../config/prisma.js";
import articleRepo from "../repositories/articleRepo.js";

async function getList({ page, pageSize, sort, keyword }) {
  const pageNum = Number(page);
  const limit = Number(pageSize);
  const skip = (pageNum - 1) * limit;

  const where = keyword
    ? {
        OR: [
          { title: { contains: keyword, mode: "insensitive" } },
          { content: { contains: keyword, mode: "insensitive" } },
        ],
      }
    : {};

  const orderBy =
    sort === "recent" ? { createdAt: "desc" } : { createdAt: "desc" };

  const [list, totalCount] = await Promise.all([
    articleRepo.findMany({ where, orderBy, skip, take: limit }),
    articleRepo.count({ where }),
  ]);

  return { list, totalCount, page: pageNum, pageSize: limit };
}

async function getById(id, userId) {
  const [article, like] = await prisma.$transaction([
    articleRepo.findById(id),
    userId
      ? prisma.like.findUnique({
          where: {
            userId_articleId: {
              userId: Number(userId),
              articleId: Number(id),
            },
          },
        })
      : Promise.resolve(null),
  ]);
  if (!article) {
    const err = new Error("게시글을 찾을 수 없습니다.");
    err.status = 404;
    throw err;
  }
  return { ...article, isLiked: !!like };
}

async function create({ userId, title, content }) {
  if (!userId || isNaN(Number(userId))) {
    const err = new Error("유효한 userId가 필요합니다.");
    err.status = 400;
    throw err;
  }
  if (
    typeof title !== "string" ||
    title.trim().length < 1 ||
    title.trim().length > 30
  ) {
    const err = new Error("제목은 30자 이내로 입력해주세요.");
    err.status = 400;
    throw err;
  }
  if (
    typeof content !== "string" ||
    content.trim().length < 1 ||
    content.trim().length > 1000
  ) {
    const err = new Error("내용은 1000자 이내로 입력해주세요.");
    err.status = 400;
    throw err;
  }
  return articleRepo.create({
    userId: Number(userId),
    title: title.trim(),
    content: content.trim(),
  });
}

async function update(id, { title, content }, currentUserId) {
  const article = await articleRepo.findById(id);
  if (!article) {
    const err = new Error("게시글이 존재하지 않습니다.");
    err.status = 404;
    throw err;
  }
  if (article.userId !== currentUserId) {
    const err = new Error("해당 게시글의 수정 권한이 없습니다.");
    err.status = 403;
    throw err;
  }

  const updateData = {};
  if (title !== undefined) {
    if (
      typeof title !== "string" ||
      title.trim().length < 1 ||
      title.trim().length > 30
    ) {
      const err = new Error("제목은 30자 이내로 입력해주세요.");
      err.status = 400;
      throw err;
    }
    updateData.title = title.trim();
  }
  if (content !== undefined) {
    if (
      typeof content !== "string" ||
      content.trim().length < 1 ||
      content.trim().length > 1000
    ) {
      const err = new Error("내용은 1000자 이내로 입력해주세요.");
      err.status = 400;
      throw err;
    }
    updateData.content = content.trim();
  }

  return articleRepo.update(id, updateData);
}

async function remove(id, currentUserId) {
  const article = await articleRepo.findById(id);
  if (!article) {
    const err = new Error("게시글이 존재하지 않습니다.");
    err.status = 404;
    throw err;
  }
  if (article.userId !== currentUserId) {
    const err = new Error("해당 게시글의 삭제 권한이 없습니다.");
    err.status = 403;
    throw err;
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
