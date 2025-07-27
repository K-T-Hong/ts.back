import express from "express";
import articleService from "../services/articleService.js";
import auth from "../middlewares/auth.js";

const articleController = express.Router();

articleController.get("/", async (req, res, next) => {
  try {
    const { page = 1, pageSize = 10, sort = "recent", keyword } = req.query;
    const result = await articleService.getList({
      page,
      pageSize,
      sort,
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
    const article = await articleService.create({
      ...req.body,
      userId: req.user.id,
    });
    res.status(201).json(article);
  } catch (error) {
    next(error);
  }
});

articleController.patch("/:id", auth.verifyAuth, async (req, res, next) => {
  try {
    const article = await articleService.update(
      req.params.id,
      req.body,
      req.user.id
    );
    res.json(article);
  } catch (error) {
    next(error);
  }
});

articleController.delete("/:id", auth.verifyAuth, async (req, res, next) => {
  try {
    await articleService.remove(req.params.id, req.user.id);
    res.status(204).end();
  } catch (error) {
    next(error);
  }
});

export default articleController;
