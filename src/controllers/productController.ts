import express from "express";
import * as productService from "../services/productService.js";
import auth from "../middlewares/auth.js";
import validateProduct from "../middlewares/validateProduct.js";
import upload from "../middlewares/uploadImg.js";

type ProductListQueryDTO = {
  page?: unknown;
  pageSize?: unknown;
  sort?: "recent";
  keyword?: String;
};
type ProductCreateBody = {
  name: string;
  description: string;
  price: number | string;
  tags: string[] | string;
};
type ProductUpdateBody = ProductCreateBody & { images: string[] };

const toInt = (v: unknown, def: number) => {
  const n = Number(v);
  return Number.isFinite(n) && n > 0 ? n : def;
};

const productController = express.Router();

productController.get("/", async (req, res, next) => {
  try {
    const { page, pageSize, sort, keyword } = req.query as ProductListQueryDTO;
    const products = await productService.getList({
      page: toInt(page, 1),
      pageSize: toInt(pageSize, 10),
      sort: (sort ?? "recent") as "recent",
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
    const product = await productService.getById(req.params.id, userId ?? 0);
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
      const files = (req.files as Express.Multer.File[]) || [];
      const images = files.map(f => f.path);
      const { name, description, price, tags } =
        req.body as unknown as ProductCreateBody;
      const tagsArr = Array.isArray(tags) ? tags : JSON.parse(tags ?? "[]");
      const product = await productService.create({
        userId: req.user!.id,
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
      const files = (req.files as Express.Multer.File[]) || [];
      const images =
        files.length > 0
          ? files.map(f => f.path)
          : (req.body as { images: string[] }).images;
      const { name, description, price, tags } =
        req.body as unknown as ProductCreateBody;
      const tagsArr = Array.isArray(tags) ? tags : JSON.parse(tags ?? "[]");
      const updated = await productService.update(
        req.params.id,
        { name, description, price, images, tags: tagsArr },
        req.user!.id
      );
      res.json(updated);
    } catch (error) {
      next(error);
    }
  }
);

productController.delete("/:id", auth.verifyAuth, async (req, res, next) => {
  try {
    await productService.remove(req.params.id, req.user!.id);
    res.status(204).end();
  } catch (error) {
    next(error);
  }
});

export default productController;
