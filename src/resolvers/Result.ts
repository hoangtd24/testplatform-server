import { ResultMutationResponse } from "../types/ResultMutationResponse";
import {
  Arg,
  Ctx,
  Field,
  InputType,
  Mutation,
  Query,
  Resolver,
  UseMiddleware,
} from "type-graphql";
import { Exam } from "../entities/Exam";
import { Result } from "../entities/Result";
import { User } from "../entities/User";
import { getScore } from "../utils/createScore";
import { checkAuth } from "../middlewares/checkAuth";
import { Context } from "../types/Context";

@InputType()
export class IAnwser {
  @Field()
  id: string;

  @Field(() => [String])
  options: string[];
}
@Resolver()
export class ResultResolver {
  @Mutation((_type) => ResultMutationResponse)
  @UseMiddleware(checkAuth)
  async initResult(
    @Arg("examId") examId: number,
    @Arg("options", (_type) => [IAnwser])
    userAnswer: IAnwser[],
    @Ctx() { user }: Context
  ): Promise<ResultMutationResponse> {
    const existingUser = (await User.findOneBy({ id: user?.userId })) as User;
    const exam = (await Exam.findOne({
      relations: { questions: true },
      where: {
        id: examId,
      },
    })) as Exam;
    const score = getScore(exam.questions, userAnswer);
    const result = Result.create({
      user: existingUser,
      exam,
      userAnswer,
      score,
      timeStart: new Date(),
    });
    await result.save();
    return {
      code: 200,
      success: true,
      message: "success",
      result: result,
    };
  }

  @Mutation((_type) => ResultMutationResponse)
  @UseMiddleware(checkAuth)
  async createResult(
    @Arg("examId") examId: number,
    @Arg("options", (_type) => [IAnwser])
    userAnswer: IAnwser[],
    @Ctx() { user }: Context
  ): Promise<ResultMutationResponse> {
    const exam = (await Exam.findOne({
      relations: { questions: true },
      where: {
        id: examId,
      },
    })) as Exam;
    const score = getScore(exam.questions, userAnswer);
    const result = (await Result.findOne({
      relations: {
        exam: true,
      },
      where: {
        user: {
          id: user?.userId,
        },
        exam: {
          id: examId,
        },
      },
    })) as Result;

    result.userAnswer = userAnswer;
    result.score = score;

    await result.save();
    return {
      code: 200,
      success: true,
      message: "success",
      result: result,
    };
  }

  @Query((_type) => ResultMutationResponse)
  @UseMiddleware(checkAuth)
  async getResults(@Ctx() { user }: Context): Promise<ResultMutationResponse> {
    const results = (await Result.find({
      relations: {
        user: true,
        exam: { questions: true },
      },
      where: {
        user: {
          id: user?.userId,
        },
      },
    })) as Result[];
    return {
      code: 200,
      success: true,
      message: "get result successfully",
      results,
    };
  }

  @Query((_type) => ResultMutationResponse)
  @UseMiddleware(checkAuth)
  async getOneResult(
    @Arg("resultId") resultId: number,
    @Ctx() { user }: Context
  ): Promise<ResultMutationResponse> {
    const result = (await Result.findOne({
      relations: {
        user: true,
        exam: {
          questions: true,
        },
      },
      where: {
        id: resultId,
        user: {
          id: user?.userId,
        },
      },
    })) as Result;
    return {
      code: 200,
      success: true,
      message: "get result successfully",
      result,
    };
  }

  @Query((_type) => ResultMutationResponse)
  @UseMiddleware(checkAuth)
  async getResult(
    @Arg("examId") examId: number,
    @Ctx() { user }: Context
  ): Promise<ResultMutationResponse> {
    const results = await Result.find({});
    console.log("results", results);
    const result = (await Result.findOne({
      relations: {
        user: true,
        exam: {
          questions: true,
        },
      },
      where: {
        exam: {
          id: examId,
        },
        user: {
          id: user?.userId,
        },
      },
      
    })) as Result;
    return {
      code: 200,
      success: true,
      message: "get result successfully",
      result,
    };
  }
}
