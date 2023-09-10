import { Response } from "express";
import { User } from "../entities/User";
import jwt, { Secret } from "jsonwebtoken";
export const createToken = (
  type: "accessToken" | "refreshToken",
  user: User
) => {
  const token = jwt.sign(
    {
      userId: user.id,
    },
    type === "accessToken"
      ? (process.env.ACCESS_TOKEN_SECRET as Secret)
      : (process.env.REFRESH_TOKEN_SECRET as Secret),
    {
      expiresIn: type === "accessToken" ? "1m" : "1d",
    }
  );
  return token;
};

export const sendRefreshToken = (res: Response, user: User) => {
  res.cookie(
    process.env.REFRESH_TOKEN_NAME as string,
    createToken("refreshToken", user),
    {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      path: "/refresh_token",
    }
  );
};
