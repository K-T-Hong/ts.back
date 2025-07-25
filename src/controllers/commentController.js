import express from "express";
import commentService from "../services/commentService.js";
import auth from "../middlewares/auth.js";

const commentController = express.Router();

commentController.get("/comments", async (req, res, next) => {
  try {
    const comments = await commentService.getAll();
    res.json(comments);
  } catch (err) {
    next(err);
  }
});

commentController.get(
  "/products/:productId/comments",
  async (req, res, next) => {
    try {
      const comments = await commentService.getByProduct(req.params.productId);
      res.json(comments);
    } catch (err) {
      next(err);
    }
  }
);

commentController.get(
  "/articles/:articleId/comments",
  async (req, res, next) => {
    try {
      const comments = await commentService.getByArticle(req.params.articleId);
      res.json(comments);
    } catch (err) {
      next(err);
    }
  }
);

commentController.post(
  "/products/:productId/comments",
  auth.verifyAuth,
  async (req, res, next) => {
    try {
      const comment = await commentService.createForProduct({
        userId: req.user.id,
        productId: req.params.productId,
        content: req.body.content,
      });
      res.status(201).json(comment);
    } catch (err) {
      next(err);
    }
  }
);

commentController.post(
  "/articles/:articleId/comments",
  auth.verifyAuth,
  async (req, res, next) => {
    try {
      const comment = await commentService.createForArticle({
        userId: req.user.id,
        articleId: req.params.articleId,
        content: req.body.content,
      });
      res.status(201).json(comment);
    } catch (err) {
      next(err);
    }
  }
);

commentController.patch(
  "/comments/:id",
  auth.verifyAuth,
  async (req, res, next) => {
    try {
      const comment = await commentService.update(
        req.params.id,
        req.user.id,
        req.body.content
      );
      res.json(comment);
    } catch (err) {
      next(err);
    }
  }
);

commentController.delete(
  "/comments/:id",
  auth.verifyAuth,
  async (req, res, next) => {
    try {
      await commentService.remove(req.params.id, req.user.id);
      res.status(204).end();
    } catch (err) {
      next(err);
    }
  }
);

export default commentController;
