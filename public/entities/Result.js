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
exports.Result = exports.ObjectIdScalar = void 0;
const graphql_1 = require("graphql");
const type_graphql_1 = require("type-graphql");
const typeorm_1 = require("typeorm");
const Exam_1 = require("./Exam");
const User_1 = require("./User");
exports.ObjectIdScalar = new graphql_1.GraphQLScalarType({
    name: "ObjectId",
    description: "Mongo object id scalar type",
    serialize(value) {
        if (!(value instanceof Object)) {
            throw new Error("ObjectIdScalar can only serialize ObjectId values");
        }
        return JSON.stringify(value);
    },
    parseValue(value) {
        if (typeof value !== "string") {
            throw new Error("ObjectIdScalar can only parse string values");
        }
        return new Object(value);
    },
    parseLiteral(ast) {
        if (ast.kind !== graphql_1.Kind.STRING) {
            throw new Error("ObjectIdScalar can only parse string values");
        }
        return new Object(ast.value);
    },
});
let Result = exports.Result = class Result extends typeorm_1.BaseEntity {
};
__decorate([
    (0, type_graphql_1.Field)((_type) => type_graphql_1.ID),
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Result.prototype, "id", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    (0, typeorm_1.ManyToOne)(() => Exam_1.Exam),
    (0, typeorm_1.JoinColumn)(),
    __metadata("design:type", Exam_1.Exam)
], Result.prototype, "exam", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    (0, typeorm_1.ManyToOne)(() => User_1.User),
    (0, typeorm_1.JoinColumn)(),
    __metadata("design:type", User_1.User)
], Result.prototype, "user", void 0);
__decorate([
    (0, type_graphql_1.Field)((_type) => exports.ObjectIdScalar),
    (0, typeorm_1.Column)("jsonb"),
    __metadata("design:type", Array)
], Result.prototype, "userAnswer", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], Result.prototype, "score", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    (0, typeorm_1.Column)("timestamp without time zone", { default: "now()" }),
    __metadata("design:type", Date)
], Result.prototype, "timeStart", void 0);
exports.Result = Result = __decorate([
    (0, type_graphql_1.ObjectType)(),
    (0, typeorm_1.Entity)()
], Result);
//# sourceMappingURL=Result.js.map