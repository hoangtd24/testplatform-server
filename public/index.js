"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppDataSource = void 0;
const apollo_server_core_1 = require("apollo-server-core");
const apollo_server_express_1 = require("apollo-server-express");
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
require("dotenv").config();
require("reflect-metadata");
const type_graphql_1 = require("type-graphql");
const typeorm_1 = require("typeorm");
const Exam_1 = require("./entities/Exam");
const Question_1 = require("./entities/Question");
const Result_1 = require("./entities/Result");
const Exam_2 = require("./resolvers/Exam");
const Gretting_1 = require("./resolvers/Gretting");
const Question_2 = require("./resolvers/Question");
const Result_2 = require("./resolvers/Result");
const User_1 = require("./resolvers/User");
const refreshToken_1 = __importDefault(require("./routes/refreshToken"));
const User_2 = require("./entities/User");
const constants_1 = require("./constants");
const path_1 = __importDefault(require("path"));
exports.AppDataSource = new typeorm_1.DataSource(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign({ type: "postgres" }, (constants_1.__prod__
    ? { url: process.env.POSTGRES_URL }
    : {
        database: process.env.POSTGRES_DATABASE,
        username: process.env.POSTGRES_USER,
        password: process.env.POSTGRES_PASSWORD,
    })), { logging: true }), (constants_1.__prod__
    ? {
        extra: {
            ssl: {
                rejectUnauthorized: false,
            },
        },
        ssl: true,
    }
    : {})), (constants_1.__prod__ ? {} : { synchronize: true })), { entities: [Question_1.Question, Result_1.Result, Exam_1.Exam, User_2.User], migrations: [path_1.default.join(__dirname, "./migrations/*")] }));
const main = async () => {
    await exports.AppDataSource.initialize()
        .then(() => {
        console.log("Data Source has been initialized!");
    })
        .catch((err) => {
        console.error("Error during Data Source initialization", err);
    });
    if (constants_1.__prod__) {
        try {
            await exports.AppDataSource.runMigrations();
        }
        catch (error) {
            console.log(error.message);
        }
    }
    const app = (0, express_1.default)();
    app.use((0, cors_1.default)({
        origin: constants_1.__prod__
            ? process.env.CORS_ORIGIN_PROD
            : process.env.CORS_ORIGIN_DEV,
        credentials: true,
    }));
    app.use((0, cookie_parser_1.default)());
    app.use("/refresh_token", refreshToken_1.default);
    const httpServer = http_1.default.createServer(app);
    const apolloServer = new apollo_server_express_1.ApolloServer({
        schema: await (0, type_graphql_1.buildSchema)({
            resolvers: [
                Gretting_1.Greeting,
                User_1.UserResolver,
                Question_2.QuestionResolver,
                Exam_2.ExamResolver,
                Result_2.ResultResolver,
            ],
        }),
        plugins: [
            (0, apollo_server_core_1.ApolloServerPluginDrainHttpServer)({ httpServer }),
            apollo_server_core_1.ApolloServerPluginLandingPageGraphQLPlayground,
        ],
        context: ({ req, res }) => ({ req, res }),
    });
    await apolloServer.start();
    apolloServer.applyMiddleware({
        app,
        cors: {
            origin: constants_1.__prod__
                ? process.env.CORS_ORIGIN_PROD
                : process.env.CORS_ORIGIN_DEV,
            credentials: true,
            allowedHeaders: ["Content-Type", "Authorization"],
        },
    });
    const PORT = process.env.PORT || 4000;
    await new Promise((resolve) => httpServer.listen({ port: PORT }, resolve));
    console.log(`SERVER STARTED ON PORT ${PORT}. GRAPHQL ENDPOINT ON http://localhost:${PORT}${apolloServer.graphqlPath}`);
};
main();
//# sourceMappingURL=index.js.map