import { Field, ID, ObjectType } from "type-graphql";
import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";

export type UserRoleType = "radio" | "checkbox";
@Entity()
@ObjectType()
export class Question extends BaseEntity {
  @Field((_type) => ID)
  @PrimaryGeneratedColumn()
  id!: number;

  @Field()
  @Column()
  quiz: string;

  @Field(() => [String])
  @Column("text", { array: true })
  options: string[];

  @Field(() => [String])
  @Column("text", { array: true })
  answer: string[];

  @Field()
  @Column()
  rank: string;

  @Field({ defaultValue: "checkbox" })
  @Column({
    type: "enum",
    enum: ["radio", "checkbox"],
    default: "radio",
  })
  type: string;
}
