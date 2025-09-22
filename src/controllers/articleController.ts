import express from "express";
import * as articleService from "../services/articleService.js";
import auth from "../middlewares/auth.js";

type articleListQueryDTO = {
  page?: unknown;
  pageSize?: unknown;
  sort?: "recent";
  keyword?: string;
};
type ArticleCreateBody = { title: string; content: string };
type ArticleUpdateBody = Partial<ArticleCreateBody>;

const toInt = (v: unknown, def: number) => {
  const n = Number(v);
  return Number.isFinite(n) && n > 0 ? n : def;
};

const articleController = express.Router();

articleController.get("/", async (req, res, next) => {
  try {
    const { page, pageSize, sort, keyword } = req.query as articleListQueryDTO;
    const result = await articleService.getList({
      page: toInt(page, 1),
      pageSize: toInt(pageSize, 10),
      sort: (sort ?? "recent") as "recent",
      keyword,
    });
    res.json(result);
  } catch (error) {
    next(error);
  }
});

articleController.get("/:id", async (req, res, next) => {
  try {
    const userId = req.user?.id;
    const article = await articleService.getById(req.params.id, userId);
    res.json(article);
  } catch (error) {
    next(error);
  }
});

articleController.post("/", auth.verifyAuth, async (req, res, next) => {
  try {
    const body = req.body as unknown as ArticleCreateBody;
    const article = await articleService.create({
      ...body,
      userId: req.user!.id,
    });
    res.status(201).json(article);
  } catch (error) {
    next(error);
  }
});

articleController.patch("/:id", auth.verifyAuth, async (req, res, next) => {
  try {
    const body = req.body as unknown as ArticleUpdateBody;
    const article = await articleService.update(req.params.id, req.user!.id);
    res.json(article);
  } catch (error) {
    next(error);
  }
});

articleController.delete("/:id", auth.verifyAuth, async (req, res, next) => {
  try {
    await articleService.remove(req.params.id, req.user!.id);
    res.status(204).end();
  } catch (error) {
    next(error);
  }
});

export default articleController;
