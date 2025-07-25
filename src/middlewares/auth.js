async function verifyProductAuth(req, res, next) {
  const user = req.user;
  if (!user || !user.id) {
    return res.status(401).json({ error: "로그인이 필요합니다." });
  }
  next();
}

export default { verifyProductAuth };
