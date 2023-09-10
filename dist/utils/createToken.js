"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendRefreshToken = exports.createToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const createToken = (type, user) => {
    const token = jsonwebtoken_1.default.sign({
        userId: user.id,
    }, type === "accessToken"
        ? process.env.ACCESS_TOKEN_SECRET
        : process.env.REFRESH_TOKEN_SECRET, {
        expiresIn: type === "accessToken" ? "1m" : "1d",
    });
    return token;
};
exports.createToken = createToken;
const sendRefreshToken = (res, user) => {
    res.cookie(process.env.REFRESH_TOKEN_NAME, (0, exports.createToken)("refreshToken", user), {
        httpOnly: true,
        secure: true,
        sameSite: "lax",
        path: "/refresh_token",
    });
};
exports.sendRefreshToken = sendRefreshToken;
//# sourceMappingURL=createToken.js.map