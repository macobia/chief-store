import passport from "passport";
import  GoogleStrategy from "passport-google-oauth20";
import User from "../models/user.model.js";
import { generateToken, storeRefreshToken } from "../utils/tokenHelpers.js";
import dotenv from "dotenv"


dotenv.config();

passport.use(
  new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      // Check if user already exists
      const existingUser = await User.findOne({ email: profile.emails[0].value });
      if (existingUser) return done(null, existingUser);

      // Otherwise create new user
      const newUser = await User.create({
        name: profile.displayName,
        email: profile.emails[0].value,
        image: profile.photos[0].value,
        password: "google-oauth", // placeholder
      });

      done(null, newUser);
    } catch (error) {
      done(error, false);
    }
  })
);

// Serialize user into session
passport.serializeUser((user, done) => {
  done(null, user.id);
});
passport.deserializeUser(async (id, done) => {
  const user = await User.findById(id);
  done(null, user);
});