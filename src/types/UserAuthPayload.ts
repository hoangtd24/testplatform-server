import { JwtPayload } from "jsonwebtoken";

export type UserAuthPlayload = JwtPayload & {
  userId: number;
};
