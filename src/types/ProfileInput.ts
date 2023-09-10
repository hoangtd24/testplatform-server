import { Field, InputType } from "type-graphql";

@InputType()
export class ProfileInput {
  @Field()
  email: string;

  @Field()
  username: string;

  @Field({ nullable: true })
  birthday: string;

  @Field({ nullable: true })
  phone: string;

  @Field({ nullable: true })
  address: string;
}
