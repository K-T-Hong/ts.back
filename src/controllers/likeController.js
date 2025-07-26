import express from "express";
import likeService from "../services/likeService.js";
import auth from "../middlewares/auth.js";

const likeController = express.Router();

likeController.post(
  "/articles/:articleId/likes",
  auth.verifyAuth,
  async (req, res, next) => {
    try {
      const like = await likeService.like(req.user.id, req.params.articleId);
      res.json(like);
    } catch (error) {
      next(error);
    }
  }
);

likeController.get(
  "/articles/:articleId/likes/count",
  async (req, res, next) => {
    try {
      const count = await likeService.count(req.params.articleId);
      res.json({ count });
    } catch (error) {
      next(error);
    }
  }
);

export default likeController;
