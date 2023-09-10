import { Context } from "../types/Context";
import { checkAuth } from "../middlewares/checkAuth";
import { Resolver, Query, UseMiddleware, Ctx } from "type-graphql";
import { User } from "../entities/User";

@Resolver()
export class Greeting {
  @Query((_return) => String)
  @UseMiddleware(checkAuth)
  async hello(@Ctx() { user }: Context) {
    const existingUser = await User.findOneBy({ id: user?.userId });
    return `Hello a ${existingUser?.username} nhé !!!!`;
  }
}
