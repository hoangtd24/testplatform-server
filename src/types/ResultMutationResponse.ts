import { Field, ObjectType } from "type-graphql";
import { Result } from "../entities/Result";
import { IMutationResponse } from "./ResponeseMutation";

@ObjectType({ implements: IMutationResponse })
export class ResultMutationResponse extends IMutationResponse {
  @Field({ nullable: true })
  result?: Result;

  @Field((_type) => [Result], { nullable: true })
  results?: Result[];
}
