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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Question = void 0;
const type_graphql_1 = require("type-graphql");
const typeorm_1 = require("typeorm");
let Question = exports.Question = class Question extends typeorm_1.BaseEntity {
};
__decorate([
    (0, type_graphql_1.Field)((_type) => type_graphql_1.ID),
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Question.prototype, "id", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Question.prototype, "quiz", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => [String]),
    (0, typeorm_1.Column)("text", { array: true }),
    __metadata("design:type", Array)
], Question.prototype, "options", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => [String]),
    (0, typeorm_1.Column)("text", { array: true }),
    __metadata("design:type", Array)
], Question.prototype, "answer", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Question.prototype, "rank", void 0);
__decorate([
    (0, type_graphql_1.Field)({ defaultValue: "checkbox" }),
    (0, typeorm_1.Column)({
        type: "enum",
        enum: ["radio", "checkbox"],
        default: "radio",
    }),
    __metadata("design:type", String)
], Question.prototype, "type", void 0);
exports.Question = Question = __decorate([
    (0, typeorm_1.Entity)(),
    (0, type_graphql_1.ObjectType)()
], Question);
//# sourceMappingURL=Question.js.map