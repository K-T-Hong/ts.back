import express from "express";
import userService from "../services/userService.js";
import auth from "../middlewares/auth.js";

const userController = express.Router();

userController.post("/signup", async (req, res, next) => {
  try {
    const user = await userService.signup(req.body);
    res.status(201).json(user);
  } catch (err) {
    next(err);
  }
});

userController.post("/signin", async (req, res, next) => {
  try {
    const result = await userService.signin(req.body);
    res.json(result);
  } catch (err) {
    next(err);
  }
});

userController.post("/refresh-token", async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    const result = await userService.refresh(refreshToken);
    res.json(result);
  } catch (err) {
    next(err);
  }
});

userController.post("/logout", auth.verifyAuth, async (req, res, next) => {
  try {
    await userService.logout(req.user.id);
    res.status(204).end();
  } catch (err) {
    next(err);
  }
});

userController.get("/me", auth.verifyAuth, async (req, res, next) => {
  try {
    const user = await userService.getMe(req.user.id);
    res.json(user);
  } catch (err) {
    next(err);
  }
});

export default userController;
