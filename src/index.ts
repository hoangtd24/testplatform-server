import {
  ApolloServerPluginDrainHttpServer,
  ApolloServerPluginLandingPageGraphQLPlayground,
} from "apollo-server-core";
import { ApolloServer } from "apollo-server-express";
import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import http from "http";
// import mongoose from "mongoose";
require("dotenv").config();
import "reflect-metadata";
import { buildSchema } from "type-graphql";
import { DataSource } from "typeorm";
import { Exam } from "./entities/Exam";
import { Question } from "./entities/Question";
import { Result } from "./entities/Result";
import { ExamResolver } from "./resolvers/Exam";
import { Greeting } from "./resolvers/Gretting";
import { QuestionResolver } from "./resolvers/Question";
import { ResultResolver } from "./resolvers/Result";
import { UserResolver } from "./resolvers/User";
import refreshToken from "./routes/refreshToken";
import { User } from "./entities/User";
import { __prod__ } from "./constants";
import path from "path";

export const AppDataSource = new DataSource({
  type: "postgres",
  ...(__prod__
    ? { url: process.env.POSTGRES_URL }
    : {
        database: process.env.POSTGRES_DATABASE,
        username: process.env.POSTGRES_USER,
        password: process.env.POSTGRES_PASSWORD,
      }),
  logging: true,
  ...(__prod__
    ? {
        extra: {
          ssl: {
            rejectUnauthorized: false,
          },
        },
        ssl: true,
      }
    : {}),
  ...(__prod__ ? {} : { synchronize: true }),
  entities: [Question, Result, Exam, User],
  migrations: [path.join(__dirname, "./migrations/*")],
});
const main = async () => {
  await AppDataSource.initialize()
    .then(() => {
      console.log("Data Source has been initialized!");
    })
    .catch((err) => {
      console.error("Error during Data Source initialization", err);
    });
  if (__prod__) {
    try {
      await AppDataSource.runMigrations();
    } catch (error) {
      console.log(error.message);
    }
  }

  const app = express();
  app.use(
    cors({
      origin: __prod__
        ? process.env.CORS_ORIGIN_PROD
        : process.env.CORS_ORIGIN_DEV,
      credentials: true,
    })
  );
  app.use(cookieParser());
  app.use("/refresh_token", refreshToken);

  const httpServer = http.createServer(app);

  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [
        Greeting,
        UserResolver,
        QuestionResolver,
        ExamResolver,
        ResultResolver,
      ],
    }),
    plugins: [
      ApolloServerPluginDrainHttpServer({ httpServer }),
      ApolloServerPluginLandingPageGraphQLPlayground,
    ],
    context: ({ req, res }) => ({ req, res }),
  });
  await apolloServer.start();

  // await mongoose.connect(
  //   `mongodb+srv://hoangtd241100:${process.env.MONGOOSE_PASS}@cluster0.qm90imq.mongodb.net/?retryWrites=true&w=majority`
  // );
  // console.log("MongoDB Connected");
  apolloServer.applyMiddleware({
    app,
    cors: {
      origin: __prod__
        ? process.env.CORS_ORIGIN_PROD
        : process.env.CORS_ORIGIN_DEV,
      credentials: true,
      allowedHeaders: ["Content-Type", "Authorization"],
    },
  });

  const PORT = process.env.PORT || 4000;

  await new Promise((resolve) =>
    httpServer.listen({ port: PORT }, resolve as () => void)
  );

  // Typically, http://localhost:4000/graphql
  console.log(
    `SERVER STARTED ON PORT ${PORT}. GRAPHQL ENDPOINT ON http://localhost:${PORT}${apolloServer.graphqlPath}`
  );
};

main();
