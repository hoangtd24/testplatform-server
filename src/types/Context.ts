import { Request, Response } from "express";
import { UserAuthPlayload } from "./UserAuthPayload";

export type Context = {
  req: Request;
  res: Response;
  user?: UserAuthPlayload;
};
