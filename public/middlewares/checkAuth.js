"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkAuth = void 0;
const apollo_server_express_1 = require("apollo-server-express");
const jsonwebtoken_1 = require("jsonwebtoken");
const checkAuth = ({ context }, next) => {
    try {
        const authHeader = context.req.headers.authorization;
        const token = authHeader && authHeader.split(" ")[1];
        if (!token) {
            throw new apollo_server_express_1.AuthenticationError("Not authenticated to perform GRAPHQL operations");
        }
        const decodedUser = (0, jsonwebtoken_1.verify)(token, process.env.ACCESS_TOKEN_SECRET);
        context.user = decodedUser;
        return next();
    }
    catch (error) {
        throw new apollo_server_express_1.AuthenticationError("Error authenticated user");
    }
};
exports.checkAuth = checkAuth;
//# sourceMappingURL=checkAuth.js.map