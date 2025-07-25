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

async function getById(id) {
  return articleRepo.findById(id);
}

async function create({ userId, title, content }) {
  if (!userId || isNaN(Number(userId))) {
    throw new Error("유효한 userId가 필요합니다.");
  }
  if (
    typeof title !== "string" ||
    title.trim().length < 1 ||
    title.trim().length > 30
  )
    throw new Error("제목은 30자 이내로 입력해주세요.");
  if (
    typeof content !== "string" ||
    content.trim().length < 1 ||
    content.trim().length > 1000
  )
    throw new Error("내용은 1000자 이내로 입력해주세요.");

  return articleRepo.create({
    userId: Number(userId),
    title: title.trim(),
    content: content.trim(),
  });
}

async function update(id, { title, content }, currentUserId) {
  const article = await articleRepo.findById(id);
  if (!article) throw new Error("게시글이 존재하지 않습니다.");
  if (article.userId !== currentUserId)
    throw new Error("해당 게시글의 수정 권한이 없습니다.");

  const updateData = {};
  if (title !== undefined) {
    if (
      typeof title !== "string" ||
      title.trim().length < 1 ||
      title.trim().length > 30
    )
      throw new Error("제목은 30자 이내로 입력해주세요.");
    updateData.title = title.trim();
  }
  if (content !== undefined) {
    if (
      typeof content !== "string" ||
      content.trim().length < 1 ||
      content.trim().length > 1000
    )
      throw new Error("내용은 1000자 이내로 입력해주세요.");
    updateData.content = content.trim();
  }

  return articleRepo.update(id, updateData);
}

async function remove(id, currentUserId) {
  const article = await articleRepo.findById(id);
  if (!article) {
    throw new Error("게시글이 존재하지 않습니다.");
  }
  if (article.userId !== currentUserId) {
    throw new Error("해당 게시글의 삭제 권한이 없습니다.");
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
