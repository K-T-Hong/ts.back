import express from "express";
import * as likeService from "../services/likeService.js";
import auth from "../middlewares/auth.js";

const toInt = (v: string) => Number(v);
const likeController = express.Router();

likeController.post(
  "/articles/:articleId/likes",
  auth.verifyAuth,
  async (req, res, next) => {
    try {
      const result = await likeService.like(
        req.user!.id,
        toInt(req.params.articleId)
      );
      res.json(result);
    } catch (error) {
      next(error);
    }
  }
);

likeController.get(
  "/articles/:articleId/likes/count",
  async (req, res, next) => {
    try {
      const likeCount = await likeService.count(toInt(req.params.articleId));
      res.json({ count: likeCount });
    } catch (error) {
      next(error);
    }
  }
);

export default likeController;
