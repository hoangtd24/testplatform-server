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
import "reflect-metadata";
import { buildSchema } from "type-graphql";
import { DataSource } from "typeorm";
import { Exam } from "./entities/Exam";
import { Question } from "./entities/Question";
import { Result } from "./entities/Result";
import { User } from "./entities/User";
import { ExamResolver } from "./resolvers/Exam";
import { Greeting } from "./resolvers/Gretting";
import { QuestionResolver } from "./resolvers/Question";
import { ResultResolver } from "./resolvers/Result";
import { UserResolver } from "./resolvers/User";
import refreshToken from "./routes/refreshToken";
require("dotenv").config();

export const AppDataSource = new DataSource({
  type: "postgres",
  host: "localhost",
  port: 5432,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: "testplatform",
  entities: [User, Question, Exam, Result],
  synchronize: true,
  logging: true,
});
const main = async () => {
  AppDataSource.initialize()
    .then(() => {
      console.log("Data Source has been initialized!");
    })
    .catch((err) => {
      console.error("Error during Data Source initialization", err);
    });

  const app = express();
  app.use(
    cors({
      origin: ["http://localhost:3000"],
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
      origin: ["http://localhost:3000"],
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
