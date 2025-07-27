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
  if (
    typeof name !== "string" ||
    name.trim().length < 1 ||
    name.trim().length > 30
  ) {
    const err = new Error("상품명은 30자 이내로 입력해주세요.");
    err.status = 400;
    throw err;
  }
  if (
    typeof description !== "string" ||
    description.trim().length < 10 ||
    description.trim().length > 1000
  ) {
    const err = new Error("상품 설명은 10 ~ 1000자 사이로 입력해주세요.");
    err.status = 400;
    throw err;
  }
  const priceNumber = Number(price);
  if (isNaN(priceNumber) || priceNumber < 0) {
    const err = new Error("가격은 0 이상이어야 합니다.");
    err.status = 400;
    throw err;
  }
  if (
    !Array.isArray(images) ||
    !images.every(image => typeof image === "string")
  ) {
    const err = new Error("images는 문자열 배열이어야 합니다.");
    err.status = 400;
    throw err;
  }
  if (
    !Array.isArray(tags) ||
    !tags.every(tag => typeof tag === "string" && tag.trim().length <= 5)
  ) {
    const err = new Error("태그는 각각 5자 이내여야 합니다.");
    err.status = 400;
    throw err;
  }

  return productRepo.create({
    userId: Number(userId),
    name: name.trim(),
    description: description.trim(),
    price: priceNumber,
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

  const updateData = {};

  if (name !== undefined) {
    if (
      typeof name !== "string" ||
      name.trim().length < 1 ||
      name.trim().length > 30
    ) {
      const err = new Error("상품명은 30자 이내로 입력해주세요.");
      err.status = 400;
      throw err;
    }
    updateData.name = name.trim();
  }
  if (description !== undefined) {
    if (
      typeof description !== "string" ||
      description.trim().length < 10 ||
      description.trim().length > 1000
    ) {
      const err = new Error("상품 설명은 10 ~ 1000자 사이로 입력해주세요.");
      err.status = 400;
      throw err;
    }
    updateData.description = description.trim();
  }
  if (price !== undefined) {
    const priceNumber = Number(price);
    if (isNaN(priceNumber) || priceNumber < 0) {
      const err = new Error("가격은 0 이상이어야 합니다.");
      err.status = 400;
      throw err;
    }
    updateData.price = priceNumber;
  }
  if (images !== undefined) {
    if (
      !Array.isArray(images) ||
      !images.every(image => typeof image === "string")
    ) {
      const err = new Error("images는 문자열 배열이어야 합니다.");
      err.status = 400;
      throw err;
    }
    updateData.images = images;
  }
  if (tags !== undefined) {
    if (
      !Array.isArray(tags) ||
      !tags.every(tag => typeof tag === "string" && tag.trim().length <= 5)
    ) {
      const err = new Error("태그는 각각 5자 이내여야 합니다.");
      err.status = 400;
      throw err;
    }
    updateData.tags = tags.map(t => t.trim());
  }

  return productRepo.update(id, updateData);
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
