import { AuthenticationError } from "apollo-server-express";
import { Secret, verify } from "jsonwebtoken";
import { UserAuthPlayload } from "src/types/UserAuthPayload";
import { MiddlewareFn } from "type-graphql";
import { Context } from "../types/Context";

export const checkAuth: MiddlewareFn<Context> = ({ context }, next) => {
  try {
    const authHeader = context.req.headers.authorization;
    const token = authHeader && authHeader.split(" ")[1];
    if (!token) {
      throw new AuthenticationError(
        "Not authenticated to perform GRAPHQL operations"
      );
    }

    const decodedUser = verify(
      token,
      process.env.ACCESS_TOKEN_SECRET as Secret
    ) as UserAuthPlayload;

    context.user = decodedUser;
    return next();
  } catch (error) {
    throw new AuthenticationError("Error authenticated user");
  }
};
