"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const jsonwebtoken_1 = require("jsonwebtoken");
const User_1 = require("../entities/User");
const createToken_1 = require("../utils/createToken");
require("dotenv").config();
const router = express_1.default.Router();
router.get("/", async (req, res) => {
    const refreshToken = req.cookies[process.env.REFRESH_TOKEN_NAME];
    if (!refreshToken) {
        return res.sendStatus(401);
    }
    try {
        const decodedUser = (0, jsonwebtoken_1.verify)(refreshToken, process.env.REFRESH_TOKEN_SECRET);
        const existingUser = (await User_1.User.findOneBy({
            id: decodedUser.userId,
        }));
        if (!existingUser) {
            return res.sendStatus(401);
        }
        return res.json({
            success: true,
            accessToken: (0, createToken_1.createToken)("accessToken", existingUser),
        });
    }
    catch (error) {
        return res.json({
            message: error.message,
            code: 403,
        });
    }
});
exports.default = router;
//# sourceMappingURL=refreshToken.js.map