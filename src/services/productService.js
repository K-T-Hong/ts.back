import prisma from "../config/prisma.js";
import productRepo from "../repositories/productRepo.js";

async function getList({ page, pageSize, sort, keyword }) {
  const pageNum = Number(page);
  const limit = Number(pageSize);
  const skip = (pageNum - 1) * limit;

  const where = keyword
    ? {
        OR: [
          { name: { contains: keyword, mode: "insensitive" } },
          { description: { contains: keyword, mode: "insensitive" } },
        ],
      }
    : {};

  const orderBy =
    sort === "recent" ? { createdAt: "desc" } : { createdAt: "desc" };

  const [list, totalCount] = await Promise.all([
    productRepo.findMany({ where, orderBy, skip, take: limit }),
    productRepo.count({ where }),
  ]);

  return { list, totalCount, page: pageNum, pageSize: limit };
}

async function getById(id, userId) {
  const [product, favorite] = await prisma.$transaction([
    productRepo.findById(id),
    userId
      ? prisma.favorite.findUnique({
          where: {
            userId_productId: {
              userId: Number(userId),
              productId: Number(id),
            },
          },
        })
      : Promise.resolve(null),
  ]);
  if (!product) {
    const err = new Error("상품을 찾을 수 없습니다.");
    err.status = 404;
    throw err;
  }
  return { ...product, isLiked: !!favorite };
}

async function create({ userId, name, description, price, images, tags }) {
  if (!userId || isNaN(Number(userId))) {
    const err = new Error("유효한 userId가 필요합니다.");
    err.status = 400;
    throw err;
  }
  return productRepo.create({
    userId: Number(userId),
    name: name.trim(),
    description: description.trim(),
    price: Number(price),
    images,
    tags: tags.map(tag => tag.trim()),
  });
}

async function update(
  id,
  { name, description, price, images, tags },
  currentUserId
) {
  const product = await productRepo.findById(id);
  if (!product) {
    const err = new Error("상품이 존재하지 않습니다.");
    err.status = 404;
    throw err;
  }
  if (product.userId !== currentUserId) {
    const err = new Error("해당 상품의 수정 권한이 없습니다.");
    err.status = 403;
    throw err;
  }

  return productRepo.update(id, {
    name: name.trim(),
    description: description.trim(),
    price: Number(price),
    images,
    tags: tags.map(t => t.trim()),
  });
}

async function remove(id, currentUserId) {
  const product = await productRepo.findById(id);
  if (!product) {
    const err = new Error("상품이 존재하지 않습니다.");
    err.status = 404;
    throw err;
  }
  if (product.userId !== currentUserId) {
    const err = new Error("해당 상품의 삭제 권한이 없습니다.");
    err.status = 403;
    throw err;
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
