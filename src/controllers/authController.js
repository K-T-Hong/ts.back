import express from "express";
import passport from "../config/passport.js";

const authController = express.Router();

authController.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);
authController.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/login",
    session: false,
  }),
  (req, res) => {
    res.json({ user: req.user, message: "구글 로그인 성공" });
  }
);

authController.get("/kakao", passport.authenticate("kakao"));
authController.get(
  "/kakao/callback",
  passport.authenticate("kakao", { failureRedirect: "/login", session: false }),
  (req, res) => {
    res.json({ user: req.user, message: "카카오 로그인 성공" });
  }
);

export default authController;
