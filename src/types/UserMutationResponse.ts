import { Field, ObjectType } from "type-graphql";
import { IMutationResponse } from "./ResponeseMutation";
import { User } from "../entities/User";
import { FieldError } from "./FieldError";

@ObjectType({ implements: IMutationResponse })
export class UserMutationResponse extends IMutationResponse {
  @Field({ nullable: true })
  user?: User;

  @Field({ nullable: true })
  accessToken?: string;

  @Field(() => [FieldError], { nullable: true })
  errors?: FieldError[];
}
