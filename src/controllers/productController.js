import express from "express";
import productService from "../services/productService.js";
import { verifyProduct } from "";

const productController = express.Router();

productController.get("/", async (req, res, next) => {
  try {
    const { page = 1, pageSize = 10, sort = "recent", q } = req.query;
    const products = await productService.getList({ page, pageSize, sort, q });
    res.json(products);
  } catch (error) {
    next(error);
  }
});

productController.get("/:id", async (req, res, next) => {
  try {
    const product = await productService.getById(req.params.id);
    if (!product)
      return res.status(404).json({ message: "상품을 찾을 수 없습니다." });
    res.json(product);
  } catch (error) {
    next(error);
  }
});

productController.post("/", verifyProduct, async (req, res, next) => {
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

productController.patch("/:id", verifyProduct, async (req, res, next) => {
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

productController.delete("/:id", verifyProduct, async (req, res, next) => {
  try {
    await productService.remove(req.params.id, req.user.id);
    res.status(204).end();
  } catch (error) {
    next(error);
  }
});

export default productController;
