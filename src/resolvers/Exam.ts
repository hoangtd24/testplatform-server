import { Arg, Mutation, Query, Resolver } from "type-graphql";
import { Exam } from "../entities/Exam";
import { Question } from "../entities/Question";
import { ExamInput } from "../types/ExamInput";
import { UserMutationResponse } from "../types/UserMutationResponse";
import { getArrayRandom } from "../utils/getArrayRandom";
import { LessThan } from "typeorm";
import { PaginatedExams } from "../types/PaginatedExams";

@Resolver()
export class ExamResolver {
  @Mutation((_type) => UserMutationResponse)
  async createExam(
    @Arg("ExamInput")
    { easy, hard, medium, name, time, timeEnd, timeStart }: ExamInput
  ): Promise<UserMutationResponse> {
    const questions = await Question.find({});
    const easyQuestions = questions.filter(
      (question) => question.rank === "easy"
    );
    const mediumQuestions = questions.filter(
      (question) => question.rank === "medium"
    );
    const hardQuestions = questions.filter(
      (question) => question.rank === "hard"
    );
    if (easyQuestions.length < easy) {
      return {
        code: 400,
        success: false,
        message: "the number of easy questions is not enough",
      };
    }

    if (mediumQuestions.length < medium) {
      return {
        code: 400,
        success: false,
        message: "the number of medium questions is not enough",
      };
    }

    if (hardQuestions.length < hard) {
      return {
        code: 400,
        success: false,
        message: "the number of hard questions is not enough",
      };
    }
    const listQuestions = [];
    const arrEasyQuestion = getArrayRandom(easyQuestions, easy);
    const arrMediumQuestion = getArrayRandom(mediumQuestions, medium);
    const arrHardQuestion = getArrayRandom(hardQuestions, hard);

    for (let i = 0; i < arrEasyQuestion.length; i++) {
      listQuestions.push(easyQuestions[arrEasyQuestion[i]]);
    }
    for (let i = 0; i < arrMediumQuestion.length; i++) {
      listQuestions.push(mediumQuestions[arrMediumQuestion[i]]);
    }
    for (let i = 0; i < arrHardQuestion.length; i++) {
      listQuestions.push(hardQuestions[arrHardQuestion[i]]);
    }

    const newExam = Exam.create({
      name,
      time,
      timeEnd,
      timeStart,
      questions: listQuestions,
    });
    await newExam.save();
    return {
      code: 200,
      success: true,
      message: "create exam successfully",
    };
  }

  @Query((_type) => PaginatedExams, { nullable: true })
  async getExams(
    @Arg("limit") limit: number,
    @Arg("cursor", { nullable: true }) cursor: string
  ): Promise<PaginatedExams | null> {
    try {
      const totalCount = await Exam.count();
      const realLimit = Math.min(10, limit)
      const findOptions: { [key: string]: any } = {
        take: realLimit,
        order: {
          createdAt: "DESC",
        },
      };
      let lastExam: Exam[] = [];
      if (cursor) {
        findOptions.where = {
          createdAt: LessThan(new Date(cursor)),
        };
        lastExam = await Exam.find({ order: { createdAt: "ASC" }, take: 1 });
      }
      const exams = await Exam.find(findOptions);
      return {
        totalCount,
        cursor: exams[exams.length - 1].createdAt,
        hasMore: cursor
          ? exams[exams.length - 1].createdAt.toString() !==
            lastExam[0].createdAt.toString()
          : exams.length !== totalCount,
        paginatedExams: exams,
      };
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  @Query((_type) => [Exam])
  async getOneExam(@Arg("ExamIdInput") ExamIdInput: number) {
    const exam = await Exam.find({
      relations: { questions: true },
      where: {
        id: ExamIdInput,
      },
    });
    return exam;
  }
}
