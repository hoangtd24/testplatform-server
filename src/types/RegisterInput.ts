import { Field, InputType } from "type-graphql";
import { IsEmail, MinLength } from "class-validator";

@InputType()
export class registerInput {
  @Field()
  @IsEmail()
  email: string;

  @Field()
  password: string;

  @Field()
  @MinLength(6)
  username: string;

  @Field({ nullable: true })
  birthday: string;

  @Field({ nullable: true })
  phone: string;

  @Field({ nullable: true })
  address: string;
}
