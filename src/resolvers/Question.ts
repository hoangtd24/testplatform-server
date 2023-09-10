import { QuestionInput } from "../types/QuestionInput";
import { Arg, Mutation, Query, Resolver } from "type-graphql";
import { Question } from "../entities/Question";
import { UserMutationResponse } from "../types/UserMutationResponse";

@Resolver()
export class QuestionResolver {
  @Mutation((_type) => UserMutationResponse)
  async createQuestion(
    @Arg("QuestionInput") { answer, options, quiz, rank, type }: QuestionInput
  ): Promise<UserMutationResponse> {
    const question = Question.create({
      answer,
      options,
      quiz,
      rank,
      type
    });
    await question.save();
    return {
      code: 200,
      success: true,
      message: "create question successfully",
    };
  }

  @Query((_type) => Question)
  async getQuestion(@Arg("QuestionIdInput") QuestionIdInput: number) {
    const question = await Question.findOneBy({ id: QuestionIdInput });
    return question;
  }
}
