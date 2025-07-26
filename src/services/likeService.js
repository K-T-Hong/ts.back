import likeRepo from "../repositories/likeRepo.js";

async function like(userId, articleId) {
  const already = await likeRepo.findByLike(userId, articleId);
  if (already) {
    await likeRepo.remove(userId, articleId);
    return { liked: false };
  } else {
    await likeRepo.create(userId, articleId);
    return { liked: true };
  }
}

async function count(articleId) {
  return likeRepo.countByArticle(articleId);
}

export default { like, count };
