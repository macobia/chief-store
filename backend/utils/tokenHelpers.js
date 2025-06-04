import jwt from "jsonwebtoken";
import { redis } from '../lib/redis.js';

export const generateToken = (userId) => {
  const accessToken = jwt.sign({ userId }, process.env.JWT_SECRET_ACCESS_TOKEN, {
    expiresIn: "90m",
  });

  const refreshToken = jwt.sign({ userId }, process.env.JWT_SECRET_REFRESH_TOKEN, {
    expiresIn: "7d",
  });

  return { accessToken, refreshToken };
};

export const storeRefreshToken = async (userId, refreshToken) => {
  await redis.set(`refreshToken:${userId}`, refreshToken, 'EX', 7 * 24 * 60 * 60);
};

export const setCookies = (res, accessToken, refreshToken) => {
  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    maxAge: 90 * 60 * 1000,
  });
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
};
