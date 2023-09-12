"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserResolver = void 0;
const argon2_1 = __importStar(require("argon2"));
const type_graphql_1 = require("type-graphql");
const checkAuth_1 = require("../middlewares/checkAuth");
const LoginInput_1 = require("../types/LoginInput");
const PasswordInput_1 = require("../types/PasswordInput");
const ProfileInput_1 = require("../types/ProfileInput");
const RegisterInput_1 = require("../types/RegisterInput");
const UserMutationResponse_1 = require("../types/UserMutationResponse");
const createToken_1 = require("../utils/createToken");
const UserToken_1 = require("../models/UserToken");
const uuid_1 = require("uuid");
const sendMail_1 = require("../utils/sendMail");
const ResetPasswordInput_1 = require("../types/ResetPasswordInput");
const User_1 = require("../entities/User");
let UserResolver = exports.UserResolver = class UserResolver {
    async register({ email, username, password, birthday, address, phone }) {
        const existingUser = await User_1.User.findOneBy({ email });
        if (existingUser) {
            return {
                code: 400,
                success: false,
                message: "User already regitser",
            };
        }
        const hashPassword = await (0, argon2_1.hash)(password);
        const newUser = User_1.User.create({
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
    async login({ email, password }, { res }) {
        try {
            const existingUser = await User_1.User.findOneBy({ email });
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
            const verifyPassword = await (0, argon2_1.verify)(existingUser.password, password);
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
            (0, createToken_1.sendRefreshToken)(res, existingUser);
            return {
                code: 200,
                success: true,
                message: "login successful",
                user: existingUser,
                accessToken: (0, createToken_1.createToken)("accessToken", existingUser),
            };
        }
        catch (error) {
            return error;
        }
    }
    async getProfile({ user }) {
        const userProfile = (await User_1.User.findOneBy({ id: user === null || user === void 0 ? void 0 : user.userId }));
        return userProfile;
    }
    async updateProfile({ user }, { username, address, birthday, email, phone }) {
        const existingUser = (await User_1.User.findOneBy({ id: user === null || user === void 0 ? void 0 : user.userId }));
        existingUser.username = username;
        existingUser.address = address;
        existingUser.birthday = new Date(birthday);
        existingUser.email = email;
        existingUser.phone = phone;
        await User_1.User.save(existingUser);
        return {
            code: 200,
            success: true,
            message: "Profile updated successfully",
            user: existingUser,
        };
    }
    async logout(userId, { res }) {
        res.clearCookie(process.env.REFRESH_TOKEN_NAME, {
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
    async changePassword({ user }, { currentPass, newPass, reNewPass }) {
        const existingUser = (await User_1.User.findOneBy({ id: user === null || user === void 0 ? void 0 : user.userId }));
        const verifyPassword = await argon2_1.default.verify(existingUser.password, currentPass);
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
        existingUser.password = await argon2_1.default.hash(newPass);
        await User_1.User.save(existingUser);
        return {
            code: 200,
            success: true,
            message: "updated password successfully",
        };
    }
    async me({ user }) {
        const existingUser = await User_1.User.findOneBy({ id: user === null || user === void 0 ? void 0 : user.userId });
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
    async forgetPassword(email) {
        const existingUser = await User_1.User.findOneBy({ email: email });
        if (!existingUser) {
            return true;
        }
        await UserToken_1.TokenModel.findOneAndDelete({ userId: existingUser.id });
        const resetToken = (0, uuid_1.v4)();
        const hashedResetToken = await argon2_1.default.hash(resetToken);
        await UserToken_1.TokenModel.create({
            userId: existingUser.id,
            token: hashedResetToken,
        });
        await (0, sendMail_1.sendMail)(email, `<a href="http://localhost:3000/change-password?token=${resetToken}&userId=${existingUser.id}">Click here to reset your password</a>`);
        return true;
    }
    async resetPassword({ password, token, userId }) {
        try {
            const tokenRecord = await UserToken_1.TokenModel.findOne({ userId: userId });
            if (!tokenRecord) {
                return {
                    code: 400,
                    success: false,
                    message: "Invalid or expired password reset token",
                };
            }
            const hashTokenRecord = argon2_1.default.verify(tokenRecord.token, token);
            if (!hashTokenRecord) {
                return {
                    code: 400,
                    success: false,
                    message: "Invalid or expired password reset token",
                };
            }
            const userIdNum = parseInt(userId);
            const user = await User_1.User.findOneBy({ id: userIdNum });
            if (!user) {
                return {
                    code: 400,
                    success: false,
                    message: "User no longer exists",
                };
            }
            const updatedPassword = await argon2_1.default.hash(password);
            await User_1.User.update({ id: userIdNum }, { password: updatedPassword });
            await tokenRecord.deleteOne();
            return {
                code: 200,
                success: true,
                message: "User password reset successfully",
                user,
            };
        }
        catch (error) {
            console.log(error);
            return error.message;
        }
    }
};
__decorate([
    (0, type_graphql_1.Mutation)((_return) => UserMutationResponse_1.UserMutationResponse),
    __param(0, (0, type_graphql_1.Arg)("registerInput", { validate: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [RegisterInput_1.registerInput]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "register", null);
__decorate([
    (0, type_graphql_1.Mutation)((_return) => UserMutationResponse_1.UserMutationResponse),
    __param(0, (0, type_graphql_1.Arg)("loginInput", { validate: true })),
    __param(1, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [LoginInput_1.loginInput, Object]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "login", null);
__decorate([
    (0, type_graphql_1.Query)((_type) => User_1.User),
    (0, type_graphql_1.UseMiddleware)(checkAuth_1.checkAuth),
    __param(0, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "getProfile", null);
__decorate([
    (0, type_graphql_1.Mutation)((_type) => UserMutationResponse_1.UserMutationResponse),
    (0, type_graphql_1.UseMiddleware)(checkAuth_1.checkAuth),
    __param(0, (0, type_graphql_1.Ctx)()),
    __param(1, (0, type_graphql_1.Arg)("ProfileInput")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, ProfileInput_1.ProfileInput]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "updateProfile", null);
__decorate([
    (0, type_graphql_1.Mutation)((_return) => UserMutationResponse_1.UserMutationResponse),
    __param(0, (0, type_graphql_1.Arg)("userId")),
    __param(1, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "logout", null);
__decorate([
    (0, type_graphql_1.Mutation)((_return) => UserMutationResponse_1.UserMutationResponse),
    (0, type_graphql_1.UseMiddleware)(checkAuth_1.checkAuth),
    __param(0, (0, type_graphql_1.Ctx)()),
    __param(1, (0, type_graphql_1.Arg)("PasswordInput")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, PasswordInput_1.PasswordInput]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "changePassword", null);
__decorate([
    (0, type_graphql_1.Query)((_return) => UserMutationResponse_1.UserMutationResponse),
    (0, type_graphql_1.UseMiddleware)(checkAuth_1.checkAuth),
    __param(0, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "me", null);
__decorate([
    (0, type_graphql_1.Mutation)((_return) => Boolean),
    __param(0, (0, type_graphql_1.Arg)("email")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "forgetPassword", null);
__decorate([
    (0, type_graphql_1.Mutation)((_return) => UserMutationResponse_1.UserMutationResponse),
    __param(0, (0, type_graphql_1.Arg)("resetPasswordInput")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [ResetPasswordInput_1.resetPasswordInput]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "resetPassword", null);
exports.UserResolver = UserResolver = __decorate([
    (0, type_graphql_1.Resolver)((_of) => User_1.User)
], UserResolver);
//# sourceMappingURL=User.js.map