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
exports.QuestionInput = exports.TypeQuestion = void 0;
const type_graphql_1 = require("type-graphql");
var TypeQuestion;
(function (TypeQuestion) {
    TypeQuestion["RADIO"] = "radio";
    TypeQuestion["CHECKBOX"] = "checkbox";
})(TypeQuestion || (exports.TypeQuestion = TypeQuestion = {}));
(0, type_graphql_1.registerEnumType)(TypeQuestion, {
    name: "TypeQuestion",
});
let QuestionInput = exports.QuestionInput = class QuestionInput {
};
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", String)
], QuestionInput.prototype, "quiz", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => [String]),
    __metadata("design:type", Array)
], QuestionInput.prototype, "options", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => [String]),
    __metadata("design:type", Array)
], QuestionInput.prototype, "answer", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", String)
], QuestionInput.prototype, "rank", void 0);
__decorate([
    (0, type_graphql_1.Field)((_type) => TypeQuestion),
    __metadata("design:type", String)
], QuestionInput.prototype, "type", void 0);
exports.QuestionInput = QuestionInput = __decorate([
    (0, type_graphql_1.InputType)()
], QuestionInput);
//# sourceMappingURL=QuestionInput.js.map