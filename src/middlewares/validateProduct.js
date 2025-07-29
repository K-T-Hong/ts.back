export default function validateProduct(req, res, next) {
  const { name, description, price, tags } = req.body;

  if (
    !name ||
    typeof name !== "string" ||
    name.trim().length < 1 ||
    name.trim().length > 30
  ) {
    return res
      .status(400)
      .json({ error: "상품명은 1~30자 이내로 입력해주세요." });
  }
  if (
    !description ||
    typeof description !== "string" ||
    description.trim().length < 10 ||
    description.trim().length > 1000
  ) {
    return res
      .status(400)
      .json({ error: "상품 설명은 10~1000자 이내로 입력해주세요." });
  }
  if (!price || isNaN(Number(price)) || Number(price) < 0) {
    return res.status(400).json({ error: "가격은 0 이상이어야 합니다." });
  }
  if (
    tags &&
    (!Array.isArray(tags) ||
      !tags.every(t => typeof t === "string" && t.trim().length <= 5))
  ) {
    return res
      .status(400)
      .json({ error: "태그는 배열이며 각 5자 이내여야 합니다." });
  }
  next();
}
