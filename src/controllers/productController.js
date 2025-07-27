import express from "express";
import productService from "../services/productService.js";
import auth from "../middlewares/auth.js";
import validateProduct from "../middlewares/validateProduct.js";
import upload from "../middlewares/uploadImg.js";

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
    res.json(product);
  } catch (error) {
    next(error);
  }
});

productController.post(
  "/",
  auth.verifyAuth,
  upload.array("images", 3),
  validateProduct,
  async (req, res, next) => {
    try {
      const images = req.files.map(file => file.path);
      const { name, description, price, tags } = req.body;
      const tagsArr = typeof tags === "string" ? JSON.parse(tags) : tags;
      const product = await productService.create({
        userId: req.user.id,
        name,
        description,
        price,
        images,
        tags: tagsArr,
      });
      res.status(201).json(product);
    } catch (error) {
      next(error);
    }
  }
);

productController.patch(
  "/:id",
  auth.verifyAuth,
  upload.array("images", 3),
  validateProduct,
  async (req, res, next) => {
    try {
      const images = req.files.length
        ? req.files.map(file => file.path)
        : req.body.images;
      const { name, description, price, tags } = req.body;
      const tagsArr = typeof tags === "string" ? JSON.parse(tags) : tags;
      const updated = await productService.update(
        req.params.id,
        {
          name,
          description,
          price,
          images,
          tags: tagsArr,
        },
        req.user.id
      );
      res.json(updated);
    } catch (error) {
      next(error);
    }
  }
);

productController.delete("/:id", auth.verifyAuth, async (req, res, next) => {
  try {
    await productService.remove(req.params.id, req.user.id);
    res.status(204).end();
  } catch (error) {
    next(error);
  }
});

export default productController;
