import express from "express";
import favoriteService from "../services/favoriteService.js";
import auth from "../middlewares/auth.js";

const favoriteController = express.Router();

favoriteController.post(
  "/products/:productId/favorites",
  auth.verifyAuth,
  async (req, res, next) => {
    try {
      const result = await favoriteService.favorite(
        req.user.id,
        req.params.productId
      );
      res.json(result);
    } catch (error) {
      next(error);
    }
  }
);

favoriteController.get(
  "/products/:productId/favorites/count",
  async (req, res, next) => {
    try {
      const favoriteCount = await favoriteService.count(req.params.productId);
      res.json({ count: favoriteCount });
    } catch (error) {
      next(error);
    }
  }
);

export default favoriteController;
