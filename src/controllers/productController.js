import express from "express";
import productService from "../services/productService.js";
import auth from "../middlewares/auth.js";

const productController = express.Router();

productController.get("/", async (req, res, next) => {
  try {
    const { page = 1, pageSize = 10, sort = "recent", keyword } = req.query;
    const products = await productService.getList({
      page,
      pageSize,
      sort,
      keyword,
    });
    res.json(products);
  } catch (error) {
    next(error);
  }
});

productController.get("/:id", async (req, res, next) => {
  try {
    const userId = req.user?.id;
    const product = await productService.getById(req.params.id, userId);
    if (!product) {
      return res.status(404).json({ message: "상품을 찾을 수 없습니다." });
    }
    res.json(product);
  } catch (error) {
    next(error);
  }
});

productController.post("/", auth.verifyAuth, async (req, res, next) => {
  try {
    const product = await productService.create({
      ...req.body,
      userId: req.user.id,
    });
    res.status(201).json(product);
  } catch (error) {
    next(error);
  }
});

productController.patch("/:id", auth.verifyAuth, async (req, res, next) => {
  try {
    const updated = await productService.update(
      req.params.id,
      req.body,
      req.user.id
    );
    res.json(updated);
  } catch (error) {
    next(error);
  }
});

productController.delete("/:id", auth.verifyAuth, async (req, res, next) => {
  try {
    await productService.remove(req.params.id, req.user.id);
    res.status(204).end();
  } catch (error) {
    next(error);
  }
});

export default productController;
