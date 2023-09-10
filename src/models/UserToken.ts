import { prop, getModelForClass } from "@typegoose/typegoose";

export class UserToken {
  @prop({ required: true })
  userId: string;

  @prop({ required: true })
  token: string;

  @prop({ default: Date.now, expires: 60 * 10 })
  createdAt: Date;
}

export const TokenModel = getModelForClass(UserToken);
