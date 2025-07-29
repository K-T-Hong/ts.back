import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Strategy as KakaoStrategy } from "passport-kakao";
import userRepo from "../repositories/userRepo.js";

passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser(async (id, done) => {
  const user = await userRepo.findById(id);
  done(null, user);
});

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const providerId = String(profile.id);
        let user = await userRepo.findBySocial("google", profile.id);
        if (!user) {
          user = await userRepo.createSocial({
            provider: "google",
            providerId,
            email: profile.emails?.[0]?.value,
            nickname: profile.displayName,
            image: profile.photos?.[0]?.value,
          });
        }
        done(null, user);
      } catch (err) {
        done(err);
      }
    }
  )
);

passport.use(
  new KakaoStrategy(
    {
      clientID: process.env.KAKAO_CLIENT_ID,
      clientSecret: process.env.KAKAO_CLIENT_SECRET,
      callbackURL: "/auth/kakao/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const providerId = String(profile.id);
        let user = await userRepo.findBySocial("kakao", profile.id);
        if (!user) {
          user = await userRepo.createSocial({
            provider: "kakao",
            providerId,
            email: profile._json.kakao_account?.email,
            nickname: profile.displayName,
            image: profile._json.properties?.profile_image,
          });
        }
        done(null, user);
      } catch (err) {
        done(err);
      }
    }
  )
);

export default passport;
