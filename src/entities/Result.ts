import { GraphQLScalarType, Kind } from "graphql";
import { Field, ID, ObjectType } from "type-graphql";
import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Exam } from "./Exam";
import { User } from "./User";

export const ObjectIdScalar = new GraphQLScalarType({
  name: "ObjectId",
  description: "Mongo object id scalar type",
  serialize(value: unknown): string {
    // check the type of received value
    if (!(value instanceof Object)) {
      throw new Error("ObjectIdScalar can only serialize ObjectId values");
    }
    return JSON.stringify(value); // value sent to the client
  },
  parseValue(value: unknown): Object {
    // check the type of received value
    if (typeof value !== "string") {
      throw new Error("ObjectIdScalar can only parse string values");
    }
    return new Object(value); // value from the client input variables
  },
  parseLiteral(ast): Object {
    // check the type of received value
    if (ast.kind !== Kind.STRING) {
      throw new Error("ObjectIdScalar can only parse string values");
    }
    return new Object(ast.value); // value from the client query
  },
});

export interface Anwser {
  id: string;
  options: string[];
}
@ObjectType()
@Entity()
export class Result extends BaseEntity {
  @Field((_type) => ID)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @ManyToOne(() => Exam)
  @JoinColumn()
  exam: Exam;

  @Field()
  @ManyToOne(() => User)
  @JoinColumn()
  user: User;

  @Field((_type) => ObjectIdScalar)
  @Column("jsonb")
  userAnswer: Anwser[];

  @Field()
  @Column()
  score: number;

  @Field()
  @Column("timestamp without time zone", { default: "now()" })
  timeStart: Date;
}
