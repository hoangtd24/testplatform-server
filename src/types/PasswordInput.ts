import { Field, InputType } from "type-graphql";

@InputType()
export class PasswordInput {
  @Field()
  currentPass: string;

  @Field()
  newPass: string;

  @Field()
  reNewPass: string;
}
