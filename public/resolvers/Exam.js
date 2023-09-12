"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExamResolver = void 0;
const type_graphql_1 = require("type-graphql");
const Exam_1 = require("../entities/Exam");
const Question_1 = require("../entities/Question");
const ExamInput_1 = require("../types/ExamInput");
const UserMutationResponse_1 = require("../types/UserMutationResponse");
const getArrayRandom_1 = require("../utils/getArrayRandom");
const typeorm_1 = require("typeorm");
const PaginatedExams_1 = require("../types/PaginatedExams");
let ExamResolver = exports.ExamResolver = class ExamResolver {
    async createExam({ easy, hard, medium, name, time, timeEnd, timeStart }) {
        const questions = await Question_1.Question.find({});
        const easyQuestions = questions.filter((question) => question.rank === "easy");
        const mediumQuestions = questions.filter((question) => question.rank === "medium");
        const hardQuestions = questions.filter((question) => question.rank === "hard");
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
        const arrEasyQuestion = (0, getArrayRandom_1.getArrayRandom)(easyQuestions, easy);
        const arrMediumQuestion = (0, getArrayRandom_1.getArrayRandom)(mediumQuestions, medium);
        const arrHardQuestion = (0, getArrayRandom_1.getArrayRandom)(hardQuestions, hard);
        for (let i = 0; i < arrEasyQuestion.length; i++) {
            listQuestions.push(easyQuestions[arrEasyQuestion[i]]);
        }
        for (let i = 0; i < arrMediumQuestion.length; i++) {
            listQuestions.push(mediumQuestions[arrMediumQuestion[i]]);
        }
        for (let i = 0; i < arrHardQuestion.length; i++) {
            listQuestions.push(hardQuestions[arrHardQuestion[i]]);
        }
        const newExam = Exam_1.Exam.create({
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
    async getExams(limit, cursor) {
        try {
            const totalCount = await Exam_1.Exam.count();
            const realLimit = Math.min(10, limit);
            const findOptions = {
                take: realLimit,
                order: {
                    createdAt: "DESC",
                },
            };
            let lastExam = [];
            if (cursor) {
                findOptions.where = {
                    createdAt: (0, typeorm_1.LessThan)(new Date(cursor)),
                };
                lastExam = await Exam_1.Exam.find({ order: { createdAt: "ASC" }, take: 1 });
            }
            const exams = await Exam_1.Exam.find(findOptions);
            return {
                totalCount,
                cursor: exams[exams.length - 1].createdAt,
                hasMore: cursor
                    ? exams[exams.length - 1].createdAt.toString() !==
                        lastExam[0].createdAt.toString()
                    : exams.length !== totalCount,
                paginatedExams: exams,
            };
        }
        catch (error) {
            console.log(error);
            return null;
        }
    }
    async getOneExam(ExamIdInput) {
        const exam = await Exam_1.Exam.find({
            relations: { questions: true },
            where: {
                id: ExamIdInput,
            },
        });
        return exam;
    }
};
__decorate([
    (0, type_graphql_1.Mutation)((_type) => UserMutationResponse_1.UserMutationResponse),
    __param(0, (0, type_graphql_1.Arg)("ExamInput")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [ExamInput_1.ExamInput]),
    __metadata("design:returntype", Promise)
], ExamResolver.prototype, "createExam", null);
__decorate([
    (0, type_graphql_1.Query)((_type) => PaginatedExams_1.PaginatedExams, { nullable: true }),
    __param(0, (0, type_graphql_1.Arg)("limit")),
    __param(1, (0, type_graphql_1.Arg)("cursor", { nullable: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String]),
    __metadata("design:returntype", Promise)
], ExamResolver.prototype, "getExams", null);
__decorate([
    (0, type_graphql_1.Query)((_type) => [Exam_1.Exam]),
    __param(0, (0, type_graphql_1.Arg)("ExamIdInput")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], ExamResolver.prototype, "getOneExam", null);
exports.ExamResolver = ExamResolver = __decorate([
    (0, type_graphql_1.Resolver)()
], ExamResolver);
//# sourceMappingURL=Exam.js.map