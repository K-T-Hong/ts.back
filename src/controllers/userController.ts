import express from "express";
import userService from "../services/userService.js";
import auth from "../middlewares/auth.js";

const userController = express.Router();

userController.post("/signup", async (req, res, next) => {
  try {
    const user = await userService.signup(req.body);
    res.status(201).json(user);
  } catch (error) {
    next(error);
  }
});

userController.post("/signin", async (req, res, next) => {
  try {
    const { accessToken, refreshToken } = await userService.signin(req.body);
    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 1000 * 60 * 15,
      sameSite: "strict",
    });
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 1000 * 60 * 60 * 24 * 7,
      sameSite: "strict",
    });

    res.json({ message: "로그인 성공" });
  } catch (error) {
    next(error);
  }
});

userController.post("/refresh-token", async (req, res, next) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      return res.status(401).json({ error: "RefreshToken이 필요합니다." });
    }
    const { accessToken } = await userService.refresh(refreshToken);
    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 1000 * 60 * 15,
      sameSite: "strict",
    });
    res.json({ message: "토큰 갱신 성공" });
  } catch (error) {
    next(error);
  }
});

userController.post("/logout", auth.verifyAuth, async (req, res, next) => {
  try {
    await userService.logout(req.user.id);
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");
    res.status(204).end();
  } catch (error) {
    next(error);
  }
});

userController.get("/me", auth.verifyAuth, async (req, res, next) => {
  try {
    const user = await userService.getMe(req.user.id);
    res.json(user);
  } catch (error) {
    next(error);
  }
});

export default userController;
