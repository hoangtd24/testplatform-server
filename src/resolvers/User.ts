import argon2, { hash, verify } from "argon2";
import {
  Arg,
  Ctx,
  Mutation,
  Query,
  Resolver,
  UseMiddleware,
} from "type-graphql";
import { User } from "../entities/User";
import { checkAuth } from "../middlewares/checkAuth";
import { Context } from "../types/Context";
import { loginInput } from "../types/LoginInput";
import { PasswordInput } from "../types/PasswordInput";
import { ProfileInput } from "../types/ProfileInput";
import { registerInput } from "../types/RegisterInput";
import { UserMutationResponse } from "../types/UserMutationResponse";
import { createToken, sendRefreshToken } from "../utils/createToken";
import { TokenModel } from "../models/UserToken";
import { v4 as uuidv4 } from "uuid";
import { sendMail } from "../utils/sendMail";
import { resetPasswordInput } from "../types/ResetPasswordInput";

@Resolver((_of) => User)
export class UserResolver {
  @Mutation((_return) => UserMutationResponse)
  async register(
    @Arg("registerInput", { validate: true })
    { email, username, password, birthday, address, phone }: registerInput
  ): Promise<UserMutationResponse> {
    const existingUser = await User.findOneBy({ email });
    if (existingUser) {
      return {
        code: 400,
        success: false,
        message: "User already regitser",
      };
    }
    const hashPassword = await hash(password);
    const newUser = User.create({
      email,
      password: hashPassword,
      username,
      phone,
      address,
      birthday: birthday ? new Date(birthday) : new Date(),
    });
    await newUser.save();
    return {
      code: 201,
      success: true,
      message: "Register user successfully",
      user: newUser,
    };
  }

  @Mutation((_return) => UserMutationResponse)
  async login(
    @Arg("loginInput", { validate: true }) { email, password }: loginInput,
    @Ctx() { res }: Context
  ): Promise<UserMutationResponse> {
    try {
      const existingUser = await User.findOneBy({ email });
      if (!existingUser) {
        return {
          code: 400,
          success: false,
          message: "Email or password incorrect",
          errors: [
            {
              field: "email",
              message: "Email or password incorrect",
            },
          ],
        };
      }

      const verifyPassword = await verify(existingUser.password, password);
      if (!verifyPassword) {
        return {
          code: 400,
          success: false,
          message: "Email or password incorrect",
          errors: [
            {
              field: "password",
              message: "Email or password incorrect",
            },
          ],
        };
      }

      sendRefreshToken(res, existingUser);

      return {
        code: 200,
        success: true,
        message: "login successful",
        user: existingUser,
        accessToken: createToken("accessToken", existingUser),
      };
    } catch (error) {
      return error;
    }
  }

  @Query((_type) => User)
  @UseMiddleware(checkAuth)
  async getProfile(@Ctx() { user }: Context) {
    const userProfile = (await User.findOneBy({ id: user?.userId })) as User;

    return userProfile;
  }

  @Mutation((_type) => UserMutationResponse)
  @UseMiddleware(checkAuth)
  async updateProfile(
    @Ctx() { user }: Context,
    @Arg("ProfileInput")
    { username, address, birthday, email, phone }: ProfileInput
  ): Promise<UserMutationResponse> {
    const existingUser = (await User.findOneBy({ id: user?.userId })) as User;
    existingUser.username = username;
    existingUser.address = address;
    existingUser.birthday = new Date(birthday);
    existingUser.email = email;
    existingUser.phone = phone;

    await User.save(existingUser);

    return {
      code: 200,
      success: true,
      message: "Profile updated successfully",
      user: existingUser,
    };
  }

  @Mutation((_return) => UserMutationResponse)
  async logout(
    @Arg("userId") userId: number,
    @Ctx() { res }: Context
  ): Promise<UserMutationResponse> {
    res.clearCookie(process.env.REFRESH_TOKEN_NAME as string, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      path: "/refresh_token",
    });

    return {
      code: 200,
      success: true,
      message: "Logout successfully",
    };
  }

  @Mutation((_return) => UserMutationResponse)
  @UseMiddleware(checkAuth)
  async changePassword(
    @Ctx() { user }: Context,
    @Arg("PasswordInput") { currentPass, newPass, reNewPass }: PasswordInput
  ): Promise<UserMutationResponse> {
    const existingUser = (await User.findOneBy({ id: user?.userId })) as User;
    const verifyPassword = await argon2.verify(
      existingUser.password,
      currentPass
    );
    if (!verifyPassword) {
      return {
        code: 400,
        success: false,
        message: "current password incorrect",
      };
    }
    if (newPass !== reNewPass) {
      return {
        code: 400,
        success: false,
        message: "retype password incorrect",
      };
    }
    existingUser.password = await argon2.hash(newPass);
    await User.save(existingUser);
    return {
      code: 200,
      success: true,
      message: "updated password successfully",
    };
  }

  @Query((_return) => UserMutationResponse)
  @UseMiddleware(checkAuth)
  async me(@Ctx() { user }: Context): Promise<UserMutationResponse> {
    const existingUser = await User.findOneBy({ id: user?.userId });
    if (!existingUser) {
      return {
        code: 400,
        success: false,
        message: "user not found",
      };
    }
    return {
      code: 200,
      success: true,
      message: "get user successfully",
      user: existingUser,
    };
  }

  @Mutation((_return) => Boolean)
  async forgetPassword(@Arg("email") email: string): Promise<Boolean> {
    const existingUser = await User.findOneBy({ email: email });
    if (!existingUser) {
      return true;
    }
    await TokenModel.findOneAndDelete({ userId: existingUser.id });
    const resetToken = uuidv4();
    const hashedResetToken = await argon2.hash(resetToken);
    await TokenModel.create({
      userId: existingUser.id,
      token: hashedResetToken,
    });
    await sendMail(
      email,
      `<a href="http://localhost:3000/change-password?token=${resetToken}&userId=${existingUser.id}">Click here to reset your password</a>`
    );
    return true;
  }

  @Mutation((_return) => UserMutationResponse)
  async resetPassword(
    @Arg("resetPasswordInput") { password, token, userId }: resetPasswordInput
  ): Promise<UserMutationResponse> {
    try {
      const tokenRecord = await TokenModel.findOne({ userId: userId });
      if (!tokenRecord) {
        return {
          code: 400,
          success: false,
          message: "Invalid or expired password reset token",
        };
      }
      const hashTokenRecord = argon2.verify(tokenRecord.token, token);

      if (!hashTokenRecord) {
        return {
          code: 400,
          success: false,
          message: "Invalid or expired password reset token",
        };
      }
      const userIdNum = parseInt(userId);
      const user = await User.findOneBy({ id: userIdNum });

      if (!user) {
        return {
          code: 400,
          success: false,
          message: "User no longer exists",
        };
      }

      const updatedPassword = await argon2.hash(password);
      await User.update({ id: userIdNum }, { password: updatedPassword });

      await tokenRecord.deleteOne();

      return {
        code: 200,
        success: true,
        message: "User password reset successfully",
        user,
      };
    } catch (error) {
      console.log(error);
      return error.message;
    }
  }
}
