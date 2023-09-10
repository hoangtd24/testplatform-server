import { Field, InputType } from "type-graphql";

@InputType()
export class ExamInput {
  @Field()
  name: string;

  @Field()
  timeStart: Date;

  @Field()
  timeEnd: Date;

  @Field()
  time: number;

  @Field()
  easy: number;

  @Field()
  medium: number;

  @Field()
  hard: number;
}
