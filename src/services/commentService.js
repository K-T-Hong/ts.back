import commentRepo from "../repositories/commentRepo.js";

function getAll() {
  return commentRepo.findAll();
}
function getByProduct(productId) {
  return commentRepo.findByProduct(productId);
}
function getByArticle(articleId) {
  return commentRepo.findByArticle(articleId);
}

async function createForProduct({ userId, productId, content }) {
  if (
    !content ||
    typeof content !== "string" ||
    content.trim().length < 1 ||
    content.trim().length > 200
  ) {
    const err = new Error("댓글은 200자 이내로 입력해주세요.");
    err.status = 400;
    throw err;
  }
  return commentRepo.create({
    content: content.trim(),
    userId: Number(userId),
    productId: Number(productId),
  });
}

async function createForArticle({ userId, articleId, content }) {
  if (
    !content ||
    typeof content !== "string" ||
    content.trim().length < 1 ||
    content.trim().length > 200
  ) {
    const err = new Error("댓글은 200자 이내로 입력해주세요.");
    err.status = 400;
    throw err;
  }
  return commentRepo.create({
    content: content.trim(),
    userId: Number(userId),
    articleId: Number(articleId),
  });
}

async function update(id, userId, content) {
  if (
    !content ||
    typeof content !== "string" ||
    content.trim().length < 1 ||
    content.trim().length > 200
  ) {
    const err = new Error("댓글은 200자 이내로 입력해주세요.");
    err.status = 400;
    throw err;
  }
  const comment = await commentRepo.findById(id);
  if (!comment) {
    const err = new Error("댓글이 존재하지 않습니다.");
    err.status = 404;
    throw err;
  }
  if (comment.userId !== userId) {
    const err = new Error("수정 권한이 없습니다.");
    err.status = 403;
    throw err;
  }
  return commentRepo.update(id, { content: content.trim() });
}

async function remove(id, userId) {
  const comment = await commentRepo.findById(id);
  if (!comment) {
    const err = new Error("댓글이 존재하지 않습니다.");
    err.status = 404;
    throw err;
  }
  if (comment.userId !== userId) {
    const err = new Error("삭제 권한이 없습니다.");
    err.status = 403;
    throw err;
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
