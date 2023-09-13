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
exports.QuestionResolver = void 0;
const QuestionInput_1 = require("../types/QuestionInput");
const type_graphql_1 = require("type-graphql");
const Question_1 = require("../entities/Question");
const UserMutationResponse_1 = require("../types/UserMutationResponse");
let QuestionResolver = exports.QuestionResolver = class QuestionResolver {
    async createQuestion({ answer, options, quiz, rank, type }) {
        const question = Question_1.Question.create({
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
    async getQuestion(QuestionIdInput) {
        const question = await Question_1.Question.findOneBy({ id: QuestionIdInput });
        return question;
    }
};
__decorate([
    (0, type_graphql_1.Mutation)((_type) => UserMutationResponse_1.UserMutationResponse),
    __param(0, (0, type_graphql_1.Arg)("QuestionInput")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [QuestionInput_1.QuestionInput]),
    __metadata("design:returntype", Promise)
], QuestionResolver.prototype, "createQuestion", null);
__decorate([
    (0, type_graphql_1.Query)((_type) => Question_1.Question),
    __param(0, (0, type_graphql_1.Arg)("QuestionIdInput")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], QuestionResolver.prototype, "getQuestion", null);
exports.QuestionResolver = QuestionResolver = __decorate([
    (0, type_graphql_1.Resolver)()
], QuestionResolver);
//# sourceMappingURL=Question.js.map