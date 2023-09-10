import { Question } from "../entities/Question";
import { Field, InputType, registerEnumType } from "type-graphql";

export enum TypeQuestion {
  RADIO = "radio",
  CHECKBOX = "checkbox",
}

registerEnumType(TypeQuestion, {
  name: "TypeQuestion",
});

@InputType()
export class QuestionInput implements Partial<Question> {
  @Field()
  quiz: string;

  @Field(() => [String])
  options: string[];

  @Field(() => [String])
  answer: string[];

  @Field()
  rank: string;

  @Field((_type) => TypeQuestion)
  type: TypeQuestion;

}
