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
exports.ResultResolver = exports.IAnwser = void 0;
const ResultMutationResponse_1 = require("../types/ResultMutationResponse");
const type_graphql_1 = require("type-graphql");
const Exam_1 = require("../entities/Exam");
const Result_1 = require("../entities/Result");
const User_1 = require("../entities/User");
const createScore_1 = require("../utils/createScore");
const checkAuth_1 = require("../middlewares/checkAuth");
let IAnwser = exports.IAnwser = class IAnwser {
};
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", String)
], IAnwser.prototype, "id", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => [String]),
    __metadata("design:type", Array)
], IAnwser.prototype, "options", void 0);
exports.IAnwser = IAnwser = __decorate([
    (0, type_graphql_1.InputType)()
], IAnwser);
let ResultResolver = exports.ResultResolver = class ResultResolver {
    async initResult(examId, userAnswer, { user }) {
        const existingUser = (await User_1.User.findOneBy({ id: user === null || user === void 0 ? void 0 : user.userId }));
        const exam = (await Exam_1.Exam.findOne({
            relations: { questions: true },
            where: {
                id: examId,
            },
        }));
        const score = (0, createScore_1.getScore)(exam.questions, userAnswer);
        const result = Result_1.Result.create({
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
    async createResult(examId, userAnswer, { user }) {
        const exam = (await Exam_1.Exam.findOne({
            relations: { questions: true },
            where: {
                id: examId,
            },
        }));
        const score = (0, createScore_1.getScore)(exam.questions, userAnswer);
        const result = (await Result_1.Result.findOne({
            relations: {
                exam: true,
            },
            where: {
                user: {
                    id: user === null || user === void 0 ? void 0 : user.userId,
                },
                exam: {
                    id: examId,
                },
            },
        }));
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
    async getResults({ user }) {
        const results = (await Result_1.Result.find({
            relations: {
                user: true,
                exam: { questions: true },
            },
            where: {
                user: {
                    id: user === null || user === void 0 ? void 0 : user.userId,
                },
            },
        }));
        return {
            code: 200,
            success: true,
            message: "get result successfully",
            results,
        };
    }
    async getOneResult(resultId, { user }) {
        const result = (await Result_1.Result.findOne({
            relations: {
                user: true,
                exam: {
                    questions: true,
                },
            },
            where: {
                id: resultId,
                user: {
                    id: user === null || user === void 0 ? void 0 : user.userId,
                },
            },
        }));
        return {
            code: 200,
            success: true,
            message: "get result successfully",
            result,
        };
    }
    async getResult(examId, { user }) {
        const results = await Result_1.Result.find({});
        console.log("results", results);
        const result = (await Result_1.Result.findOne({
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
                    id: user === null || user === void 0 ? void 0 : user.userId,
                },
            },
        }));
        return {
            code: 200,
            success: true,
            message: "get result successfully",
            result,
        };
    }
};
__decorate([
    (0, type_graphql_1.Mutation)((_type) => ResultMutationResponse_1.ResultMutationResponse),
    (0, type_graphql_1.UseMiddleware)(checkAuth_1.checkAuth),
    __param(0, (0, type_graphql_1.Arg)("examId")),
    __param(1, (0, type_graphql_1.Arg)("options", (_type) => [IAnwser])),
    __param(2, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Array, Object]),
    __metadata("design:returntype", Promise)
], ResultResolver.prototype, "initResult", null);
__decorate([
    (0, type_graphql_1.Mutation)((_type) => ResultMutationResponse_1.ResultMutationResponse),
    (0, type_graphql_1.UseMiddleware)(checkAuth_1.checkAuth),
    __param(0, (0, type_graphql_1.Arg)("examId")),
    __param(1, (0, type_graphql_1.Arg)("options", (_type) => [IAnwser])),
    __param(2, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Array, Object]),
    __metadata("design:returntype", Promise)
], ResultResolver.prototype, "createResult", null);
__decorate([
    (0, type_graphql_1.Query)((_type) => ResultMutationResponse_1.ResultMutationResponse),
    (0, type_graphql_1.UseMiddleware)(checkAuth_1.checkAuth),
    __param(0, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ResultResolver.prototype, "getResults", null);
__decorate([
    (0, type_graphql_1.Query)((_type) => ResultMutationResponse_1.ResultMutationResponse),
    (0, type_graphql_1.UseMiddleware)(checkAuth_1.checkAuth),
    __param(0, (0, type_graphql_1.Arg)("resultId")),
    __param(1, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], ResultResolver.prototype, "getOneResult", null);
__decorate([
    (0, type_graphql_1.Query)((_type) => ResultMutationResponse_1.ResultMutationResponse),
    (0, type_graphql_1.UseMiddleware)(checkAuth_1.checkAuth),
    __param(0, (0, type_graphql_1.Arg)("examId")),
    __param(1, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], ResultResolver.prototype, "getResult", null);
exports.ResultResolver = ResultResolver = __decorate([
    (0, type_graphql_1.Resolver)()
], ResultResolver);
//# sourceMappingURL=Result.js.map