import express from "express";
import { Secret, verify } from "jsonwebtoken";
import { User } from "../entities/User";
import { UserAuthPlayload } from "../types/UserAuthPayload";
import { createToken } from "../utils/createToken";
require("dotenv").config();
const router = express.Router();

router.get("/", async (req, res) => {
  const refreshToken = req.cookies[process.env.REFRESH_TOKEN_NAME as string];
  if (!refreshToken) {
    return res.sendStatus(401);
  }
  try {
    const decodedUser = verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET as Secret
    ) as UserAuthPlayload;

    const existingUser = (await User.findOneBy({
      id: decodedUser.userId,
    })) as User;

    if (!existingUser) {
      return res.sendStatus(401);
    }

    // sendRefreshToken(res, existingUser);
    return res.json({
      success: true,
      accessToken: createToken("accessToken", existingUser),
    });
  } catch (error) {
    // console.log(error);
    return res.json({
      message: error.message,
      code: 403,
    });
  }
});

export default router;
